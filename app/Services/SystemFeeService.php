<?php

namespace App\Services;

use App\Enums\PaymentStatus;
use App\Helpers\DocumentNumber;
use App\Jobs\SystemFeeEmailJob;
use App\Models\InvoiceHeader;
use App\Models\InvoiceLine;
use App\Models\Organization;
use App\Models\SystemFee;
use App\Models\SystemFeeHeader;
use App\Models\SystemOwner;
use App\Traits\ManagesSystemJobs;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Twilio\Exceptions\TwilioException;

class SystemFeeService
{
    use ManagesSystemJobs;

    protected TwilioService $twilio;
    protected string $today;
    protected string $startDate;
    protected string $endDate;

    public function __construct(TwilioService $twilio) {
        $this->twilio = $twilio;
        $this->today = Carbon::today()->format('Y-m-d');
        $this->startDate = Carbon::now()->subMonthNoOverflow()->startOfMonth()->format('Y-m-d');
        $this->endDate = Carbon::now()->subMonthNoOverflow()->endOfMonth()->format('Y-m-d');
    }

    /**
     * @throws TwilioException
     */
    public function run(): ?string
    {
        $jobId = $this->createSystemJob(
            name: 'System Fee Run',
            type: 'system_fee',
            message: 'Starting with the system fee run.',
        );

        try {
            $systemFeePercentage = (float)$this->getSystemFee();
            $organizations = $this->getOrganizations();

            foreach ($organizations as $organization) {

                $customers = $organization->customers;
                $customerIds = $customers->pluck('customer_id')->toArray();
                $invoiceHeaderIds = InvoiceHeader::whereIn('customer_customer_id', $customerIds)
                    ->whereBetween('invoice_creation_date', [$this->startDate, $this->endDate])
                    ->get()
                    ->pluck('invoice_header_id')
                    ->toArray();
                $totalInvoiced = InvoiceLine::whereIN('invoice_header_invoice_header_id', $invoiceHeaderIds)
                    ->sum(DB::raw('quantity * retail_price_incl_vat_calc'));

                $systemFee = round($totalInvoiced * $systemFeePercentage / 100, 2);

                $record = SystemFee::where('system_fee_month', $this->endDate)
                    ->where('organization_organization_id', $organization->organization_id)
                    ->first();

                if (!$record) {
                    $docNumber = DocumentNumber::createDocument('system_fee');

                    $newRecord = SystemFeeHeader::create([
                        'doc_num' => $docNumber,
                        'system_fee_creation_date' => $this->today,
                    ]);

                    $systemFeeRecord = SystemFee::create([
                        'system_fee_month' => $this->endDate,
                        'to_pay' => $systemFee,
                        'organization_organization_id' => $organization->organization_id,
                        'system_fee_header_system_fee_header_id' => $newRecord->system_fee_header_id,
                    ]);

                    $phone_number = Str::replace('+', '', $organization->organization_telephone);
                    $vippsAmount = (int) ($systemFee * 100);

                    $vippsService = new VippsService();
                    $vippsResponse = $vippsService->createPayment($vippsAmount, $phone_number, 'System Fee Payment Link');

                    $systemFeeRecord->update([
                        'payment_status' => PaymentStatus::CREATED,
                        'payment_link' => $vippsResponse['payment_link'],
                        'payment_reference' => $vippsResponse['payment_reference'],
                        'vipps_key' => $vippsResponse['vipps_key'],
                    ]);

                    if ($organization->preferred_language_code === 'no') {
                        $this->twilio->sendSMS(
                            $organization->organization_telephone,
                            $this->smsMessageNO(
                                $organization->organization_name,
                                $systemFeePercentage,
                                $systemFee,
                                $organization->paymentMethod->payment_method_name
                            )
                        );
                    } else {
                        $this->twilio->sendSMS(
                            $organization->organization_telephone,
                            $this->smsMessageEN(
                                $organization->organization_name,
                                $systemFeePercentage,
                                $systemFee,
                                $organization->paymentMethod->payment_method_name
                            )
                        );
                    }

                    $customerEmailArray = $this->calculateCustomersSystemFees($organization->customers, $systemFeePercentage);

                    // Dispatch email job
                    SystemFeeEmailJob::dispatch(
                        $organization->organization_email,
                        $organization->preferred_language_code,
                        $organization->organization_name,
                        $systemFeePercentage,
                        $systemFee,
                        $organization->paymentMethod->payment_method_name,
                        $customerEmailArray,
                        $vippsResponse['payment_link']
                    );
                }
            }

            $this->updateSystemJob($jobId, [
                'status' => 'completed',
                'progress' => 100,
                'completed_at' => now(),
                'message' => 'System Fee Run Completed.',
            ]);

            return 'success';

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(SystemFeeService::class . '|run: ' . $e->getMessage());
            $this->updateSystemJob($jobId, [
                'status' => 'failed',
                'completed_at' => now(),
                'error' => $e->getMessage(),
                'message' => 'System Fee Run Failed.'
            ]);

            return null;
        }
    }

    private function getSystemFee()
    {
        return SystemOwner::where('system_owner_id', '1')->
            first()->system_fee_percent_based_on_sale;
    }

    private function getOrganizations(): Collection
    {
        return Organization::with([
            'paymentMethod:payment_method_id,payment_method_name',
            'customers:organization_organization_id,customer_id,customer_firstname'
        ])
            ->select([
                'organization_id',
                'organization_name',
                'organization_telephone',
                'organization_email',
                'organization.preferred_language_code',
                'payment_method_pay',
                'sec_users_groups.group_id'
            ])
            ->join('sec_users', 'organization_id', '=', 'sec_users.organization_organization_id')
            ->join('sec_users_groups', 'sec_users.login', '=', 'sec_users_groups.login')
            ->where('sec_users_groups.group_id', '=', 2)
            ->get();
    }

    private function smsMessageNO(string $name, float $systemFeePercentage, float $systemFee, string $paymentMethod): string
    {
        return "";
    }

    private function smsMessageEN(string $name, float $systemFeePercentage, float $systemFee, string $paymentMethod): string
    {
        return "Hi {$name}. It is time to pay the system fee in connection with your use of the system Bonusbutikken. The fee is {$systemFeePercentage} % of the turnover from your customers in the previous month. See e-mail for more details. Total to pay: kr {$systemFee} to {$paymentMethod} number 91919191.";
    }

    private function calculateCustomersSystemFees($customers, float $systemFeePercentage): array
    {
        $dataset = [];

        foreach ($customers as $customer) {
            $invoiceHeaderIds = InvoiceHeader::where('customer_customer_id', $customer->customer_id)
                ->whereBetween('invoice_creation_date', [$this->startDate, $this->endDate])
                ->get()
                ->pluck('invoice_header_id')
                ->toArray();

            $totalInvoiced = InvoiceLine::whereIN('invoice_header_invoice_header_id', $invoiceHeaderIds)
                ->sum(DB::raw('quantity * retail_price_incl_vat_calc'));

            $dataset[] = [
                'name' => $customer->customer_firstname . ' ' . $customer->customer_lastname,
                'last_month_trade' => $totalInvoiced,
                'fee_percentage' => $systemFeePercentage,
                'fee' => round($totalInvoiced * $systemFeePercentage/100, 2)
            ];
        }

        return $dataset;
    }

    public function monitor(): void
    {
        $records = SystemFee::where('payment_status', PaymentStatus::CREATED->value)
            ->get();

        foreach ($records as $record) {
            $service = new VippsService();
            $response = $service->getPayment($record->payment_reference);

            if ($response['message'] === 'success') {
                $record->update([
                    'payment_status' => PaymentStatus::RESERVED,
                ]);
            }
        }
    }

    public function capture(): void
    {
        $records = SystemFee::where('payment_status', PaymentStatus::RESERVED->value)
            ->get();

        foreach ($records as $record) {
            $service = new VippsService();
            $value = (int) ($record->to_pay * 100);
            $response = $service->capturePayment($record->payment_reference, $record->vipps_key, $value);

            if ($response['message'] === 'success') {
                $record->update([
                    'payment_status' => PaymentStatus::PAID,
                ]);
            }
        }
    }
}
