import { Injectable } from '@angular/core';
import { HttpClientBase, IS_FILE_UPLOAD } from './http-client-base';
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
}
