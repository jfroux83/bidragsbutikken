<?php

use App\Services\SystemFeeService;
use App\Services\TwilioService;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Twilio\Rest\Client;


Route::get('/tests/system-fee', function () {
    $twilio = new TwilioService();
    $service = new SystemFeeService($twilio);
    $service->run();
});

Route::get('/tests/mailgun', function () {
    Mail::raw('This is a test email sent via Mailgun.', function ($message) {
        $message->to('jhmedlem@gmail.com')
                ->subject('Test Mailgun Email');
    });
});

Route::get('tests/twilio', function () {
    $sid = env('TWILIO_ACCOUNT_SID', null);
    $authToken = env('TWILIO_AUTH_TOKEN', null);
    $twilioNumber = env('TWILIO_PHONE_NUMBER', null);
    $client = new Client($sid, $authToken);

    $message = $client->messages->create(
        '+4740410206', // recipient phone number
        [
            'from' => $twilioNumber,
            'body' => 'Hello! This is a test message from Laravel using Twilio.'
        ]
    );

    return response()->json(['message_sid' => $message->sid]);
});
