<?php

namespace App\Enums;

enum PaymentStatus: int
{
    case CREATED = 100;
    case RESERVED = 200;
    case PAID = 300;
}
