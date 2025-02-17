<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QRCodeController extends ApiController
{
    public function generateQrCode(Request $request)
    {
        $from = [255, 0, 0];
        $to = [0, 0, 255];

        $entityType = $request->input('entity_type');
        $entityId = $request->input('entity_id');

        switch ($entityType) {
            case 'card': {
                    $card = Card::where('id', $entityId)->first('id');
                    if (is_null($card)) {
                        return $this->resNotFound();
                    }
                    $qrCode = QrCode::size(300)
                        ->format('svg')
                        ->style('round', 0.9)
                        ->eye('circle')
                        ->gradient($from[0], $from[1], $from[2], $to[0], $to[1], $to[2], 'DIAGONAL')
                        ->margin(2)
                        ->generate(URL::to("http://localhost:4200/public/card?id={$card->id}"));
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
