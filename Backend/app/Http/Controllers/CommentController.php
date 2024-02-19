<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Exception;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class CommentController extends Controller
{
    protected function getUser(Request $request) {
        try {
            $bearerToken = $request->bearerToken();
            $user = null;
            if ($bearerToken) {
                $token = PersonalAccessToken::findToken($bearerToken);
                if ($token)
                    $user = $token->tokenable;
                else throw new Exception("this user does not exist");
            }
            return $user;
        }
        catch (\Exception $e) {}
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $comments = Comment::latest()->take(15)->get();
            return response()->json([
                "status_code" => true,
                "message" => "comments were fetched successfully",
                "data" => $comments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status_code" => false,
                "message" => $e->getMessage()
            ]);
        }
    }

    public function getMoreComments(Request $request)
    {
        try {
            $data = $this->validate($request, [
                "current_comments_count" => "required|numeric",
            ]);
            $comments = Comment::latest()->skip($data['current_comments_count'])
                ->take(15)->get();
            return response()->json([
                "status_code" => true,
                "message" => "comments were fetched successfully",
                "data" => $comments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status_code" => false,
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $data = $this->validate($request, [
                "name" => "required|max:100",
                "comment" => "required|max:2000",
            ]);

            $user = $this->getUser($request);

            $data['user_id'] = $user->id;

            $comment = Comment::create($data);

            return response()->json([
                "status_code" => true,
                "message" => "comment was added successfully",
                "data" => $comment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status_code" => false,
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        try {
            $data = $this->validate($request, [
                "id" => "required|numeric",
                "name" => "max:100",
                "comment" => "max:2000"
            ]);

            $comment = Comment::findOrFail($data['id']);
            
            $user = $this->getUser($request);

            if ($comment->user_id != $user->id)
                throw new Exception("You can not edit this comment.");
            
            $comment->update([
                "name" => $data['name'],
                "comment" => $data['comment']
            ]);

            return response()->json([
                "status_code" => true,
                "message" => "comment was updated successfully"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status_code" => false,
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        try {
            $comment = Comment::findOrFail($id);

            $user = $this->getUser($request);

            if ($comment->user_id != $user->id)
                throw new Exception("You can not delete this comment.");

            $comment->delete();

            return response()->json([
                "status_code" => true,
                "message" => "comment was deleted successfully"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status_code" => false,
                "message" => $e->getMessage()
            ]);
        }
    }
}
