<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class VippsService
{
    protected $url_base;
    protected $url_auth;
    protected $url_payment;
    protected $auth_client_id;
    protected $auth_client_secret;
    protected $auth_subscription_key;
    protected $auth_merchant_serial_number;

    protected $access_token;
    protected string $currency = 'NOK';

    public function __construct()
    {
        $this->url_base = config('vipps.url.base');
        $this->url_auth = config('vipps.url.auth');
        $this->url_payment = config('vipps.url.payment');
        $this->auth_client_id = config('vipps.auth.client_id');
        $this->auth_client_secret = config('vipps.auth.client_secret');
        $this->auth_subscription_key = config('vipps.auth.subscription_key');
        $this->auth_merchant_serial_number = config('vipps.auth.merchant_serial_number');
    }

    private function authenticate(): void
    {
        try {
            $response = Http::withOptions(['verify' => false])
                ->withHeaders([
                    'client_id' => $this->auth_client_id,
                    'client_secret' => $this->auth_client_secret,
                    'Ocp-Apim-Subscription-Key' => $this->auth_subscription_key,
                    'Merchant-Serial-Number' => $this->auth_merchant_serial_number
                ])
                ->post($this->url_base . $this->url_auth);

            if ($response->ok()) {
                $data = $response->collect();
                $this->access_token = $data['access_token'];
            }

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(VippsService::class . '|authenticate: ' . $e->getMessage());
        }
    }

    public function createPayment(int $value, string $phone_number, string $description): ?array
    {
        try {
            $this->authenticate();
            $paymentReference = $this->createPaymentId();
            $idempotencyKey = $this->createIdempotencyKey();

            $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer ' . $this->access_token,
                    'Ocp-Apim-Subscription-Key' => $this->auth_subscription_key,
                    'Merchant-Serial-Number' => $this->auth_merchant_serial_number,
                    'Idempotency-Key' => $idempotencyKey
                ])
                ->withOptions(['verify' => false])
                ->post($this->url_base . $this->url_payment, [
                    'amount' => [
                        'currency' => $this->currency,
                        'value' => $value
                    ],
                    'paymentMethod' => [
                        'type' => "WALLET"
                    ],
                    'customer' => [
                        'phoneNumber' => $phone_number
                    ],
                    'reference' => $paymentReference,
                    'returnUrl' => "https://bidragsbutikken.no/vipps?reference=$paymentReference",
                    'userFlow' => "WEB_REDIRECT",
                    'paymentDescription' => $description
                ]);

            if ($response->getStatusCode() === 201) {
                $data = $response->collect();
                return [
                    'payment_link' => $data['redirectUrl'],
                    'payment_reference' => $data['reference'],
                    'vipps_key' => $idempotencyKey
                ];
            } else {
                return [
                    'statusCode' => $response->getStatusCode(),
                    'body' => $response->getBody(),
                    'url' => $this->url_base . $this->url_payment,
                    'params' => [
                        'accessToken' => $this->access_token,
                        'idempotencyKey' => $idempotencyKey,
                        'currency' => $this->currency,
                        'value' => $value,
                        'phoneNumber' => $phone_number,
                        'description' => $description,
                        'paymentReference' => $paymentReference,
                    ],
                ];
            }

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(VippsService::class. '|createPayment: ' . $e->getMessage());
            return null;
        }
    }

    public function getPayment(string $paymentReference): ?array
    {
        try {
            $this->authenticate();

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $this->access_token,
                'Ocp-Apim-Subscription-Key' => $this->auth_subscription_key,
                'Merchant-Serial-Number' => $this->auth_merchant_serial_number,
            ])
            ->withOptions(['verify' => false])
            ->get($this->url_base . $this->url_payment . "/{$paymentReference}");


            if ($response->getStatusCode() === 200) {
                $data = $response->collect();

                if ($data['state'] === 'AUTHORIZED') {
                    return [
                        'message' => 'success',
                        'body' => [
                            'state' => $data['state'],
                            'amount' => $data['amount'],
                        ]
                    ];
                }

                return [
                    'message' => 'unpaid',
                ];
            } else {
                return [
                    'message' => 'failed'
                ];
            }

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(VippsService::class. '|getPayment: ' . $e->getMessage());
            return null;
        }
    }

    public function capturePayment(string $paymentReference, string $idempotencyKey, int $value): ?array
    {
        try {
            $this->authenticate();

            $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer ' . $this->access_token,
                    'Ocp-Apim-Subscription-Key' => $this->auth_subscription_key,
                    'Merchant-Serial-Number' => $this->auth_merchant_serial_number,
                    'Idempotency-Key' => $idempotencyKey
                ])
                ->withOptions(['verify' => false])
                ->post($this->url_base . $this->url_payment . "/{$paymentReference}" . '/capture', [
                    'modificationAmount' => [
                        'currency' => $this->currency,
                        'value' => $value
                    ]
                ]);

            if ($response->getStatusCode() === 200) {
                return [
                    'message' => 'success'
                ];
            }

            return [
                'message' => 'failed'
            ];

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(VippsService::class. '|capturePayment: ' . $e->getMessage());
            return null;
        }
    }

    private function createPaymentId(): string
    {
        return Str::random(16);
    }

    private function createIdempotencyKey(): string
    {
        return Str::uuid()->toString();
    }
}
