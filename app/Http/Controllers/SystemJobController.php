<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Response;
use Inertia\ResponseFactory;

class SystemJobController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        $jobs = DB::table('system_jobs')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($job) => [
                'id' => $job->id,
                'name' => $job->name,
                'type' => $job->type,
                'status' => $job->status,
                'parameters' => $job->parameters,
                'message' => $job->message,
                'error' => $job->error,
                'progress' => $job->progress,
                'created_at' => date('Y-m-d H:i:s', strtotime($job->created_at)),
                'completed_at' => date('Y-m-d H:i:s', strtotime($job->completed_at)),
                'created_by' => $job->created_by,
            ])
            ->toArray();

        $activeCount = DB::table('system_jobs')
            ->whereIn('status', ['pending', 'processing'])
            ->count();

        return inertia('Admin/SystemJobs/Index', [
            'jobs' => $jobs,
            'activeCount' => $activeCount,
        ]);
    }

    public function activeCount(): JsonResponse
    {
        $count = DB::table('system_jobs')
            ->whereIn('status', ['pending', 'processing'])
            ->count();

        return response()->json([
            'count' => $count
        ]);
    }

    public function list(): JsonResponse
    {
        $jobs = DB::table('system_jobs')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($job) => [
                'id' => $job->id,
                'name' => $job->name,
                'type' => $job->type,
                'status' => $job->status,
                'parameters' => $job->parameters,
                'message' => $job->message,
                'error' => $job->error,
                'progress' => $job->progress,
                'created_at' => date('Y-m-d H:i:s', strtotime($job->created_at)),
                'completed_at' => date('Y-m-d H:i:s', strtotime($job->completed_at)),
                'created_by' => $job->created_by,
            ])
            ->toArray();

        $activeCount = DB::table('system_jobs')
            ->whereIn('status', ['pending', 'processing'])
            ->count();

        return response()->json([
            'jobs' => $jobs,
            'activeCount' => $activeCount
        ]);
    }

    public function cancel($jobId): RedirectResponse
    {
        DB::table('system_jobs')
            ->where('id', $jobId)
            ->update([
                'status' => 'failed',
                'message' => 'Job was canceled by user',
                'completed_at' => now()
            ]);

        return redirect()
            ->back()
            ->with('success', 'Job was canceled by user');
    }
}
