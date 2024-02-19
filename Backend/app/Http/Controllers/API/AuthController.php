<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function login(Request $request) {
        if (!Auth::attempt($request->only("email", "password"))) {
            return response()->json([
                "status_code" => false, 
                "message" => "Invalid credentials"
            ], 401);
        }
    
        $user = User::where('email', $request['email'])->firstOrFail();
    
        $token = $user->createToken('auth_token')->plainTextToken;
    
        return response()->json([
            "status_code" => true, 
            "message" => "Logged in successfully",
            "data" => [
                'token' => $token, 
                'user_id' => $user->id
            ]
        ]);
    }

    public function logout(Request $request) {
        try {
            $request->user()->currentAccessToken()->delete();
    
            return response()->json([
                "status_code" => true,
                'message' => 'Logged out successfully'
            ]);
        }
        catch (\Exception $e) {
            return response()->json([
                "status_code" => false,
                "message" => $e->getMessage()
            ], 500);
        }
    }

    public function getUser(Request $request) {
        try {
            $user = $request->user();
            if (!$user) throw new Exception("Could not fetch User");

            return response()->json([
                "status_code" => true,
                'message' => 'user was fetched successfully',
                'data' => $user
            ]);
        }
        catch (\Exception $e) {
            return response()->json([
                "status_code" => false,
                "message" => $e->getMessage()
            ], 500);
        }
    }

    public function register(Request $request) {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => ['required', 'string', 'confirmed'],
            ]);
        
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
        
            $token = $user->createToken('auth_token')->plainTextToken;
        
            return response()->json([
                "status_code" => true, 
                "message" => "Registered successfully",
                "data" => $token
            ]);
        }
        catch (\Exception $e) {
            return response()->json([
                "status_code" => false, 
                "message" => $e->getMessage()
            ]);
        }
    }
}
