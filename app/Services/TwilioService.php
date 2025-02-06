<?php

namespace App\Services;

use Twilio\Exceptions\ConfigurationException;
use Twilio\Exceptions\TwilioException;
use Twilio\Rest\Api\V2010\Account\MessageInstance;
use Twilio\Rest\Client;

class TwilioService
{
    protected Client $client;

    /**
     * @throws ConfigurationException
     */
    public function __construct() {
        $this->client = new Client(
            env('TWILIO_SID'),
            env('TWILIO_AUTH_TOKEN')
        );
    }

    /**
     * @throws TwilioException
     */
    public function sendSMS(string $to, string $message): MessageInstance
    {
        return $this->client->messages->create(
            $to,
            [
                'from' => env('TWILIO_PHONE_NUMBER'),
                'body' => $message
            ]
        );
    }
}
