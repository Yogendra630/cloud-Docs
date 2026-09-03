import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Setup upload directory for simulated S3 storage
const STORAGE_DIR = path.join(process.cwd(), ".s3_storage");
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Multer in-memory storage for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "clouddocs-jwt-secret-key-2026-production";
const S3_BUCKET = process.env.AWS_S3_BUCKET_NAME || "clouddocs-cloud-storage";
const AWS_REGION = process.env.AWS_REGION || "us-east-1";

// Simple robust JWT generator and validator
function signToken(payload: { id: string; email: string; role: string; name: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): { id: string; email: string; role: string; name: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// In-Memory Database Store mimicking MySQL schema with persistent seed data
import { seedDatabase } from "./server/seedData.js";
import { springBootSources } from "./server/springBootSources.js";

const db = seedDatabase();

// Auth Middleware
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.query && typeof req.query.token === "string" && req.query.token) {
    token = req.query.token;
  }
  if (!token) {
    res.status(401).json({ success: false, message: "Authentication required. Missing Bearer token or token query param." });
    return;
  }
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ success: false, message: "Invalid or expired JWT token." });
    return;
  }
  const user = db.users.find((u) => u.id === payload.id);
  if (!user || user.status === "INACTIVE") {
    res.status(403).json({ success: false, message: "User account inactive or not found." });
    return;
  }
  req.user = payload;
  next();
};

const adminOnlyMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ success: false, message: "Access denied. Administrator privileges required." });
    return;
  }
  next();
};

function logAudit(
  userId: string,
  userName: string,
  userEmail: string,
  action: string,
  resourceType: "DOCUMENT" | "FOLDER" | "USER" | "AUTH",
  details: string,
  resourceId?: string,
  resourceName?: string,
  req?: Request
) {
  const log: any = {
    id: "audit_" + crypto.randomUUID(),
    userId,
    userName,
    userEmail,
    action: action as any,
    resourceId,
    resourceName,
    resourceType,
    details,
    ipAddress: req?.ip || "127.0.0.1",
    userAgent: (req?.headers["user-agent"] || "CloudDocs-Client").substring(0, 100),
    timestamp: new Date().toISOString(),
  };
  (db.auditLogs as any).unshift(log);
}

function createNotification(
  userId: string,
  title: string,
  message: string,
  type: "SHARE" | "VERSION" | "SYSTEM" | "SECURITY",
  documentId?: string
) {
  const notif: any = {
    id: "notif_" + crypto.randomUUID(),
    userId,
    title,
    message,
    type,
    read: false,
    documentId,
    createdAt: new Date().toISOString(),
  };
  (db.notifications as any).unshift(notif);
}

// -------------------------------------------------------------
// 1. AUTHENTICATION & USER CONTROLLER
// -------------------------------------------------------------

app.post("/api/auth/register", (req: Request, res: Response) => {
  const { name, email, password, department, title } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ success: false, message: "Name, email, and password are required." });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    res.status(409).json({ success: false, message: "An account with this email already exists." });
    return;
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

  const newUser = {
    id: "usr_" + crypto.randomUUID().slice(0, 8),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashedPassword,
    salt,
    role: "USER" as const,
    status: "ACTIVE" as const,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    storageQuotaBytes: 5 * 1024 * 1024 * 1024, // 5 GB
    storageUsedBytes: 0,
    department: department || "General",
    title: title || "Member",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  logAudit(newUser.id, newUser.name, newUser.email, "REGISTER", "AUTH", "User successfully registered", newUser.id, newUser.name, req);

  const token = signToken({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name });

  const { passwordHash, salt: _, ...safeUser } = newUser;
  res.status(201).json({
    success: true,
    message: "Registration successful.",
    data: { token, user: safeUser },
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ success: false, message: "Email and password are required." });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    res.status(401).json({ success: false, message: "Invalid email or password." });
    return;
  }

  if (user.status === "INACTIVE") {
    res.status(403).json({ success: false, message: "Your account has been deactivated. Contact an administrator." });
    return;
  }

  const testHash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, "sha512").toString("hex");
  if (testHash !== user.passwordHash) {
    res.status(401).json({ success: false, message: "Invalid email or password." });
    return;
  }

  logAudit(user.id, user.name, user.email, "LOGIN", "AUTH", "User logged in successfully", user.id, user.name, req);

  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  const { passwordHash: _, salt: __, ...safeUser } = user;

  res.json({
    success: true,
    message: "Login successful.",
    data: { token, user: safeUser },
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/auth/me", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = db.users.find((u) => u.id === req.user!.id);
  if (!user) {
    res.status(404).json({ success: false, message: "User not found." });
    return;
  }
  const { passwordHash: _, salt: __, ...safeUser } = user;
  res.json({
    success: true,
    data: safeUser,
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/auth/logout", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, message: "Logged out successfully." });
});

// Demo switch account helper to test RBAC & collaboration instantly
app.post("/api/auth/switch-account", (req: Request, res: Response) => {
  const { email } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    res.status(404).json({ success: false, message: "User not found." });
    return;
  }
  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  const { passwordHash: _, salt: __, ...safeUser } = user;
  res.json({
    success: true,
    message: `Switched account to ${user.name}`,
    data: { token, user: safeUser },
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/users/search", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const query = ((req.query.q as string) || "").toLowerCase();
  const matched = db.users
    .filter((u) => u.id !== req.user!.id && (u.email.toLowerCase().includes(query) || u.name.toLowerCase().includes(query)))
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      department: u.department,
      title: u.title,
    }))
    .slice(0, 10);
  res.json({ success: true, data: matched });
});

app.put("/api/auth/profile", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = db.users.find((u) => u.id === req.user!.id);
  if (!user) {
    res.status(404).json({ success: false, message: "User not found." });
    return;
  }
  const { name, department, title, avatar, phone, location, bio, preferences } = req.body;
  
  if (name && name.trim()) {
    user.name = name.trim();
    // Update denormalized owner and share names across database
    db.documents.forEach((d) => {
      if (d.ownerId === user.id) d.ownerName = user.name;
      d.shares?.forEach((s: any) => {
        if (s.sharedWithUserId === user.id) s.sharedWithUserName = user.name;
        if (s.sharedByUserId === user.id) s.sharedByUserName = user.name;
      });
    });
    db.folders.forEach((f) => {
      if (f.ownerId === user.id) f.ownerName = user.name;
    });
  }

  if (avatar !== undefined) {
    user.avatar = avatar;
    db.documents.forEach((d) => {
      d.shares?.forEach((s: any) => {
        if (s.sharedWithUserId === user.id) s.sharedWithUserAvatar = user.avatar;
      });
    });
  }

  if (department !== undefined) user.department = department.trim();
  if (title !== undefined) user.title = title.trim();
  if (phone !== undefined) (user as any).phone = phone.trim();
  if (location !== undefined) (user as any).location = location.trim();
  if (bio !== undefined) (user as any).bio = bio.trim();
  if (preferences !== undefined) (user as any).preferences = { ...((user as any).preferences || {}), ...preferences };
  
  user.updatedAt = new Date().toISOString();

  logAudit(user.id, user.name, user.email, "UPDATE_PROFILE", "USER", `Updated profile details and user preferences`, user.id, user.name, req);

  const { passwordHash: _, salt: __, ...safeUser } = user;
  res.json({ success: true, message: "Profile updated successfully.", data: safeUser });
});

app.put("/api/auth/change-password", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = db.users.find((u) => u.id === req.user!.id);
  if (!user) {
    res.status(404).json({ success: false, message: "User not found." });
    return;
  }
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ success: false, message: "Current and new password required." });
    return;
  }
  const checkHash = crypto.pbkdf2Sync(currentPassword, user.salt, 1000, 64, "sha512").toString("hex");
  if (checkHash !== user.passwordHash) {
    res.status(400).json({ success: false, message: "Current password does not match." });
    return;
  }
  const newSalt = crypto.randomBytes(16).toString("hex");
  user.salt = newSalt;
  user.passwordHash = crypto.pbkdf2Sync(newPassword, newSalt, 1000, 64, "sha512").toString("hex");
  user.updatedAt = new Date().toISOString();

  logAudit(user.id, user.name, user.email, "CHANGE_PASSWORD", "USER", "User changed account password", user.id, user.name, req);
  res.json({ success: true, message: "Password updated successfully." });
});

// -------------------------------------------------------------
// 2. FOLDER CONTROLLER
// -------------------------------------------------------------

app.get("/api/folders", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const userFolders = db.folders.filter((f) => f.ownerId === userId);

  // Attach document counts and sizes
  const enriched = userFolders.map((folder) => {
    const docs = db.documents.filter((d) => d.folderId === folder.id && !d.isTrash);
    const subfolders = userFolders.filter((f) => f.parentId === folder.id);
    const totalBytes = docs.reduce((sum, d) => sum + d.fileSizeBytes, 0);
    return {
      ...folder,
      documentCount: docs.length,
      folderCount: subfolders.length,
      totalSizeBytes: totalBytes,
    };
  });

  res.json({ success: true, data: enriched });
});

app.post("/api/folders", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { name, parentId, color } = req.body;
  if (!name || !name.trim()) {
    res.status(400).json({ success: false, message: "Folder name is required." });
    return;
  }

  const userId = req.user!.id;
  let pathStr = "/" + name.trim();
  if (parentId) {
    const parent = db.folders.find((f) => f.id === parentId && f.ownerId === userId);
    if (parent) {
      pathStr = (parent.path || "/" + parent.name) + "/" + name.trim();
    }
  }

  const newFolder = {
    id: "fld_" + crypto.randomUUID().slice(0, 8),
    name: name.trim(),
    parentId: parentId || null,
    ownerId: userId,
    ownerName: req.user!.name,
    color: color || "#3B82F6",
    path: pathStr,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.folders.push(newFolder);
  logAudit(userId, req.user!.name, req.user!.email, "CREATE_FOLDER", "FOLDER", `Created folder ${newFolder.name}`, newFolder.id, newFolder.name, req);

  res.status(201).json({ success: true, message: "Folder created successfully.", data: newFolder });
});

app.put("/api/folders/:id", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const folder = db.folders.find((f) => f.id === id && f.ownerId === req.user!.id);
  if (!folder) {
    res.status(404).json({ success: false, message: "Folder not found or unauthorized." });
    return;
  }

  const { name, color, parentId } = req.body;
  if (name) folder.name = name.trim();
  if (color) folder.color = color;
  if (parentId !== undefined) folder.parentId = parentId;
  folder.updatedAt = new Date().toISOString();

  logAudit(req.user!.id, req.user!.name, req.user!.email, "RENAME_FOLDER", "FOLDER", `Updated folder ${folder.name}`, folder.id, folder.name, req);
  res.json({ success: true, message: "Folder updated.", data: folder });
});

app.delete("/api/folders/:id", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const folderIndex = db.folders.findIndex((f) => f.id === id && f.ownerId === req.user!.id);
  if (folderIndex === -1) {
    res.status(404).json({ success: false, message: "Folder not found or unauthorized." });
    return;
  }

  const deletedFolder = db.folders[folderIndex];
  db.folders.splice(folderIndex, 1);

  // Move documents in this folder to root (folderId = null)
  db.documents.forEach((d) => {
    if (d.folderId === id) {
      d.folderId = null;
    }
  });

  logAudit(req.user!.id, req.user!.name, req.user!.email, "DELETE_FOLDER", "FOLDER", `Deleted folder ${deletedFolder.name}`, deletedFolder.id, deletedFolder.name, req);
  res.json({ success: true, message: "Folder deleted. Contained files moved to root." });
});

// -------------------------------------------------------------
// 3. DOCUMENT CONTROLLER (CRUD, S3 Storage, Permissions)
// -------------------------------------------------------------

function determineFileType(fileName: string, mime: string): any {
  const ext = fileName.split(".").pop()?.toUpperCase() || "";
  if (["PDF"].includes(ext)) return "PDF";
  if (["DOC", "DOCX"].includes(ext)) return ext === "DOC" ? "DOC" : "DOCX";
  if (["XLS", "XLSX"].includes(ext)) return ext === "XLS" ? "XLS" : "XLSX";
  if (["PPT", "PPTX"].includes(ext)) return ext === "PPT" ? "PPTX" : "PPT";
  if (["TXT", "MD", "JSON", "CSV", "XML", "HTML", "JS", "TS", "PY", "JAVA"].includes(ext)) {
    return ext === "TXT" ? "TXT" : "CODE";
  }
  if (["JPG", "JPEG"].includes(ext)) return "JPG";
  if (["PNG"].includes(ext)) return "PNG";
  if (["ZIP", "RAR", "TAR", "GZ"].includes(ext)) return "ZIP";
  return "OTHER";
}

// Helper: Check if user has permission to read document
function checkDocumentAccess(doc: any, userId: string, userRole: string): { canRead: boolean; canEdit: boolean; permission: string } {
  if (userRole === "ADMIN") return { canRead: true, canEdit: true, permission: "ADMIN" };
  if (doc.ownerId === userId) return { canRead: true, canEdit: true, permission: "OWNER" };

  const share = doc.shares?.find((s: any) => s.sharedWithUserId === userId);
  if (share) {
    return {
      canRead: true,
      canEdit: share.permission === "EDITOR",
      permission: share.permission,
    };
  }
  return { canRead: false, canEdit: false, permission: "NONE" };
}

app.get("/api/documents", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const { folderId, type, favorite, trash, shared, sort = "date_desc", search } = req.query;

  let filtered = db.documents.filter((doc) => {
    // Trash filter
    if (trash === "true") {
      return doc.ownerId === userId && doc.isTrash;
    }
    if (doc.isTrash) return false;

    // Shared with me filter
    if (shared === "true") {
      const isShared = doc.shares?.some((s: any) => s.sharedWithUserId === userId);
      return isShared && doc.ownerId !== userId;
    }

    // Ownership or shared access
    const access = checkDocumentAccess(doc, userId, userRole);
    if (!access.canRead) return false;

    // If viewing normal "My Documents" (not shared tab), default to owner
    if (!shared && folderId === undefined && !favorite && doc.ownerId !== userId) {
      return false;
    }

    // Folder filter
    if (folderId !== undefined) {
      if (folderId === "root" || folderId === "null" || folderId === "") {
        if (doc.folderId !== null) return false;
      } else {
        if (doc.folderId !== folderId) return false;
      }
    }

    // Favorite filter
    if (favorite === "true" && !doc.isFavorite) return false;

    // File type filter
    if (type && type !== "ALL") {
      if (doc.fileType !== type) return false;
    }

    // Search query filter
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      const matchName = doc.name.toLowerCase().includes(q);
      const matchTag = doc.tags?.some((t: string) => t.toLowerCase().includes(q));
      const matchOwner = doc.ownerName.toLowerCase().includes(q);
      if (!matchName && !matchTag && !matchOwner) return false;
    }

    return true;
  });

  // Attach dynamic userPermission
  filtered = filtered.map((doc) => {
    const access = checkDocumentAccess(doc, userId, userRole);
    return {
      ...doc,
      userPermission: access.permission as any,
    };
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sort === "name_asc") return a.name.localeCompare(b.name);
    if (sort === "name_desc") return b.name.localeCompare(a.name);
    if (sort === "size_asc") return a.fileSizeBytes - b.fileSizeBytes;
    if (sort === "size_desc") return b.fileSizeBytes - a.fileSizeBytes;
    if (sort === "date_asc") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
  });

  res.json({
    success: true,
    data: filtered,
    total: filtered.length,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/documents/:id", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const doc = db.documents.find((d) => d.id === id);
  if (!doc) {
    res.status(404).json({ success: false, message: "Document not found." });
    return;
  }

  const access = checkDocumentAccess(doc, req.user!.id, req.user!.role);
  if (!access.canRead) {
    res.status(403).json({ success: false, message: "Access denied. You do not have permission to view this document." });
    return;
  }

  // Update last accessed
  doc.lastAccessedAt = new Date().toISOString();

  res.json({
    success: true,
    data: {
      ...doc,
      userPermission: access.permission,
    },
  });
});

// Upload new document (POST /api/documents)
app.post("/api/documents", authMiddleware, upload.single("file"), (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    res.status(404).json({ success: false, message: "User not found." });
    return;
  }

  let fileBuffer: Buffer;
  let originalName: string;
  let mimeType: string;
  let fileSize: number;

  if (req.file) {
    fileBuffer = req.file.buffer;
    originalName = req.file.originalname;
    mimeType = req.file.mimetype || "application/octet-stream";
    fileSize = req.file.size;
  } else if (req.body.fileData && req.body.fileName) {
    // Base64 JSON fallback
    const base64Data = req.body.fileData.replace(/^data:([A-Za-z-+/]+);base64,/, "");
    fileBuffer = Buffer.from(base64Data, "base64");
    originalName = req.body.fileName;
    mimeType = req.body.mimeType || "application/octet-stream";
    fileSize = fileBuffer.length;
  } else {
    res.status(400).json({ success: false, message: "No file provided for upload." });
    return;
  }

  // Check quota
  if (user.storageUsedBytes + fileSize > user.storageQuotaBytes) {
    res.status(400).json({ success: false, message: "Upload failed. Storage quota exceeded." });
    return;
  }

  const docName = req.body.name ? req.body.name.trim() : originalName;
  const folderId = req.body.folderId && req.body.folderId !== "null" && req.body.folderId !== "root" ? req.body.folderId : null;
  const description = req.body.description || "";
  const tags = req.body.tags ? (typeof req.body.tags === "string" ? req.body.tags.split(",").map((t: string) => t.trim()) : req.body.tags) : [];

  const fileType = determineFileType(originalName, mimeType);
  const docId = "doc_" + crypto.randomUUID().slice(0, 8);
  const s3Key = `users/${userId}/documents/${docId}/${originalName}`;
  const checksum = crypto.createHash("sha256").update(fileBuffer).digest("hex");

  // Save to simulated S3 directory storage
  const storageFilePath = path.join(STORAGE_DIR, `${docId}_v1_${originalName}`);
  fs.writeFileSync(storageFilePath, fileBuffer);

  // Generate preview if text or image
  let contentPreviewText = "";
  let contentDataUrl = "";
  if (["TXT", "CODE"].includes(fileType) || mimeType.startsWith("text/")) {
    contentPreviewText = fileBuffer.toString("utf-8").slice(0, 5000);
  } else if (["JPG", "JPEG", "PNG"].includes(fileType) || mimeType.startsWith("image/")) {
    contentDataUrl = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
  }

  const now = new Date().toISOString();
  const v1 = {
    id: "ver_" + crypto.randomUUID().slice(0, 8),
    documentId: docId,
    versionNumber: 1,
    versionLabel: "v1.0",
    s3Key,
    s3Bucket: S3_BUCKET,
    fileSizeBytes: fileSize,
    fileName: originalName,
    fileType,
    mimeType,
    checksumSha256: checksum,
    uploadedById: userId,
    uploadedByName: user.name,
    uploadedByEmail: user.email,
    changeSummary: "Initial version upload",
    createdAt: now,
  };

  const newDoc = {
    id: docId,
    name: docName,
    originalFileName: originalName,
    fileType,
    mimeType,
    fileSizeBytes: fileSize,
    s3Key,
    s3Bucket: S3_BUCKET,
    ownerId: userId,
    ownerName: user.name,
    ownerEmail: user.email,
    ownerAvatar: user.avatar,
    folderId,
    currentVersion: 1,
    versionCount: 1,
    isFavorite: false,
    isTrash: false,
    trashAt: null,
    description,
    tags,
    contentPreviewText,
    contentDataUrl,
    createdAt: now,
    updatedAt: now,
    lastAccessedAt: now,
    shares: [],
  };

  db.documents.unshift(newDoc);
  db.documentVersions.push(v1);

  // Update user storage
  user.storageUsedBytes += fileSize;

  logAudit(userId, user.name, user.email, "UPLOAD_DOCUMENT", "DOCUMENT", `Uploaded ${docName} (${(fileSize / 1024 / 1024).toFixed(2)} MB) to S3`, docId, docName, req);

  res.status(201).json({
    success: true,
    message: "Document successfully uploaded to S3.",
    data: { ...newDoc, userPermission: "OWNER" },
    timestamp: now,
  });
});

// Update document metadata (rename, move, tags)
app.put("/api/documents/:id", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const doc = db.documents.find((d) => d.id === id);
  if (!doc) {
    res.status(404).json({ success: false, message: "Document not found." });
    return;
  }

  const access = checkDocumentAccess(doc, req.user!.id, req.user!.role);
  if (!access.canEdit) {
    res.status(403).json({ success: false, message: "Permission denied. You need Editor or Owner access to modify this document." });
    return;
  }

  const { name, folderId, description, tags, isFavorite } = req.body;
  if (name && name.trim()) {
    const oldName = doc.name;
    doc.name = name.trim();
    logAudit(req.user!.id, req.user!.name, req.user!.email, "RENAME_DOCUMENT", "DOCUMENT", `Renamed from ${oldName} to ${doc.name}`, doc.id, doc.name, req);
  }
  if (folderId !== undefined) {
    doc.folderId = folderId === "root" || folderId === "null" || folderId === null ? null : folderId;
    logAudit(req.user!.id, req.user!.name, req.user!.email, "MOVE_DOCUMENT", "DOCUMENT", `Moved document ${doc.name} to folder`, doc.id, doc.name, req);
  }
  if (description !== undefined) doc.description = description;
  if (tags !== undefined) doc.tags = Array.isArray(tags) ? tags : [];
  if (isFavorite !== undefined) doc.isFavorite = Boolean(isFavorite);

  doc.updatedAt = new Date().toISOString();

  res.json({ success: true, message: "Document updated.", data: doc });
});

// Toggle favorite
app.post("/api/documents/:id/favorite", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const doc = db.documents.find((d) => d.id === id);
  if (!doc) {
    res.status(404).json({ success: false, message: "Document not found." });
    return;
  }

  doc.isFavorite = !doc.isFavorite;
  doc.updatedAt = new Date().toISOString();

  logAudit(
    req.user!.id,
    req.user!.name,
    req.user!.email,
    doc.isFavorite ? "FAVORITE_DOCUMENT" : "UNFAVORITE_DOCUMENT",
    "DOCUMENT",
    `${doc.isFavorite ? "Marked" : "Unmarked"} ${doc.name} as favorite`,
    doc.id,
    doc.name,
    req
  );

  res.json({ success: true, message: doc.isFavorite ? "Added to favorites." : "Removed from favorites.", isFavorite: doc.isFavorite });
});

// Soft Delete (move to Trash)
app.delete("/api/documents/:id", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const doc = db.documents.find((d) => d.id === id);
  if (!doc) {
    res.status(404).json({ success: false, message: "Document not found." });
    return;
  }

  if (doc.ownerId !== req.user!.id && req.user!.role !== "ADMIN") {
    res.status(403).json({ success: false, message: "Only document owners or admins can delete documents." });
    return;
  }

  doc.isTrash = true;
  doc.trashAt = new Date().toISOString();
  doc.updatedAt = new Date().toISOString();

  logAudit(req.user!.id, req.user!.name, req.user!.email, "SOFT_DELETE_DOCUMENT", "DOCUMENT", `Moved ${doc.name} to trash`, doc.id, doc.name, req);
  res.json({ success: true, message: `${doc.name} moved to trash.` });
});

// Restore from Trash
app.post("/api/documents/:id/restore", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const doc = db.documents.find((d) => d.id === id);
  if (!doc) {
    res.status(404).json({ success: false, message: "Document not found." });
    return;
  }

  if (doc.ownerId !== req.user!.id && req.user!.role !== "ADMIN") {
    res.status(403).json({ success: false, message: "Unauthorized." });
    return;
  }

  doc.isTrash = false;
  doc.trashAt = null;
  doc.updatedAt = new Date().toISOString();

  logAudit(req.user!.id, req.user!.name, req.user!.email, "RESTORE_DOCUMENT", "DOCUMENT", `Restored ${doc.name} from trash`, doc.id, doc.name, req);
  res.json({ success: true, message: `${doc.name} restored from trash.` });
});

// Permanent Delete
app.delete("/api/documents/:id/permanent", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const docIndex = db.documents.findIndex((d) => d.id === id);
  if (docIndex === -1) {
    res.status(404).json({ success: false, message: "Document not found." });
    return;
  }

  const doc = db.documents[docIndex];
  if (doc.ownerId !== req.user!.id && req.user!.role !== "ADMIN") {
    res.status(403).json({ success: false, message: "Unauthorized." });
    return;
  }

  // Delete disk files
  try {
    const filesOnDisk = fs.readdirSync(STORAGE_DIR).filter((f) => f.startsWith(`${id}_`));
    filesOnDisk.forEach((f) => {
      try {
        fs.unlinkSync(path.join(STORAGE_DIR, f));
      } catch {
        // ignore individual file deletion error
      }
    });
  } catch {
    // ignore
  }

  // Delete versions & recover storage
  const versions = db.documentVersions.filter((v) => v.documentId === id);
  const totalFreed = versions.reduce((sum, v) => sum + v.fileSizeBytes, doc.fileSizeBytes);

  const owner = db.users.find((u) => u.id === doc.ownerId);
  if (owner) {
    owner.storageUsedBytes = Math.max(0, owner.storageUsedBytes - totalFreed);
  }

  db.documents.splice(docIndex, 1);
  db.documentVersions = db.documentVersions.filter((v) => v.documentId !== id);

  logAudit(req.user!.id, req.user!.name, req.user!.email, "PERMANENT_DELETE_DOCUMENT", "DOCUMENT", `Permanently deleted ${doc.name} from S3 and database`, doc.id, doc.name, req);
  res.json({ success: true, message: `${doc.name} permanently deleted.` });
});

// Empty trash
app.post("/api/documents/empty-trash", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const trashDocs = db.documents.filter((d) => d.ownerId === userId && d.isTrash);
  const trashIds = new Set(trashDocs.map((d) => d.id));

  // Delete disk files for all trash documents
  trashDocs.forEach((d) => {
    try {
      const filesOnDisk = fs.readdirSync(STORAGE_DIR).filter((f) => f.startsWith(`${d.id}_`));
      filesOnDisk.forEach((f) => {
        try {
          fs.unlinkSync(path.join(STORAGE_DIR, f));
        } catch {
          // ignore
        }
      });
    } catch {
      // ignore
    }
  });

  const totalFreed = trashDocs.reduce((sum, d) => sum + d.fileSizeBytes, 0);
  const user = db.users.find((u) => u.id === userId);
  if (user) {
    user.storageUsedBytes = Math.max(0, user.storageUsedBytes - totalFreed);
  }

  db.documents = db.documents.filter((d) => !(d.ownerId === userId && d.isTrash));
  db.documentVersions = db.documentVersions.filter((v) => !trashIds.has(v.documentId));

  logAudit(userId, req.user!.name, req.user!.email, "PERMANENT_DELETE_DOCUMENT", "DOCUMENT", `Emptied trash (${trashDocs.length} items)`, undefined, "Trash Bin", req);
  res.json({ success: true, message: `Trash emptied. ${trashDocs.length} items permanently deleted.` });
});

// -------------------------------------------------------------
// 4. S3 DOWNLOAD & PRE-SIGNED URLS & PREVIEWS
// -------------------------------------------------------------

app.get("/api/documents/:id/download", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { version } = req.query;

  const doc = db.documents.find((d) => d.id === id);
  if (!doc) {
    res.status(404).json({ success: false, message: "Document not found." });
    return;
  }

  const access = checkDocumentAccess(doc, req.user!.id, req.user!.role);
  if (!access.canRead) {
    res.status(403).json({ success: false, message: "Unauthorized." });
    return;
  }

  if (doc.isTrash) {
    res.status(400).json({ success: false, message: "Cannot download a document that is in trash. Please restore it first." });
    return;
  }

  let targetVersionNumber = doc.currentVersion;
  if (version) {
    targetVersionNumber = parseInt(version as string, 10) || doc.currentVersion;
  }

  const ver = db.documentVersions.find((v) => v.documentId === id && v.versionNumber === targetVersionNumber);
  const fileName = ver ? ver.fileName : doc.originalFileName;
  const mimeType = ver?.mimeType || doc.mimeType || "application/octet-stream";

  logAudit(req.user!.id, req.user!.name, req.user!.email, "DOWNLOAD_DOCUMENT", "DOCUMENT", `Downloaded ${doc.name} (v${targetVersionNumber}) via secure S3 pre-signed URL`, doc.id, doc.name, req);

  // Check if file exists on disk
  const storageFilePath = path.join(STORAGE_DIR, `${id}_v${targetVersionNumber}_${fileName}`);
  if (fs.existsSync(storageFilePath)) {
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader("Content-Type", mimeType);
    const stream = fs.createReadStream(storageFilePath);
    stream.pipe(res);
    return;
  }

  // Also check if stored with just docId
  try {
    const potentialFiles = fs.readdirSync(STORAGE_DIR).filter((f) => f.startsWith(`${id}_`));
    if (potentialFiles.length > 0) {
      const matchFile = potentialFiles[0];
      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);
      res.setHeader("Content-Type", mimeType);
      const stream = fs.createReadStream(path.join(STORAGE_DIR, matchFile));
      stream.pipe(res);
      return;
    }
  } catch {
    // fallback to generated
  }

  // If image with data URL
  const dataUrl = (doc as any).contentDataUrl;
  if (dataUrl && typeof dataUrl === "string" && dataUrl.startsWith("data:")) {
    const base64Data = dataUrl.replace(/^data:([A-Za-z-+/]+);base64,/, "");
    const imgBuffer = Buffer.from(base64Data, "base64");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader("Content-Type", mimeType);
    res.send(imgBuffer);
    return;
  }

  // If synthetic/demo text file
  let content = `--- CloudDocs Secure Document ---
Document ID: ${doc.id}
File Name: ${doc.originalFileName}
S3 Object Key: ${doc.s3Key}
Version: v${targetVersionNumber}.0
Owner: ${doc.ownerName} (${doc.ownerEmail})
Generated: ${new Date().toISOString()}
SHA-256: ${ver?.checksumSha256 || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}

Content Summary:
${doc.description || "CloudDocs Enterprise document storage demo file."}
`;
  if (doc.contentPreviewText) {
    content += `\n\n--- Document Body ---\n${doc.contentPreviewText}`;
  }

  res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);
  res.setHeader("Content-Type", mimeType.includes("text") || mimeType.includes("json") ? `${mimeType}; charset=utf-8` : "text/plain; charset=utf-8");
  res.send(Buffer.from(content, "utf-8"));
});

// -------------------------------------------------------------
// 5. VERSION CONTROL CONTROLLER
// -------------------------------------------------------------

app.get("/api/documents/:id/versions", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const doc = db.documents.find((d) => d.id === id);
  if (!doc) {
    res.status(404).json({ success: false, message: "Document not found." });
    return;
  }

  const access = checkDocumentAccess(doc, req.user!.id, req.user!.role);
  if (!access.canRead) {
    res.status(403).json({ success: false, message: "Access denied." });
    return;
  }

  const versions = db.documentVersions
    .filter((v) => v.documentId === id)
    .sort((a, b) => b.versionNumber - a.versionNumber);

  res.json({ success: true, data: versions });
});

app.post("/api/documents/:id/upload-version", authMiddleware, upload.single("file"), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const doc = db.documents.find((d) => d.id === id);
  if (!doc) {
    res.status(404).json({ success: false, message: "Document not found." });
    return;
  }

  const access = checkDocumentAccess(doc, req.user!.id, req.user!.role);
  if (!access.canEdit) {
    res.status(403).json({ success: false, message: "Editor or Owner permission required to upload new version." });
    return;
  }

  let fileBuffer: Buffer;
  let originalName: string;
  let mimeType: string;
  let fileSize: number;

  if (req.file) {
    fileBuffer = req.file.buffer;
    originalName = req.file.originalname;
    mimeType = req.file.mimetype || "application/octet-stream";
    fileSize = req.file.size;
  } else if (req.body.fileData && req.body.fileName) {
    const base64Data = req.body.fileData.replace(/^data:([A-Za-z-+/]+);base64,/, "");
    fileBuffer = Buffer.from(base64Data, "base64");
    originalName = req.body.fileName;
    mimeType = req.body.mimeType || "application/octet-stream";
    fileSize = fileBuffer.length;
  } else {
    res.status(400).json({ success: false, message: "No file provided for new version." });
    return;
  }

  const nextVersionNum = doc.currentVersion + 1;
  const changeSummary = req.body.changeSummary || `Updated to version ${nextVersionNum}.0`;
  const s3Key = `users/${doc.ownerId}/documents/${doc.id}/v${nextVersionNum}_${originalName}`;
  const checksum = crypto.createHash("sha256").update(fileBuffer).digest("hex");

  // Save to disk
  const storageFilePath = path.join(STORAGE_DIR, `${doc.id}_v${nextVersionNum}_${originalName}`);
  fs.writeFileSync(storageFilePath, fileBuffer);

  const fileType = determineFileType(originalName, mimeType);
  const now = new Date().toISOString();

  const newVer = {
    id: "ver_" + crypto.randomUUID().slice(0, 8),
    documentId: doc.id,
    versionNumber: nextVersionNum,
    versionLabel: `v${nextVersionNum}.0`,
    s3Key,
    s3Bucket: S3_BUCKET,
    fileSizeBytes: fileSize,
    fileName: originalName,
    fileType,
    mimeType,
    checksumSha256: checksum,
    uploadedById: req.user!.id,
    uploadedByName: req.user!.name,
    uploadedByEmail: req.user!.email,
    changeSummary,
    createdAt: now,
  };

  db.documentVersions.push(newVer);

  // Update doc metadata
  doc.currentVersion = nextVersionNum;
  doc.versionCount = nextVersionNum;
  doc.fileSizeBytes = fileSize;
  doc.s3Key = s3Key;
  doc.originalFileName = originalName;
  doc.mimeType = mimeType;
  doc.fileType = fileType;
  doc.updatedAt = now;

  if (["TXT", "CODE"].includes(fileType) || mimeType.startsWith("text/")) {
    (doc as any).contentPreviewText = fileBuffer.toString("utf-8").slice(0, 5000);
  } else if (["JPG", "JPEG", "PNG"].includes(fileType) || mimeType.startsWith("image/")) {
    (doc as any).contentDataUrl = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
  }

  logAudit(req.user!.id, req.user!.name, req.user!.email, "UPLOAD_VERSION", "DOCUMENT", `Uploaded version v${nextVersionNum}.0 of ${doc.name}`, doc.id, doc.name, req);

  // Notify collaborators
  doc.shares.forEach((s: any) => {
    if (s.sharedWithUserId !== req.user!.id) {
      createNotification(
        s.sharedWithUserId,
        "New Document Version",
        `${req.user!.name} uploaded v${nextVersionNum}.0 of "${doc.name}"`,
        "VERSION",
        doc.id
      );
    }
  });

  res.status(201).json({
    success: true,
    message: `Version v${nextVersionNum}.0 uploaded successfully.`,
    data: newVer,
  });
});

// -------------------------------------------------------------
// 6. SHARING & COLLABORATION CONTROLLER
// -------------------------------------------------------------

app.post("/api/documents/:id/share", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { email, permission = "VIEWER" } = req.body;

  if (!email || !email.trim()) {
    res.status(400).json({ success: false, message: "Target user email is required." });
    return;
  }

  const doc = db.documents.find((d) => d.id === id);
  if (!doc) {
    res.status(404).json({ success: false, message: "Document not found." });
    return;
  }

  if (doc.ownerId !== req.user!.id && req.user!.role !== "ADMIN") {
    res.status(403).json({ success: false, message: "Only document owners can manage sharing." });
    return;
  }

  const targetEmail = email.trim().toLowerCase();
  const targetUser = db.users.find((u) => u.email.toLowerCase() === targetEmail);
  if (!targetUser) {
    res.status(404).json({ success: false, message: `No registered user found with email: ${email}` });
    return;
  }

  if (targetUser.id === doc.ownerId) {
    res.status(400).json({ success: false, message: "You cannot share a document with its owner." });
    return;
  }

  const existingShare = doc.shares.find((s: any) => s.sharedWithUserId === targetUser.id);
  const now = new Date().toISOString();

  if (existingShare) {
    existingShare.permission = permission;
    existingShare.updatedAt = now;
    logAudit(req.user!.id, req.user!.name, req.user!.email, "UPDATE_SHARE_PERMISSION", "DOCUMENT", `Updated sharing permission for ${targetUser.email} to ${permission} on ${doc.name}`, doc.id, doc.name, req);
    res.json({ success: true, message: `Updated permission to ${permission} for ${targetUser.name}`, data: existingShare });
    return;
  }

  const newShare = {
    id: "shr_" + crypto.randomUUID().slice(0, 8),
    documentId: doc.id,
    sharedWithUserId: targetUser.id,
    sharedWithUserName: targetUser.name,
    sharedWithUserEmail: targetUser.email,
    sharedWithUserAvatar: targetUser.avatar,
    sharedByUserId: req.user!.id,
    sharedByUserName: req.user!.name,
    permission: permission as "VIEWER" | "EDITOR",
    createdAt: now,
    updatedAt: now,
  };

  doc.shares.push(newShare);

  logAudit(req.user!.id, req.user!.name, req.user!.email, "SHARE_DOCUMENT", "DOCUMENT", `Shared ${doc.name} with ${targetUser.email} as ${permission}`, doc.id, doc.name, req);

  createNotification(
    targetUser.id,
    "Document Shared With You",
    `${req.user!.name} shared "${doc.name}" with you as ${permission}.`,
    "SHARE",
    doc.id
  );

  res.status(201).json({ success: true, message: `Document shared with ${targetUser.name} (${permission})`, data: newShare });
});

app.delete("/api/documents/:id/share/:shareId", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id, shareId } = req.params;
  const doc = db.documents.find((d) => d.id === id);
  if (!doc) {
    res.status(404).json({ success: false, message: "Document not found." });
    return;
  }

  if (doc.ownerId !== req.user!.id && req.user!.role !== "ADMIN") {
    res.status(403).json({ success: false, message: "Unauthorized." });
    return;
  }

  const shareIndex = doc.shares.findIndex((s: any) => s.id === shareId || s.sharedWithUserId === shareId);
  if (shareIndex === -1) {
    res.status(404).json({ success: false, message: "Share record not found." });
    return;
  }

  const removed = doc.shares[shareIndex];
  doc.shares.splice(shareIndex, 1);

  logAudit(req.user!.id, req.user!.name, req.user!.email, "REVOKE_SHARE", "DOCUMENT", `Revoked access for ${removed.sharedWithUserEmail} from ${doc.name}`, doc.id, doc.name, req);

  createNotification(
    removed.sharedWithUserId,
    "Access Revoked",
    `Access to "${doc.name}" was removed by ${req.user!.name}.`,
    "SHARE"
  );

  res.json({ success: true, message: "Access revoked." });
});

// -------------------------------------------------------------
// 7. GLOBAL SEARCH & FILTERING
// -------------------------------------------------------------

app.get("/api/search", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const q = ((req.query.q as string) || "").toLowerCase().trim();
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const results = db.documents.filter((doc) => {
    if (doc.isTrash) return false;
    const access = checkDocumentAccess(doc, userId, userRole);
    if (!access.canRead) return false;

    if (!q) return true;

    const matchName = doc.name.toLowerCase().includes(q);
    const matchType = doc.fileType.toLowerCase().includes(q);
    const matchTag = doc.tags?.some((t: string) => t.toLowerCase().includes(q));
    const matchOwner = doc.ownerName.toLowerCase().includes(q);
    const matchDesc = (doc.description || "").toLowerCase().includes(q);

    return matchName || matchType || matchTag || matchOwner || matchDesc;
  });

  res.json({
    success: true,
    data: results.map((d) => ({
      ...d,
      userPermission: checkDocumentAccess(d, userId, userRole).permission,
    })),
    count: results.length,
  });
});

// -------------------------------------------------------------
// 8. AUDIT & ACTIVITY LOGS
// -------------------------------------------------------------

app.get("/api/activity", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const { action, limit = 50 } = req.query;

  let logs = db.auditLogs;
  if (userRole !== "ADMIN") {
    logs = logs.filter((l) => l.userId === userId);
  }

  if (action && action !== "ALL") {
    logs = logs.filter((l) => l.action === action);
  }

  res.json({
    success: true,
    data: logs.slice(0, Number(limit)),
  });
});

// -------------------------------------------------------------
// 9. NOTIFICATIONS
// -------------------------------------------------------------

app.get("/api/notifications", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const userNotifs = db.notifications.filter((n) => n.userId === userId);
  const unreadCount = userNotifs.filter((n) => !n.read).length;

  res.json({
    success: true,
    data: userNotifs,
    unreadCount,
  });
});

app.put("/api/notifications/:id/read", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const notif = db.notifications.find((n) => n.id === req.params.id && n.userId === req.user!.id);
  if (notif) {
    notif.read = true;
  }
  res.json({ success: true });
});

app.post("/api/notifications/read-all", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  db.notifications.forEach((n) => {
    if (n.userId === req.user!.id) {
      n.read = true;
    }
  });
  res.json({ success: true, message: "All notifications marked as read." });
});

// -------------------------------------------------------------
// 10. STORAGE ANALYTICS & DASHBOARD METRICS
// -------------------------------------------------------------

app.get("/api/analytics/storage", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    res.status(404).json({ success: false, message: "User not found." });
    return;
  }

  const userDocs = db.documents.filter((d) => d.ownerId === userId && !d.isTrash);
  const sharedWithMe = db.documents.filter((d) => !d.isTrash && d.shares.some((s: any) => s.sharedWithUserId === userId));
  const trashDocs = db.documents.filter((d) => d.ownerId === userId && d.isTrash);
  const userFolders = db.folders.filter((f) => f.ownerId === userId);

  // Group by file types
  const typeMap: Record<string, { count: number; bytes: number }> = {};
  userDocs.forEach((d) => {
    if (!typeMap[d.fileType]) {
      typeMap[d.fileType] = { count: 0, bytes: 0 };
    }
    typeMap[d.fileType].count += 1;
    typeMap[d.fileType].bytes += d.fileSizeBytes;
  });

  const colors: Record<string, string> = {
    PDF: "#EF4444",
    DOCX: "#3B82F6",
    DOC: "#2563EB",
    XLSX: "#10B981",
    XLS: "#059669",
    PPTX: "#F97316",
    PPT: "#EA580C",
    TXT: "#6B7280",
    CODE: "#8B5CF6",
    PNG: "#EC4899",
    JPG: "#F43F5E",
    ZIP: "#FBBF24",
    OTHER: "#9CA3AF",
  };

  const typeDistribution = Object.entries(typeMap).map(([type, stats]) => ({
    type,
    count: stats.count,
    sizeBytes: stats.bytes,
    color: colors[type] || "#6366F1",
  }));

  const monthlyUploadTrends = [
    { month: "Apr", uploads: 6, sizeMB: 18.4 },
    { month: "May", uploads: 12, sizeMB: 34.2 },
    { month: "Jun", uploads: 15, sizeMB: 48.9 },
    { month: "Jul", uploads: 22, sizeMB: 72.1 },
    { month: "Aug", uploads: userDocs.length + 8, sizeMB: +(user.storageUsedBytes / (1024 * 1024)).toFixed(1) },
  ];

  const activityBreakdown = [
    { name: "Uploads", value: 38 },
    { name: "Downloads", value: 45 },
    { name: "Shares", value: 16 },
    { name: "Edits", value: 24 },
  ];

  res.json({
    success: true,
    data: {
      totalStorageBytes: user.storageQuotaBytes,
      usedStorageBytes: user.storageUsedBytes,
      availableStorageBytes: Math.max(0, user.storageQuotaBytes - user.storageUsedBytes),
      percentageUsed: +((user.storageUsedBytes / user.storageQuotaBytes) * 100).toFixed(1),
      totalDocuments: userDocs.length,
      totalFolders: userFolders.length,
      totalShares: sharedWithMe.length,
      totalTrash: trashDocs.length,
      filesUploadedThisMonth: userDocs.length,
      typeDistribution,
      monthlyUploadTrends,
      activityBreakdown,
    },
  });
});

// -------------------------------------------------------------
// 11. ADMIN DASHBOARD & CONTROLLER
// -------------------------------------------------------------

app.get("/api/admin/overview", authMiddleware, adminOnlyMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const totalUsers = db.users.length;
  const activeUsers = db.users.filter((u) => u.status === "ACTIVE").length;
  const totalDocuments = db.documents.length;
  const totalFolders = db.folders.length;
  const totalStorageBytes = db.users.reduce((sum, u) => sum + u.storageUsedBytes, 0);

  const mostActiveUsers = db.users
    .map((u) => {
      const docCount = db.documents.filter((d) => d.ownerId === u.id).length;
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        documentCount: docCount,
        storageUsedBytes: u.storageUsedBytes,
      };
    })
    .sort((a, b) => b.documentCount - a.documentCount)
    .slice(0, 5);

  const fileTypeCounts: Record<string, number> = {};
  db.documents.forEach((d) => {
    fileTypeCounts[d.fileType] = (fileTypeCounts[d.fileType] || 0) + 1;
  });

  const topFileTypes = Object.entries(fileTypeCounts).map(([type, count]) => ({
    type,
    count,
    percentage: Math.round((count / Math.max(1, totalDocuments)) * 100),
  }));

  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      totalDocuments,
      totalFolders,
      totalStorageBytes,
      s3Status: {
        status: process.env.AWS_ACCESS_KEY_ID ? "CONNECTED" : "SIMULATED",
        bucket: S3_BUCKET,
        region: AWS_REGION,
        uptime: "99.99%",
      },
      mostActiveUsers,
      topFileTypes,
    },
  });
});

app.get("/api/admin/users", authMiddleware, adminOnlyMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const safeUsers = db.users.map((u) => {
    const docCount = db.documents.filter((d) => d.ownerId === u.id).length;
    const { passwordHash: _, salt: __, ...rest } = u;
    return {
      ...rest,
      documentCount: docCount,
    };
  });
  res.json({ success: true, data: safeUsers });
});

app.put("/api/admin/users/:id/status", authMiddleware, adminOnlyMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = db.users.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ success: false, message: "User not found." });
    return;
  }

  user.status = status === "ACTIVE" ? "ACTIVE" : "INACTIVE";
  user.updatedAt = new Date().toISOString();

  logAudit(
    req.user!.id,
    req.user!.name,
    req.user!.email,
    user.status === "ACTIVE" ? "ADMIN_ACTIVATE_USER" : "ADMIN_DEACTIVATE_USER",
    "USER",
    `Admin changed user ${user.email} status to ${user.status}`,
    user.id,
    user.name,
    req
  );

  const { passwordHash: _, salt: __, ...safeUser } = user;
  res.json({ success: true, message: `User status changed to ${user.status}`, data: safeUser });
});

app.put("/api/admin/users/:id/role", authMiddleware, adminOnlyMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = db.users.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ success: false, message: "User not found." });
    return;
  }

  user.role = role === "ADMIN" ? "ADMIN" : "USER";
  user.updatedAt = new Date().toISOString();

  logAudit(req.user!.id, req.user!.name, req.user!.email, "UPDATE_PROFILE", "USER", `Admin changed user ${user.email} role to ${user.role}`, user.id, user.name, req);

  const { passwordHash: _, salt: __, ...safeUser } = user;
  res.json({ success: true, message: `User role updated to ${user.role}`, data: safeUser });
});

app.get("/api/admin/documents", authMiddleware, adminOnlyMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: db.documents });
});

app.delete("/api/admin/documents/:id", authMiddleware, adminOnlyMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const docIndex = db.documents.findIndex((d) => d.id === id);
  if (docIndex === -1) {
    res.status(404).json({ success: false, message: "Document not found." });
    return;
  }

  const doc = db.documents[docIndex];
  db.documents.splice(docIndex, 1);
  db.documentVersions = db.documentVersions.filter((v) => v.documentId !== id);

  logAudit(req.user!.id, req.user!.name, req.user!.email, "ADMIN_DELETE_DOCUMENT", "DOCUMENT", `Admin moderated and removed document ${doc.name}`, doc.id, doc.name, req);
  res.json({ success: true, message: "Document removed by administrator." });
});

app.get("/api/admin/audit-logs", authMiddleware, adminOnlyMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: db.auditLogs });
});

// -------------------------------------------------------------
// 12. SPRING BOOT & MYSQL BACKEND CODE EXPORT & DOCUMENTATION
// -------------------------------------------------------------
app.get("/api/code/spring-boot-sources", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: springBootSources,
  });
});

// -------------------------------------------------------------
// Vite Middleware setup for full-stack SPA
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CloudDocs Server running on http://localhost:${PORT}`);
  });
}

startServer();
