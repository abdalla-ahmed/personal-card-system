<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QRCodeController extends ApiController
{
    public function generateQrCode(Request $request)
    {
        $entityType = $request->input('entity_type');
        $entityid = $request->input('entity_id');

        $qrCode = null;
        switch ($entityType) {
            case 'card': {
                    $card = Card::where('id', $entityid)->first(['active', 'mobile']);
                    if (is_null($card)) {
                        return $this->resNotFound();
                    }
                    if (!$card->active) {
                        return $this->resError('card is disabled');
                    }
                    $qrCode = QrCode::size(300)->phoneNumber($card->mobile);
                    break;
                }
            default:
                return $this->resError('Invalid entity type');
        }

        if (!$qrCode) {
            return $this->resUnexpected();
        }

        return response($qrCode)->header('Content-Type', 'image/svg+xml');
    }
}
