<?php

namespace App\Http\Controllers;

use App\Constants\ActivityAction;
use App\Constants\ModuleID;
use App\Http\Requests\Card\CreateCardRequest;
use App\Http\Requests\Card\UpdateCardRequest;
use App\Models\Card;
use App\Models\User;
use App\Models\UserRole;
use App\Services\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CardController extends ApiController
{
    public function index(Request $request)
    {
        $currentUser = User::select(['id', 'security_level'])->find(Auth::id());
        $currentUserRoles = UserRole::where('user_id', $currentUser->id)->select(['user_id', 'role_id'])->get();
        $cards = [];

        if ($currentUserRoles->contains('role_id', '=', 1)) { // current user is in admin role
            $cards = Card::with('user:security_level')
                ->whereRelation('user', 'security_level', '<=', $currentUser->security_level)
                ->orderBy('id', 'asc')->get();
        } else {
            $cards = Card::where('user_id', $currentUser->id)
                ->orderBy('id', 'asc')->get();
        }

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
        if (Auth::user()->security_level < $card->user->security_level) {
            return $this->resUnauthorized();
        }

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

    public function updateState(Request $request, Card $card)
    {
        if (Auth::user()->security_level < $card->user->security_level) {
            return $this->resUnauthorized();
        }

        $data = $request->validate(['active' => 'required|bool']);

        if (!$card->update($data)) {
            return $this->resError('Failed update card state');
        }

        return $this->resNoContent();
    }

    public function destroy(Card $card)
    {
        if (Auth::user()->security_level < $card->user->security_level) {
            return $this->resUnauthorized();
        }

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
