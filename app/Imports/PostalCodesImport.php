<?php

namespace App\Imports;

use App\Models\PostalCode;
use App\Traits\ManagesSystemJobs;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterImport;
use Maatwebsite\Excel\Events\BeforeImport;
use Maatwebsite\Excel\Validators\Failure;

class PostalCodesImport implements ToModel, WithHeadingRow, SkipsOnFailure, WithEvents
{
    use SkipsFailures, ManagesSystemJobs;

    protected int $systemJobId;
    protected string $filePath;
    protected int $rows = 0;
    protected $failures = [];

    public function __construct(int $systemJobId, string $filePath)
    {
        $this->systemJobId = $systemJobId;
        $this->filePath = $filePath;
    }

    public function model(array $row)
    {
        $this->rows++;

        if (blank($row)) {
            $this->failures[] = new Failure(
                $this->rows,
                'row_validation_failed',
                ['empty row'],
                $row
            );

            return null;
        }

        if (blank($row['postal_code'])) {
            $this->failures[] = new Failure(
                $this->rows,
                'row_validation_failed',
                ['postal_code field is required'],
                $row
            );

            return null;
        }

        if (blank($row['city'])) {
            $this->failures[] = new Failure(
                $this->rows,
                'row_validation_failed',
                ['city field is required'],
                $row
            );

            return null;
        }

        $exists = PostalCode::where('postal_code', $row['postal_code'])
            ->exists();

        if ($exists) {
            $record = PostalCode::where('postal_code', $row['postal_code'])
                ->first();

            $record->update([
                'city' => $row['city'],
                'latitude' => $row['latitude'],
                'longitude' => $row['longitude'],
                'updated_at' => now()
            ]);

            return $record;
        }

        return new PostalCode([
            'postal_code' => $row['postal_code'],
            'city' => $row['city'],
            'latitude' => $row['latitude'],
            'longitude' => $row['longitude'],
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    public function registerEvents(): array
    {
        return [
            BeforeImport::class => function(BeforeImport $event) {
                // Update job status
                $this->updateSystemJob($this->systemJobId, [
                    'status' => 'processing',
                    'started_at' => now(),
                    'message' => "Starting import..."
                ]);
            },

            AfterImport::class => function(AfterImport $event) {
                if (count($this->failures) > 0) {
                    $this->updateSystemJob($this->systemJobId, [
                        'status' => 'failed',
                        'completed_at' => now(),
                        'message' => json_encode($this->failures)
                    ]);
                } else {
                    $this->updateSystemJob($this->systemJobId, [
                        'status' => 'completed',
                        'completed_at' => now(),
                        'progress' => 100,
                        'message' => "Import completed"
                    ]);
                }

                // Delete the file
                if (Storage::disk('private')->exists($this->filePath)) {
                    Storage::disk('private')->delete($this->filePath);
                }
            }
        ];
    }
}
