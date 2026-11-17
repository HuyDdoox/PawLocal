import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet } from '../models/pet.model';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/pets`;

  getMyPets(): Observable<ApiResponse<Pet[]>> {
    return this.http.get<ApiResponse<Pet[]>>(this.API_URL);
  }

  getPetById(id: string): Observable<ApiResponse<Pet>> {
    return this.http.get<ApiResponse<Pet>>(`${this.API_URL}/${id}`);
  }

  createPet(data: Partial<Pet>): Observable<ApiResponse<Pet>> {
    return this.http.post<ApiResponse<Pet>>(this.API_URL, data);
  }

  updatePet(id: string, data: Partial<Pet>): Observable<ApiResponse<Pet>> {
    return this.http.put<ApiResponse<Pet>>(`${this.API_URL}/${id}`, data);
  }

  deletePet(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.API_URL}/${id}`);
  }
}
