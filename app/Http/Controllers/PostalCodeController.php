<?php

namespace App\Http\Controllers;

use App\Jobs\PostalCodesImportJob;
use App\Models\PostalCode;
use App\Traits\ManagesSystemJobs;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Response;
use Inertia\ResponseFactory;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PostalCodeController extends Controller
{
    use ManagesSystemJobs;

    public function index(): Response|ResponseFactory
    {
        $postalCodes = PostalCode::orderBy('postal_code')
            ->get()
            ->map(fn ($postalCode) => [
                'id' => $postalCode->id,
                'status' => (boolean) $postalCode->status,
                'postalCode' => $postalCode->postal_code,
                'city' => $postalCode->city,
                'latitude' => $postalCode->latitude,
                'longitude' => $postalCode->longitude,
            ]);

        return inertia('Admin/Configuration/PostalCode/Index', [
            'postalCodes' => $postalCodes,
        ]);
    }

    public function create(): Response|ResponseFactory
    {
        return inertia('Admin/Configuration/PostalCode/Create');
    }

    public function store(): RedirectResponse
    {
        $validate = request()->validate([
            'postalCode' => ['required'],
            'city' => ['required'],
            'latitude' => [],
            'longitude' => [],
            'status' => ['required'],
        ]);

        try {
            PostalCode::create([
                'postal_code' => $validate['postalCode'],
                'city' => $validate['city'],
                'latitude' => $validate['latitude'],
                'longitude' => $validate['longitude'],
                'status' => $validate['status'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return redirect()
                ->route('admin.configuration.postal-code.index')
                ->with('success', 'Postal Code created successfully.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(PostalCodeController::class . '::store(): ' . $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Something went wrong. Please try again.');
        }
    }

    public function edit(PostalCode $postalCode): Response|ResponseFactory
    {
        return inertia('Admin/Configuration/PostalCode/Edit', [
            'postalCode' => [
                'id' => $postalCode->id,
                'status' => (bool) $postalCode->status,
                'postalCode' => $postalCode->postal_code,
                'city' => $postalCode->city,
                'latitude' => $postalCode->latitude,
                'longitude' => $postalCode->longitude
            ]
        ]);
    }

    public function update(PostalCode $postalCode): RedirectResponse
    {
        $validate = request()->validate([
            'postalCode' => ['required'],
            'city' => ['required'],
            'latitude' => [],
            'longitude' => [],
            'status' => ['required'],
        ]);

        try {
            $postalCode->update([
                'postal_code' => $validate['postalCode'],
                'city' => $validate['city'],
                'latitude' => $validate['latitude'],
                'longitude' => $validate['longitude'],
                'status' => $validate['status'],
                'updated_at' => now(),
            ]);

            return redirect()
                ->route('admin.configuration.postal-code.index')
                ->with('success', 'Postal Code updated successfully.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(PostalCodeController::class . '::update(): ' . $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Something went wrong. Please try again.');
        }
    }

    public function destroy(PostalCode $postalCode): RedirectResponse
    {
        try {
            $postalCode->delete();

            return redirect()
                ->route('admin.configuration.postal-code.index')
                ->with('success', 'Postal Code deleted successfully.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(PostalCodeController::class . '::destroy(): ' . $e->getMessage());
            return redirect()
                ->back()
                ->with('error', 'Something went wrong. Please try again.');
        }
    }

    public function downloadTemplate(): BinaryFileResponse|RedirectResponse
    {
        $filePath = storage_path('app/private/templates/template_postal_codes.xlsx');

        if (!file_exists($filePath)) {
            return redirect()
                ->back()
                ->with('error', 'Template file not found.');
        }

        return response()->download($filePath, 'template_postal_codes.xlsx');
    }

    public function upload(): Response|ResponseFactory
    {
        return inertia('Admin/Configuration/PostalCode/Import');
    }

    public function uploadProcess(): RedirectResponse
    {
        $validate = request()->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls', 'max:5120']
        ]);

        try {
            $file = request()->file('file');

            $filename = 'excel_' . time() . '.' . $file->getClientOriginalExtension();

            $path = $file->storeAs('uploads', $filename, 'private');

            $jobId = $this->createSystemJob(
                name: 'Process Excel Upload for Postal Codes',
                type: 'excel.import.postal-codes',
                parameters: [
                    'filename' => $filename,
                    'original_filename' => $file->getClientOriginalName(),
                    'path' => $path,
                ],
                message: 'Excel file uploaded, pending processing'
            );

            PostalCodesImportJob::dispatch($jobId, $path);

            return redirect()
                ->back()
                ->with('success', 'File uploaded and queued for processing.');

        } catch (Exception $e) {
            Log::channel('custom_errors')->error(PostalCodeController::class . '::uploadProcess(): ' . $e->getMessage());
            return redirect()
                ->back()
                ->with('error', 'Something went wrong. Please try again.');
        }
    }
}
