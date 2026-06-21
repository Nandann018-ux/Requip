export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  primaryMobile: string
  secondaryMobile?: string | null
  aadhaarNumber: string
  panNumber: string
  dateOfBirth: string
  placeOfBirth: string
  currentAddress: string
  permanentAddress: string
  isActive: boolean
  isDeleted: boolean
  deletedAt?: string | null
  version: number
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    totalRecords: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}

export interface CreateUserPayload {
  firstName: string
  lastName: string
  email: string
  primaryMobile: string
  secondaryMobile?: string
  aadhaarNumber: string
  panNumber: string
  dateOfBirth: string
  placeOfBirth: string
  currentAddress: string
  permanentAddress: string
}

export type UpdateUserPayload = Partial<Omit<CreateUserPayload, 'email' | 'aadhaarNumber' | 'panNumber'>>
