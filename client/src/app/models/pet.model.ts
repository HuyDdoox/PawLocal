export type PetSpecies = 'dog' | 'cat' | 'other';

export interface Pet {
  _id: string;
  owner: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  birthDate?: string;
  weightKg?: number;
  photo?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
