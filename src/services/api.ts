import axios, { AxiosInstance } from 'axios'
import { Song, ServiceOrder, Announcement, Scripture, MediaFile, ApiResponse, SermonNote, DetectedVerse } from '../types/index'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // Song endpoints
  async getSongs(): Promise<Song[]> {
    const response = await this.client.get<ApiResponse<Song[]>>('/songs')
    return response.data.data || []
  }

  async getSongById(id: string): Promise<Song> {
    const response = await this.client.get<ApiResponse<Song>>(`/songs/${id}`)
    return response.data.data!
  }

  async createSong(song: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>): Promise<Song> {
    const response = await this.client.post<ApiResponse<Song>>('/songs', song)
    return response.data.data!
  }

  async updateSong(id: string, song: Partial<Song>): Promise<Song> {
    const response = await this.client.put<ApiResponse<Song>>(`/songs/${id}`, song)
    return response.data.data!
  }

  async deleteSong(id: string): Promise<void> {
    await this.client.delete(`/songs/${id}`)
  }

  // Service Order endpoints
  async getServiceOrders(): Promise<ServiceOrder[]> {
    const response = await this.client.get<ApiResponse<ServiceOrder[]>>('/service-orders')
    return response.data.data || []
  }

  async getServiceOrderById(id: string): Promise<ServiceOrder> {
    const response = await this.client.get<ApiResponse<ServiceOrder>>(`/service-orders/${id}`)
    return response.data.data!
  }

  async createServiceOrder(order: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceOrder> {
    const response = await this.client.post<ApiResponse<ServiceOrder>>('/service-orders', order)
    return response.data.data!
  }

  async updateServiceOrder(id: string, order: Partial<ServiceOrder>): Promise<ServiceOrder> {
    const response = await this.client.put<ApiResponse<ServiceOrder>>(`/service-orders/${id}`, order)
    return response.data.data!
  }

  async deleteServiceOrder(id: string): Promise<void> {
    await this.client.delete(`/service-orders/${id}`)
  }

  // Announcement endpoints
  async getAnnouncements(): Promise<Announcement[]> {
    const response = await this.client.get<ApiResponse<Announcement[]>>('/announcements')
    return response.data.data || []
  }

  async createAnnouncement(announcement: Omit<Announcement, 'id'>): Promise<Announcement> {
    const response = await this.client.post<ApiResponse<Announcement>>('/announcements', announcement)
    return response.data.data!
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await this.client.delete(`/announcements/${id}`)
  }

  // Scripture endpoints
  async getScriptures(): Promise<Scripture[]> {
    const response = await this.client.get<ApiResponse<Scripture[]>>('/scriptures')
    return response.data.data || []
  }

  async createScripture(scripture: Omit<Scripture, 'id'>): Promise<Scripture> {
    const response = await this.client.post<ApiResponse<Scripture>>('/scriptures', scripture)
    return response.data.data!
  }

  async deleteScripture(id: string): Promise<void> {
    await this.client.delete(`/scriptures/${id}`)
  }

  // Media endpoints
  async getMediaFiles(): Promise<MediaFile[]> {
    const response = await this.client.get<ApiResponse<MediaFile[]>>('/media')
    return response.data.data || []
  }

  async uploadMedia(file: File): Promise<MediaFile> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await this.client.post<ApiResponse<MediaFile>>('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data!
  }

  async deleteMedia(id: string): Promise<void> {
    await this.client.delete(`/media/${id}`)
  }

  // Import endpoints
  async importEmberFile(file: File): Promise<{ songs: Song[] }> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await this.client.post<ApiResponse<{ songs: Song[] }>>('/import/ember', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data!
  }

  async saveNote(payload: {
    id?: string | null
    content: string
    serviceOrderId?: string | null
  }): Promise<SermonNote> {
    const response = await this.client.post<ApiResponse<SermonNote>>('/notes', payload)
    return response.data.data!
  }

  async detectVerse(text: string, serviceOrderId?: string | null): Promise<DetectedVerse | null> {
    const response = await this.client.post<ApiResponse<DetectedVerse | null>>('/verse-detection', {
      text,
      serviceOrderId,
    })
    return response.data.data || null
  }

  async importPowerPoint(file: File): Promise<{ songs: Song[] }> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await this.client.post<ApiResponse<{ songs: Song[] }>>('/import/powerpoint', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data!
  }
}

export const apiService = new ApiService()
