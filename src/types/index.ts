export type UserRole = 'USER' | 'ADMIN';

export type FileType =
  | 'PDF'
  | 'DOC'
  | 'DOCX'
  | 'XLS'
  | 'XLSX'
  | 'PPT'
  | 'PPTX'
  | 'TXT'
  | 'JPG'
  | 'JPEG'
  | 'PNG'
  | 'CODE'
  | 'ZIP'
  | 'OTHER';

export type SharePermission = 'VIEWER' | 'EDITOR';

export type AuditAction =
  | 'LOGIN'
  | 'REGISTER'
  | 'UPLOAD_DOCUMENT'
  | 'DOWNLOAD_DOCUMENT'
  | 'VIEW_DOCUMENT'
  | 'RENAME_DOCUMENT'
  | 'MOVE_DOCUMENT'
  | 'FAVORITE_DOCUMENT'
  | 'UNFAVORITE_DOCUMENT'
  | 'SOFT_DELETE_DOCUMENT'
  | 'RESTORE_DOCUMENT'
  | 'PERMANENT_DELETE_DOCUMENT'
  | 'UPLOAD_VERSION'
  | 'SHARE_DOCUMENT'
  | 'UPDATE_SHARE_PERMISSION'
  | 'REVOKE_SHARE'
  | 'CREATE_FOLDER'
  | 'RENAME_FOLDER'
  | 'DELETE_FOLDER'
  | 'UPDATE_PROFILE'
  | 'CHANGE_PASSWORD'
  | 'ADMIN_ACTIVATE_USER'
  | 'ADMIN_DEACTIVATE_USER'
  | 'ADMIN_DELETE_DOCUMENT';

export interface UserPreferences {
  emailNotifications?: boolean;
  activityAlerts?: boolean;
  autoThumbnail?: boolean;
  defaultSharePermission?: 'VIEWER' | 'EDITOR';
  defaultSort?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE';
  storageQuotaBytes: number; // e.g. 5GB default
  storageUsedBytes: number;
  createdAt: string;
  updatedAt: string;
  department?: string;
  title?: string;
  phone?: string;
  location?: string;
  bio?: string;
  preferences?: UserPreferences;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  versionLabel: string; // e.g. "v1.0"
  s3Key: string;
  s3Bucket: string;
  fileSizeBytes: number;
  fileName: string;
  fileType: FileType;
  mimeType: string;
  checksumSha256: string;
  uploadedById: string;
  uploadedByName: string;
  uploadedByEmail: string;
  changeSummary: string;
  createdAt: string;
  downloadUrl?: string;
}

export interface DocumentShare {
  id: string;
  documentId: string;
  sharedWithUserId: string;
  sharedWithUserName: string;
  sharedWithUserEmail: string;
  sharedWithUserAvatar?: string;
  sharedByUserId: string;
  sharedByUserName: string;
  permission: SharePermission;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  originalFileName: string;
  fileType: FileType;
  mimeType: string;
  fileSizeBytes: number;
  s3Key: string;
  s3Bucket: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerAvatar?: string;
  folderId: string | null; // null = root
  folderPath?: string;
  currentVersion: number;
  versionCount: number;
  isFavorite: boolean;
  isTrash: boolean;
  trashAt?: string | null;
  description?: string;
  tags: string[];
  contentPreviewText?: string;
  contentDataUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt?: string;
  shares: DocumentShare[];
  userPermission?: 'OWNER' | 'EDITOR' | 'VIEWER';
}

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  ownerId: string;
  ownerName: string;
  color?: string;
  documentCount?: number;
  folderCount?: number;
  totalSizeBytes?: number;
  createdAt: string;
  updatedAt: string;
  path?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: AuditAction;
  resourceId?: string;
  resourceName?: string;
  resourceType: 'DOCUMENT' | 'FOLDER' | 'USER' | 'AUTH';
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SHARE' | 'VERSION' | 'SYSTEM' | 'SECURITY';
  read: boolean;
  documentId?: string;
  createdAt: string;
  actionUrl?: string;
}

export interface StorageAnalytics {
  totalStorageBytes: number;
  usedStorageBytes: number;
  availableStorageBytes: number;
  percentageUsed: number;
  totalDocuments: number;
  totalFolders: number;
  totalShares: number;
  totalTrash: number;
  filesUploadedThisMonth: number;
  typeDistribution: {
    type: FileType;
    count: number;
    sizeBytes: number;
    color: string;
  }[];
  monthlyUploadTrends: {
    month: string;
    uploads: number;
    sizeMB: number;
  }[];
  activityBreakdown: {
    name: string;
    value: number;
  }[];
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalDocuments: number;
  totalFolders: number;
  totalStorageBytes: number;
  s3Status: {
    status: 'CONNECTED' | 'SIMULATED';
    bucket: string;
    region: string;
    uptime: string;
  };
  mostActiveUsers: {
    id: string;
    name: string;
    email: string;
    documentCount: number;
    storageUsedBytes: number;
  }[];
  topFileTypes: {
    type: string;
    count: number;
    percentage: number;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}
