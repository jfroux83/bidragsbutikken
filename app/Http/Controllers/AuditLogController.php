<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Carbon\Carbon;
use Inertia\Response;
use Inertia\ResponseFactory;

class AuditLogController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        return inertia('Admin/AuditLogs/Index', [
            'startDate' => Carbon::now()->format('d-m-Y'),
            'endDate' => Carbon::now()->format('d-m-Y'),
        ]);
    }

    public function show(): Response|ResponseFactory
    {
        $validate = request()->validate([
            'startDate' => ['required'],
            'endDate' => ['required'],
        ]);

        $logData = AuditLog::with('user:id,name')
            ->whereBetween(
                'created_at', [
                date('Y-m-d', strtotime($validate['startDate'])) . ' 00:00:00',
                date('Y-m-d', strtotime($validate['endDate'])) . ' 23:59:59'
            ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($log) => [
                'event' => $log->event,
                'ipAddress' => $log->ip_address,
                'createdAt' => date('d/m/Y H:i:s', strtotime($log->created_at)),
                'user' => $log->user ? $log->user->name : '',
                'payload' => $log->new_values,
            ]);

        return inertia('Admin/AuditLogs/Show', [
            'startDate' => $validate['startDate'],
            'endDate' => $validate['endDate'],
            'logs' => $logData,
        ]);
    }
}
