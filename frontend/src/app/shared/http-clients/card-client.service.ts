import { Injectable } from '@angular/core';
import {HttpClientBase, IS_FILE_UPLOAD, SKIP_API_ERROR_RESPONSE_HANDLING} from './http-client-base';
import { HttpContext } from '@angular/common/http';

export interface CardForListDto {
    id: number;
    fullName: string;
    position: string;
    telephone: string;
    mobile: string;
    email: string;
    address: string;
    companyName: string;
    companyAddress: string;
    active: boolean;
    logoImageUrl: string;
}

export interface CardDto {
    id: number;
    fullName: string;
    position: string;
    telephone: string;
    mobile: string;
    email: string;
    address: string;
    companyName: string;
    companyAddress: string;
    active: boolean;
    logoImageUrl: string;
}

export interface CreateCardDto {
    fullName: string;
    position: string;
    telephone: string;
    mobile: string;
    email: string;
    address: string;
    companyName: string;
    companyAddress: string;
}

export interface UpdateCardDto {
    id: number;
    fullName: string;
    position: string;
    telephone: string;
    mobile: string;
    email: string;
    address: string;
    companyName: string;
    companyAddress: string;
}

export interface UpdateCardStateDto {
    id: number;
    active: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CardClientService extends HttpClientBase {
    constructor() {
        super();
    }

    all() {
        return this.get<CardForListDto[]>(`cards`);
    }

    getById(id: number) {
        return this.get<CardDto>(`cards/${id}`);
    }

    publicGetById(id: number) {
        return this.http.get<CardDto>(`${this.baseUrl}/public/cards/${id}`, {
            context: new HttpContext().set(SKIP_API_ERROR_RESPONSE_HANDLING, true),
        });
    }

    createCard(dto: CreateCardDto, logoImageFile?: File) {
        const formData = new FormData();
        formData.append("logoImageFile", logoImageFile);
        formData.append("jsonData", JSON.stringify(dto));
        return this.http.post(`${this.baseUrl}/cards`, formData, {
            context: new HttpContext().set(IS_FILE_UPLOAD, true)
        });
    }

    updateCard(dto: UpdateCardDto, logoImageFile?: File) {
        const formData = new FormData();
        formData.append("logoImageFile", logoImageFile);
        formData.append("jsonData", JSON.stringify(dto));
        return this.http.post(`${this.baseUrl}/cards/${dto.id}`, formData, {
            context: new HttpContext().set(IS_FILE_UPLOAD, true)
        });
    }

    deleteCard(id: number) {
        return this.delete(`cards/${id}`);
    }

    updateState(dto: UpdateCardStateDto) {
        return this.patch(`cards/${dto.id}`, dto);
    }
}
