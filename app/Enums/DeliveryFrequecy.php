<?php

namespace App\Enums;

enum DeliveryFrequecy: int
{
    case ONE_TIME = 0;
    case MONTHLY = 1;
    case THIRD_MONTH = 3;
    case FORTH_MONTH = 4;
    case SIX_MONTH = 6;
    case YEARLY = 12;
}
