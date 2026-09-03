import {
  ApiResponse,
  DocumentItem,
  DocumentVersion,
  FolderItem,
  AuditLog,
  NotificationItem,
  StorageAnalytics,
  AdminStats,
  User,
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('clouddocs_jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    // If unauthorized, clear invalid token
    localStorage.removeItem('clouddocs_jwt_token');
    localStorage.removeItem('clouddocs_user');
  }

  const json = await res.json().catch(() => ({
    success: false,
    message: res.statusText || 'Network request failed',
  }));

  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Request failed with status ${res.status}`);
  }

  return json.data !== undefined ? json.data : json;
}

export const api = {
  // 1. Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async register(data: { name: string; email: string; password: string; department?: string; title?: string }): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async switchAccount(email: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/switch-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(res);
  },

  async updateProfile(data: {
    name?: string;
    department?: string;
    title?: string;
    avatar?: string;
    phone?: string;
    location?: string;
    bio?: string;
    preferences?: any;
  }): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse(res);
  },

  async searchUsers(query: string): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users/search?q=${encodeURIComponent(query)}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // 2. Documents
  async getDocuments(params: {
    folderId?: string;
    type?: string;
    favorite?: boolean;
    trash?: boolean;
    shared?: boolean;
    sort?: string;
    search?: string;
  } = {}): Promise<DocumentItem[]> {
    const url = new URL(`${window.location.origin}${API_BASE}/documents`);
    if (params.folderId !== undefined) url.searchParams.set('folderId', params.folderId);
    if (params.type) url.searchParams.set('type', params.type);
    if (params.favorite) url.searchParams.set('favorite', 'true');
    if (params.trash) url.searchParams.set('trash', 'true');
    if (params.shared) url.searchParams.set('shared', 'true');
    if (params.sort) url.searchParams.set('sort', params.sort);
    if (params.search) url.searchParams.set('search', params.search);

    const res = await fetch(url.toString(), {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getDocument(id: string): Promise<DocumentItem> {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async uploadDocument(formData: FormData): Promise<DocumentItem> {
    const res = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return handleResponse(res);
  },

  async updateDocument(id: string, updates: Partial<DocumentItem>): Promise<DocumentItem> {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  async toggleFavorite(id: string): Promise<{ isFavorite: boolean }> {
    const res = await fetch(`${API_BASE}/documents/${id}/favorite`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async moveToTrash(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async restoreFromTrash(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/documents/${id}/restore`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async permanentDelete(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/documents/${id}/permanent`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async emptyTrash(): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/documents/empty-trash`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // 3. Versions
  async getVersions(documentId: string): Promise<DocumentVersion[]> {
    const res = await fetch(`${API_BASE}/documents/${documentId}/versions`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async uploadVersion(documentId: string, formData: FormData): Promise<DocumentVersion> {
    const res = await fetch(`${API_BASE}/documents/${documentId}/upload-version`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return handleResponse(res);
  },

  // 4. Download trigger (S3 pre-signed or direct)
  getDownloadUrl(documentId: string, version?: number): string {
    const token = localStorage.getItem('clouddocs_jwt_token') || '';
    const vParam = version ? `&version=${version}` : '';
    return `${API_BASE}/documents/${documentId}/download?token=${encodeURIComponent(token)}${vParam}`;
  },

  async downloadDocumentBlob(documentId: string, fileName: string, version?: number): Promise<void> {
    const vParam = version ? `?version=${version}` : '';
    const res = await fetch(`${API_BASE}/documents/${documentId}/download${vParam}`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({ message: 'Download failed' }));
      throw new Error(errJson.message || `Download failed with HTTP ${res.status}`);
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      a.remove();
    }, 1500);
  },

  // 5. Sharing
  async shareDocument(documentId: string, email: string, permission: 'VIEWER' | 'EDITOR'): Promise<void> {
    const res = await fetch(`${API_BASE}/documents/${documentId}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ email, permission }),
    });
    return handleResponse(res);
  },

  async revokeShare(documentId: string, shareId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/documents/${documentId}/share/${shareId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // 6. Folders
  async getFolders(): Promise<FolderItem[]> {
    const res = await fetch(`${API_BASE}/folders`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async createFolder(name: string, parentId: string | null = null, color = '#3B82F6'): Promise<FolderItem> {
    const res = await fetch(`${API_BASE}/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ name, parentId, color }),
    });
    return handleResponse(res);
  },

  async updateFolder(id: string, updates: { name?: string; color?: string; parentId?: string | null }): Promise<FolderItem> {
    const res = await fetch(`${API_BASE}/folders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  async deleteFolder(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/folders/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // 7. Search
  async search(query: string): Promise<DocumentItem[]> {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // 8. Activity / Audit
  async getActivity(action?: string, limit = 50): Promise<AuditLog[]> {
    const url = new URL(`${window.location.origin}${API_BASE}/activity`);
    if (action) url.searchParams.set('action', action);
    url.searchParams.set('limit', String(limit));
    const res = await fetch(url.toString(), {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // 9. Notifications
  async getNotifications(): Promise<{ data: NotificationItem[]; unreadCount: number }> {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: { ...getAuthHeader() },
    });
    const json = await res.json();
    return { data: json.data || [], unreadCount: json.unreadCount || 0 };
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
  },

  async markAllNotificationsRead(): Promise<void> {
    await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
  },

  // 10. Analytics
  async getStorageAnalytics(): Promise<StorageAnalytics> {
    const res = await fetch(`${API_BASE}/analytics/storage`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // 11. Admin Panel
  async getAdminOverview(): Promise<AdminStats> {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getAdminUsers(): Promise<(User & { documentCount: number })[]> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async setAdminUserStatus(userId: string, status: 'ACTIVE' | 'INACTIVE'): Promise<User> {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  async setAdminUserRole(userId: string, role: 'USER' | 'ADMIN'): Promise<User> {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ role }),
    });
    return handleResponse(res);
  },

  async getAdminDocuments(): Promise<DocumentItem[]> {
    const res = await fetch(`${API_BASE}/admin/documents`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async adminDeleteDocument(documentId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/documents/${documentId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getAdminAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // 12. Spring Boot Sources Inspector
  async getSpringBootSources(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/code/spring-boot-sources`);
    return handleResponse(res);
  },
};
