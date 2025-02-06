<?php

namespace App\Helpers;

class Period
{
    public static function getNextPeriod(int $deliveryFrequency, string $currentPeriod): string
    {
        return match($deliveryFrequency) {
            1 => date('Y-m', strtotime('+1 months', strtotime($currentPeriod))),
            3 => date('Y-m', strtotime('+3 months', strtotime($currentPeriod))),
            4 => date('Y-m', strtotime('+4 months', strtotime($currentPeriod))),
            6 => date('Y-m', strtotime('+6 months', strtotime($currentPeriod))),
            12 => date('Y-m', strtotime('+12 months', strtotime($currentPeriod))),
            default => $currentPeriod,
        };
    }
}
