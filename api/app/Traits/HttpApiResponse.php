<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

trait HttpApiResponse
{

    public function resSuccess(
        $data = [],
        $message = 'Success.',
        $code = Response::HTTP_OK
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    public function resError(
        $message = 'Something went wrong.',
        $errors = null,
        $code = Response::HTTP_BAD_REQUEST
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }

    public function resUnauthenticated(string $message = 'Unauthenticated.'): JsonResponse
    {
        return $this->resError($message, code: Response::HTTP_UNAUTHORIZED);
    }

    public function resUnauthorized(string $message = 'You\'re not authorized to perform this action.'): JsonResponse
    {
        return $this->resError($message, code: Response::HTTP_FORBIDDEN);
    }

    public function resUnexpected(): JsonResponse
    {
        return $this->resError();
    }

    public function resNotFound($message = 'Not Found.'): JsonResponse
    {
        return $this->resError($message, code: Response::HTTP_NOT_FOUND);
    }

    public function resNoContent(): JsonResponse
    {
        return $this->resSuccess(code: Response::HTTP_NO_CONTENT);
    }
}
