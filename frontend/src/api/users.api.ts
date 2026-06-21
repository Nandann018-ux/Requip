import axios from 'axios'
import type { User, PaginatedResponse, ApiResponse, CreateUserPayload, UpdateUserPayload } from '../types/user'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      (Array.isArray(error.response?.data?.errors)
        ? error.response.data.errors.join(', ')
        : 'An unexpected error occurred')
    return Promise.reject(new Error(message))
  },
)

export const usersApi = {
  getAll: async (page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc') => {
    const { data } = await api.get<PaginatedResponse<User>>('/users', {
      params: { page, limit, sortBy, sortOrder },
    })
    return data
  },

  search: async (q: string, page = 1, limit = 10) => {
    const { data } = await api.get<PaginatedResponse<User>>('/users/search', {
      params: { q, page, limit },
    })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<User>>(`/users/${id}`)
    return data.data!
  },

  create: async (payload: CreateUserPayload) => {
    const { data } = await api.post<ApiResponse<{ id: string }>>('/users', payload)
    return data
  },

  update: async (id: string, payload: UpdateUserPayload) => {
    const { data } = await api.put<ApiResponse<void>>(`/users/${id}`, payload)
    return data
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<void>>(`/users/${id}`)
    return data
  },

  getAuditLogs: async (id: string) => {
    const { data } = await api.get(`/users/${id}/audit-logs`)
    return data
  },
}
