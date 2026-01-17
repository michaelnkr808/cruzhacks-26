/**
 * API Client for EmbedPath Backend
 * 
 * Centralized API calls to Hono backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Generic fetch wrapper with error handling
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Lessons API
export const lessonsApi = {
  getAll: () => apiFetch<{ lessons: any[] }>('/api/lessons'),
  
  getById: (id: number) => apiFetch<{ lesson: any }>(`/api/lessons/${id}`),
  
  getByCategory: (category: string) => 
    apiFetch<{ lessons: any[] }>(`/api/lessons/category/${category}`),
  
  getByModule: (module: string) => 
    apiFetch<{ lessons: any[] }>(`/api/lessons/module/${module}`),
};

// Progress API
export const progressApi = {
  getUserProgress: (userId: string) => 
    apiFetch<{ progress: any[] }>(`/api/progress/user/${userId}`),
  
  getLessonProgress: (userId: string, lessonId: number) => 
    apiFetch<{ progress: any }>(`/api/progress/user/${userId}/lesson/${lessonId}`),
  
  markComplete: (userId: string, lessonId: number) => 
    apiFetch<{ progress: any }>('/api/progress/complete', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, lesson_id: lessonId }),
    }),
  
  getStats: (userId: string) => 
    apiFetch<{ stats: { completed: number; total: number; percentage: number } }>(
      `/api/progress/stats/${userId}`
    ),
};

// Notes API
export const notesApi = {
  getUserNotes: (userId: string) => 
    apiFetch<{ notes: any[] }>(`/api/notes/user/${userId}`),
  
  getLessonNotes: (userId: string, lessonId: number) => 
    apiFetch<{ note: any }>(`/api/notes/user/${userId}/lesson/${lessonId}`),
  
  saveNotes: (userId: string, lessonId: number, content: string) => 
    apiFetch<{ note: any }>('/api/notes/save', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, lesson_id: lessonId, content }),
    }),
  
  deleteNotes: (noteId: string) => 
    apiFetch<{ message: string }>(`/api/notes/${noteId}`, {
      method: 'DELETE',
    }),
};

// Users API
export const usersApi = {
  getById: (userId: string) => 
    apiFetch<{ user: any }>(`/api/users/${userId}`),
  
  getByEmail: (email: string) => 
    apiFetch<{ user: any }>(`/api/users/email/${email}`),
  
  create: (userData: { email: string; name: string; level: string }) => 
    apiFetch<{ user: any }>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  update: (userId: string, userData: Partial<{ name: string; level: string }>) => 
    apiFetch<{ user: any }>(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
};

// Projects API
export const projectsApi = {
  getUserProjects: (userId: string) => 
    apiFetch<{ projects: any[] }>(`/api/projects/user/${userId}`),
  
  getById: (projectId: string) => 
    apiFetch<{ project: any }>(`/api/projects/${projectId}`),
  
  create: (projectData: { user_id: string; name: string; modules: any[]; connections: any[] }) => 
    apiFetch<{ project: any }>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    }),
  
  update: (projectId: string, projectData: Partial<{ name: string; modules: any[]; connections: any[] }>) => 
    apiFetch<{ project: any }>(`/api/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    }),
  
  delete: (projectId: string) => 
    apiFetch<{ message: string }>(`/api/projects/${projectId}`, {
      method: 'DELETE',
    }),
};

// Export all APIs
export const api = {
  lessons: lessonsApi,
  progress: progressApi,
  notes: notesApi,
  users: usersApi,
  projects: projectsApi,
};

export default api;
