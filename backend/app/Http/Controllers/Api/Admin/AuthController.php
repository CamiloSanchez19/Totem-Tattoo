<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminApiToken;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()->where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 422);
        }

        if (! $user->is_admin) {
            return response()->json(['message' => 'Usuario sin permisos de administrador'], 403);
        }

        $plainToken = Str::random(64);

        AdminApiToken::create([
            'user_id' => $user->id,
            'nombre' => 'dashboard',
            'token' => hash('sha256', $plainToken),
            'expira_en' => now()->addDays(7),
        ]);

        return response()->json([
            'message' => 'Login exitoso',
            'token' => $plainToken,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $token = $request->attributes->get('admin_token');

        if ($token) {
            $token->delete();
        }

        return response()->json(['message' => 'Sesión cerrada']);
    }
}
