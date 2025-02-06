<?php

namespace App\Helpers;

use App\Models\Document;

class DocumentNumber
{
    public static function createDocument(string $docType): string
    {
        $document = null;

        match ($docType) {
            'system_fee' => $document = Document::systemFee()->first(),
            'plan' => $document = Document::deliveryPlan()->first(),
        };

        $doc_num = $document->doc_prefix . str_pad($document->doc_counter, $document->doc_padding, "0", STR_PAD_LEFT);
        $newCounter = $document->doc_counter + 1;
        $document->update(['doc_counter' => $newCounter]);

        return $doc_num;
    }
}
