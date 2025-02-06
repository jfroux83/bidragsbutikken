<?php

namespace App\Services;

use App\Models\DeliveryPlanHeader;
use App\Models\DeliveryPlanLine;
use App\Models\InvoiceHeader;
use Carbon\Carbon;

class InvoiceService
{
    protected Carbon $currentDate;
    protected string $currentPeriod;

    public function __construct()
    {
        $this->currentDate = Carbon::now();
        $this->currentPeriod = $this->currentDate->format('Y-m');
    }

    public function run()
    {
        $deliveryPlans = $this->getDeliveryPlans();

        foreach ($deliveryPlans as $deliveryPlan) {
            $invoiceExists = InvoiceHeader::where('delivery_plan_header_id', $deliveryPlan['id'])
                ->exists();

            if (!$invoiceExists) {
                $deliveryPlanLines = DeliveryPlanLine::where('delivery_plan_header_id', $deliveryPlan['id'])
                    ->get()
                    ->map(fn ($line) => [
                        'id' => $line->id,
                        'agreementLineId' => $line->agreement_line_id,
                        'productId' => $line->product_id,
                        'payment_option' => $line->payment_option,
                        'quantity' => $line->quantity,
                    ]);

                $invoiceHeader = InvoiceHeader::create([
                    'doc_num' => '',
                    'customer_customer_id' => $deliveryPlan['customerId'],
                    'delivery_plan_header_id' => $deliveryPlan['id'],
                    'created_at' => $this->currentDate,
                    'total' => 0,
                ]);

                foreach ($deliveryPlanLines as $deliveryPlanLine) {

                }
            }
        }
    }

    private function getDeliveryPlans()
    {
        return DeliveryPlanHeader::where('period', $this->currentPeriod)
            ->get()
            ->map(fn ($plan) => [
                'id' => $plan->id,
                'customerId' => $plan->customer_id,
            ]);
    }
}
