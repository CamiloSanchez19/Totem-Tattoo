<?php

namespace App\Http\Middleware;

use App\Models\AdminApiToken;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminApiAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $authorization = $request->header('Authorization', '');

        if (!str_starts_with($authorization, 'Bearer ')) {
            return response()->json(['message' => 'Token no proporcionado'], 401);
        }

        $plainToken = trim(substr($authorization, 7));
        $hashedToken = hash('sha256', $plainToken);

        $token = AdminApiToken::query()
            ->where('token', $hashedToken)
            ->with('user')
            ->first();

        if (! $token || ! $token->user || ! $token->user->is_admin) {
            return response()->json(['message' => 'Token inválido'], 401);
        }

        if ($token->expira_en && now()->greaterThan($token->expira_en)) {
            $token->delete();

            return response()->json(['message' => 'Token expirado'], 401);
        }

        $token->forceFill(['ultimo_uso_en' => now()])->save();

        Auth::setUser($token->user);
        $request->attributes->set('admin_token', $token);

        return $next($request);
    }
}
