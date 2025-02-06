<?php

namespace App\Services;

use App\Helpers\Address;
use App\Helpers\DocumentNumber;
use App\Helpers\Period;
use App\Jobs\DeliveryPlanEmailJob;
use App\Models\AgreementLine;
use App\Models\DeliveryPlanHeader;
use App\Models\DeliveryPlanLine;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DeliveryPlanService
{
    protected Carbon $currentDate;
    protected string $currentPeriod;

    public function __construct()
    {
        $this->currentDate = Carbon::now();
        $this->currentPeriod = $this->currentDate->format('Y-m');
    }

    public function run(): void
    {
        $pdf_currentPeriod = $this->currentDate->format('F Y');
        $pdf_cutOffDate = $this->currentDate->format('25-m-Y');

        $customers = $this->getCustomers($this->currentPeriod);

        foreach ($customers as $customer) {
            $products = $this->getProducts($customer['id'], $this->currentPeriod);

            $data = [
                'monthYear' => $pdf_currentPeriod,
                'cutOffDate' => $pdf_cutOffDate,
                'customer' => [
                    'fullName' => $customer['fullName'],
                    'address' => $customer['address'],
                    'postalCode' => $customer['postalCode'],
                    'city' => Address::getCity($customer['postalCode']),
                ],
                'products' => $products,
                'total' => $products->reduce(fn($carry, $item) => $carry + ($item['quantity'] * $item['price']), 0)
            ];

            $pdfFileName = $this->generatePDF($data);

            $deliveryPlanHeader = DeliveryPlanHeader::create([
                'doc_num' => DocumentNumber::createDocument('plan'),
                'customer_id' => $customer['id'],
                'created_at' => now()->format('Y-m-d'),
                'updated_at' => now()->format('Y-m-d'),
                'period' => $this->currentPeriod,
                'file_name' => $pdfFileName,
            ]);

            foreach ($products as $product) {
                DeliveryPlanLine::create([
                    'delivery_plan_header_id' => $deliveryPlanHeader->id,
                    'agreement_line_id' => $product['id'],
                    'product_id' => $product['productId'],
                    'delivery_frequency' => $product['deliveryFrequency'],
                    'payment_option' => $product['paymentOption'],
                    'quantity' => $product['quantity'],
                ]);

                AgreementLine::where('agreement_lines_id', $product['id'])
                    ->update([
                        'current_delivery' => $this->currentPeriod,
                        'next_delivery' => Period::getNextPeriod($product['deliveryFrequency'], $this->currentPeriod),
                        'updated_at' => now()->format('Y-m-d'),
                    ]);
            }

            DeliveryPlanEmailJob::dispatch(
                'jacquesf.roux@gmail.com' /*$customer['email']*/,
                'en_us' /*$customer['preferredLanguage']*/,
                $pdfFileName,
                $customer['fullName'],
                $customer['organizationName']
            );
        }

        echo "success";
    }

    private function getCustomers(string $period)
    {
        return AgreementLine::with(['customer.organization'])
            ->where('quantity', '>', 0)
            ->where('next_delivery', $period)
            ->where('once_off_purchase', 0)
            ->whereHas('customer', function ($query) {
                $query->whereNull('deleted');
            })
            ->select('agreement_lines.*')
            ->distinct()
            ->get()
            ->unique('customer.customer_id')
            ->map(fn($agreementLine) => [
                'id' => $agreementLine->customer->customer_id,
                'fullName' => $agreementLine->customer->customer_firstname . ' ' . $agreementLine->customer->customer_lastname,
                'email' => $agreementLine->customer->customer_email,
                'address' => $agreementLine->customer->customer_street_address,
                'postalCode' => $agreementLine->customer->customer_postal_code,
                'preferredLanguage' => $agreementLine->customer->preferred_language_code,
                'organizationName' => $agreementLine->customer->organization->organization_name,
                'organizationEmail' => $agreementLine->customer->organization->organization_email,
                'organizationPhone' => $agreementLine->customer->organization->organization_telephone,
            ])
            ->values();
    }

    private function getProducts(int $customerId, string $period)
    {
        return AgreementLine::with(['product.supplier'])
            ->where('customer_customer_id', $customerId)
            ->where('next_delivery', $period)
            ->get()
            ->map(fn($agreementLine) => [
                'id' => $agreementLine->agreement_lines_id,
                'productId' => $agreementLine->product->product_id,
                'name' => $agreementLine->product->product_name,
                'unit' => $agreementLine->product->unit,
                'price' => $agreementLine->product->retail_price_incl_vat_calc,
                'quantity' => $agreementLine->quantity,
                'deliveryFrequency' => $agreementLine->delivery_frequency,
                'paymentOption' => $agreementLine->payment_option,
                'supplier' => $agreementLine->product->supplier->supplier_name
            ]);
    }

    private function generatePDF(array $data): string
    {
        $pdf = Pdf::loadView('pdfs.delivery_plan_en', $data);

        $fileName = 'pdfs/deliveryPlans/' . uniqid('document_', true) . '.pdf';

        try {
            Storage::put($fileName, $pdf->output());
            return $fileName;

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(DeliveryPlanService::class . '::generatePDF(): ' .$e->getMessage());
            return '';
        }
    }

    public function synchronize(): void
    {
        $agreements = $this->getOpenAgreements();
        $deliveryPlans = $this->getDeliveryPlans();

        $deliveryPlansByCustomer = $deliveryPlans->groupBy('customerId');

        foreach ($agreements as $agreement) {
            $customerPlans = $deliveryPlansByCustomer->get($agreement['customerId'], collect());

            // Check if the specific product exists for this customer
            $existingPlan = $customerPlans->firstWhere('productId', $agreement['productId']);

            if (!$customerPlans->isEmpty()) {
                // Customer exists in delivery plans
                if (!$existingPlan) {
                    // Product does not exist for this customer - add a new line
                     $this->addDeliveryPlanLine($agreement);
                } else {
                    // Sync existing plan details
                     $this->syncQuantity($agreement, $existingPlan);
                     $this->syncDeliveryFrequency($agreement, $existingPlan);
                     $this->syncPaymentOption($agreement, $existingPlan);
                }
            } else {
                // Customer does not exist in delivery plans - create a new delivery plan header & lines
                 $this->addDeliveryPlan($agreement);
            }
        }
    }

    private function getOpenAgreements()
    {
        return AgreementLine::where('current_delivery', $this->currentPeriod)
            ->where('locked', false)
            ->get()
            ->map(fn($agreement) => [
                'id' => $agreement->agreement_lines_id,
                'customerId' => $agreement->customer_customer_id,
                'productId' => $agreement->product_Product_id,
                'quantity' => $agreement->quantity,
                'deliveryFrequency' => $agreement->delivery_frequency,
                'paymentOption' => $agreement->payment_option,
                'firstDelivery' => $agreement->first_delivery,
                'currentDelivery' => $agreement->current_delivery,
                'lastDelivery' => $agreement->last_delivery
            ]);
    }

    private function getOpenAgreementsIds()
    {
        return AgreementLine::where('current_delivery', $this->currentPeriod)
            ->where('locked', false)
            ->get()
            ->pluck('agreement_lines_id');
    }

    private function getDeliveryPlans()
    {
        $agreementIds = $this->getOpenAgreementsIds();

        return DeliveryPlanLine::with(['deliveryPlanHeader'])
            ->whereIn('agreement_line_id', $agreementIds)
            ->get()
            ->map(fn($plan) => [
                'id' => $plan->id,
                'deliveryPlanHeaderId' => $plan->delivery_plan_header_id,
                'agreementLineId' => $plan->agreement_line_id,
                'productId' => $plan->product_id,
                'deliveryFrequency' => $plan->delivery_frequency,
                'paymentOption' => $plan->payment_option,
                'quantity' => $plan->quantity,
                'customerId' => $plan->deliveryPlanHeader->customer_id,
                'period' => $plan->deliveryPlanHeader->period
            ]);
    }

    private function addDeliveryPlan($agreement): void
    {
        $headerId = DeliveryPlanHeader::create([
            'doc_num' => DocumentNumber::createDocument('plan'),
            'customer_id' => $agreement['customerId'],
            'period' => $this->currentPeriod,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DeliveryPlanLine::create([
            'delivery_plan_header_id' => $headerId->id,
            'agreement_line_id' => $agreement['id'],
            'product_id' => $agreement['productId'],
            'delivery_frequency' => $agreement['deliveryFrequency'],
            'payment_option' => $agreement['paymentOption'],
            'quantity' => $agreement['quantity'],
        ]);
    }

    private function addDeliveryPlanLine($agreement): void
    {
        $headerId = DeliveryPlanHeader::where('customer_id', $agreement['customerId'])
            ->where('period', $this->currentPeriod)
            ->first()
            ->id;

        DeliveryPlanLine::create([
            'delivery_plan_header_id' => $headerId,
            'agreement_line_id' => $agreement['id'],
            'product_id' => $agreement['productId'],
            'delivery_frequency' => $agreement['deliveryFrequency'],
            'payment_option' => $agreement['paymentOption'],
            'quantity' => $agreement['quantity'],
        ]);
    }

    private function syncQuantity($agreement, $deliveryPlan): void
    {
        if ($agreement['quantity'] !== $deliveryPlan['quantity']) {
            DeliveryPlanLine::where('id', $deliveryPlan['id'])->update([
                'quantity' => $agreement['quantity']
            ]);
        }
    }

    private function syncDeliveryFrequency($agreement, $deliveryPlan): void
    {
        if ($agreement['deliveryFrequency'] !== $deliveryPlan['deliveryFrequency']) {
            if ($agreement['currentDelivery'] === $agreement['firstDelivery']) {
                $this->adjustNextDelivery($agreement['deliveryFrequency'], $agreement['lastDelivery'], $agreement['id']);
            } else {
                $this->adjustAgreementAndPlan($agreement['deliveryFrequency'], $agreement['lastDelivery'], $agreement['id']);
            }
        }
    }

    private function syncPaymentOption($agreement, $deliveryPlan): void
    {
        if ($agreement['paymentOption'] !== $deliveryPlan['paymentOption']) {
            DeliveryPlanLine::where('id', $deliveryPlan['id'])->update([
                'payment_option' => $agreement['paymentOption']
            ]);
        }
    }

    private function adjustNextDelivery(int $deliveryFrequency, string $lastDelivery, int $agreementLineId): void
    {
        $nextDelivery = Period::getNextPeriod($deliveryFrequency, $lastDelivery);

        AgreementLine::where('agreement_lines_id', $agreementLineId)->update([
            'next_delivery' => $nextDelivery
        ]);
    }

    private function adjustAgreementAndPlan(int $deliveryFrequency, string $lastDelivery, int $agreementLineId): void
    {
        $nextDelivery = Period::getNextPeriod($deliveryFrequency, $lastDelivery);

        AgreementLine::where('agreement_lines_id', $agreementLineId)->update([
            'current_delivery' => null,
            'next_delivery' => $nextDelivery
        ]);

        DeliveryPlanLine::where('agreement_line_id', $agreementLineId)->delete();
    }
}


// TODO:: if paying with gift-card, the front-end sets frequency to zero, investigate impack on backend
