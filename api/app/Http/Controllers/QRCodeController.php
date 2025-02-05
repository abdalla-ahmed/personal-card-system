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
        $entityid = $request->input('entity_id');

        $qrCode = null;
        switch ($entityType) {
            case 'card': {
                    $card = Card::where('id', $entityid)->first('id');
                    if (is_null($card)) {
                        return $this->resNotFound();
                    }
                    $qrCode = QrCode::size(300)
                        ->format('svg')
                        ->style('dot')
                        ->eye('circle')
                        ->gradient($from[0], $from[1], $from[2], $to[0], $to[1], $to[2], 'diagonal')
                        ->margin(2)
                        ->generate(URL::to("http://localhost:4200/card?id={$card->id}"));
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
