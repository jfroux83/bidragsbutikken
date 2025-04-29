<?php

namespace App\Http\Middleware;

use App\Services\AuditService;
use Closure;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AuditMiddleware
{
    protected AuditService $auditService;

    protected array $excludedRoutes = [
        'api/*',
        'horizon/*',
        '_debugbar/*',
        'health-check',
        'sanctum/*',
        '*metrics',
        'login',
        'register',
        'password/*',
        '_ignition/*',
        'favicon.ico',
        'admin/system-jobs/active-count'
    ];

    public function __construct(AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if we should skip logging this request
        if ($this->shouldSkipLogging($request)) {
            return $next($request);
        }

        $response = $next($request);

        try {
            $this->logRequest($request, $response);
        } catch (Exception $e) {
            // Log the error but don't break the application
            report($e);
        }

        return $response;
    }

    protected function shouldSkipLogging(Request $request): bool
    {
        // Skip excluded routes
        foreach ($this->excludedRoutes as $pattern) {
            if ($request->is($pattern)) {
                return true;
            }
        }

        // Skip asset requests
        if ($this->isAssetRequest($request)) {
            return true;
        }

        return false;
    }

    protected function isAssetRequest(Request $request): bool
    {
        $path = $request->path();

        $assetPatterns = [
            '*.css', '*.js', '*.ico', '*.gif', '*.jpg',
            '*.jpeg', '*.png', '*.svg', '*.woff', '*.woff2',
            '*.ttf', '*.eot', '*.map'
        ];

        foreach ($assetPatterns as $pattern) {
            if (Str::is($pattern, $path)) {
                return true;
            }
        }

        return false;
    }

    protected function logRequest(Request $request, $response): void
    {
        // Basic request data that's always safe to log
        $requestData = [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'path' => $request->path(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ];

        // Only log request data for non-GET requests
        if (!$request->isMethod('GET')) {
            $requestData['input'] = $this->filterSensitiveData($request->except([
                'password',
                'password_confirmation',
                '_token',
                'token',
            ]));
        }

        $this->auditService->log(
            'http_request',
            null,
            null,
            null,
            $requestData,
            [
                'response_status' => $response->getStatusCode(),
                'response_type' => $response->headers->get('content-type'),
            ]
        );
    }

    protected function filterSensitiveData(array $data): array
    {
        $sensitiveFields = [
            'password',
            'password_confirmation',
            'secret',
            'token',
            'api_key',
            'authorization',
            'credit_card',
            'card_number',
        ];

        return collect($data)->map(function ($value, $key) use ($sensitiveFields) {
            if (in_array(Str::lower($key), $sensitiveFields)) {
                return '[REDACTED]';
            }

            if (is_array($value)) {
                return $this->filterSensitiveData($value);
            }

            return $value;
        })->all();
    }
}
