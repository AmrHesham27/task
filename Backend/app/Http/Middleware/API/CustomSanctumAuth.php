<?php

namespace App\Http\Middleware\API;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomSanctumAuth
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::guard('sanctum')->check()) {
            return response()->json([
                "status_code" => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $request->setUserResolver(function () use ($request) {
            return Auth::guard('sanctum')->user();
        });

        return $next($request);
    }
}