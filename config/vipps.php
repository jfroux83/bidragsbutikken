<?php

return [
    /**
     * URLs
     */
    'url' => [
        'base' => env('VIPPS_BASE_URL', null),
        'auth' => env('VIPPS_AUTH_URL', null),
        'payment' => env('VIPPS_PAYMENT_URL', null),
    ],

    /**
     * Authentication
     */
    'auth' => [
        'client_id' => env('VIPPS_CLIENT_ID', null),
        'client_secret' => env('VIPPS_CLIENT_SECRET', null),
        'subscription_key' => env('VIPPS_SUBSCRIPTION_KEY', null),
        'merchant_serial_number' => env('VIPPS_MERCHANT_SERIAL_NUMBER', null),
    ]
];
