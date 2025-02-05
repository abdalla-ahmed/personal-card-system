<?php

namespace App\Http\Controllers;

use App\Constants\ActivityAction;
use App\Constants\ModuleID;
use App\Http\Requests\Card\CreateCardRequest;
use App\Http\Requests\Card\UpdateCardRequest;
use App\Models\Card;
use App\Services\Activity;
use Illuminate\Http\Request;

class CardController extends ApiController
{
    public function index(Request $request)
    {
        $cards = Card::where('user_id', $request->user()->id)
            ->orderBy('id', 'asc')->get();

        $mappedCards = $cards->map(function ($card) {
            return $this->mapCard($card);
        });

        return $this->resSuccess($mappedCards);
    }

    public function store(Request $request)
    {
        $fileName = null;
        $file = $request->file('logoImageFile');
        if (!is_null($file)) {
            if (!$file->isValid()) {
                return $this->resError('invalid data');
            }
            $fileName = $file->store('uploads/images');
        }

        $data = json_decode($request['jsonData']);

        $cardData = [
            'full_name' => $data->fullName,
            'position' => $data->position,
            'telephone' => $data->telephone,
            'mobile' => $data->mobile,
            'email' => $data->email,
            'address' => $data->address,
            'company_name' => $data->companyName,
            'company_address' => $data->companyAddress,
            'logo_file_name' => $fileName,
        ];

        $card = $request->user()->cards()->create($cardData);
        if (is_null($card)) {
            return $this->resError('Failed to create card');
        }

        Activity::Log(ModuleID::Cards, ActivityAction::CREATE, $card);
        return $this->resNoContent();
    }

    public function show(Card $card)
    {
        $mappedCard = $this->mapCard($card);
        return $this->resSuccess($mappedCard);
    }

    public function showPublic(Request $request)
    {
        $cardId = $request->route('card');
        if (!isset($cardId)) {
            return $this->resUnexpected();
        }

        $card = Card::find($cardId);
        if (is_null($card)) {
            return $this->resNotFound();
        }
        if (!$card->active) {
            return $this->resError('Card is not active');
        }

        $mappedCard = $this->mapCard($card);
        return $this->resSuccess($mappedCard);
    }

    public function update(Request $request, Card $card)
    {
        $fileName = null;
        $file = $request->file('logoImageFile');
        if (!is_null($file)) {
            if (!$file->isValid()) {
                return $this->resError('invalid data');
            }
            $fileName = $file->store('uploads/images');
        }

        $data = json_decode($request['jsonData']);

        $cardData = [
            'full_name' => $data->fullName,
            'position' => $data->position,
            'telephone' => $data->telephone,
            'mobile' => $data->mobile,
            'email' => $data->email,
            'address' => $data->address,
            'company_name' => $data->companyName,
            'company_address' => $data->companyAddress,
        ];

        if (!is_null($fileName)) {
            $cardData['logo_file_name'] = $fileName;
        }

        $card->update($cardData);

        Activity::Log(ModuleID::Cards, ActivityAction::UPDATE, $card);
        return $this->resNoContent();
    }

    public function destroy(Card $card)
    {
        if (!$card->delete()) {
            return $this->resError('Failed to delete card');
        }

        Activity::Log(ModuleID::Cards, ActivityAction::DELETE, $card);
        return $this->resNoContent();
    }

    private function mapCard(Card $card)
    {
        return [
            'id' => $card->id,
            'fullName' => $card->full_name,
            'position' => $card->position,
            'telephone' => $card->telephone,
            'mobile' => $card->mobile,
            'email' => $card->email,
            'address' => $card->address,
            'companyName' => $card->company_name,
            'companyAddress' => $card->company_address,
            'active' => $card->active,
            'logoImageUrl' => $card->logo_file_name,
        ];
    }
}
