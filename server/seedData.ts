import crypto from "crypto";

export function seedDatabase() {
  const hashPass = (pw: string, salt: string) => {
    return crypto.pbkdf2Sync(pw, salt, 1000, 64, "sha512").toString("hex");
  };

  const saltAdmin = "salt_admin_8374921";
  const saltYogendra = "salt_yogendra_99381";
  const saltPriya = "salt_priya_11827";
  const saltRahul = "salt_rahul_48291";
  const saltAnanya = "salt_ananya_33918";
  const saltVikram = "salt_vikram_55291";
  const saltSneha = "salt_sneha_77281";
  const saltArjun = "salt_arjun_66281";

  const defaultPassword = "Password@123";

  const users = [
    {
      id: "usr_admin",
      name: "System Administrator",
      email: "admin@clouddocs.io",
      passwordHash: hashPass(defaultPassword, saltAdmin),
      salt: saltAdmin,
      role: "ADMIN" as const,
      status: "ACTIVE" as const,
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Admin",
      storageQuotaBytes: 50 * 1024 * 1024 * 1024, // 50 GB
      storageUsedBytes: 4.8 * 1024 * 1024 * 1024,
      department: "Cloud Operations",
      title: "Chief Cloud Architect",
      createdAt: "2026-01-10T08:00:00.000Z",
      updatedAt: "2026-08-20T10:00:00.000Z",
    },
    {
      id: "usr_yogendra",
      name: "Yogendra Pratap",
      email: "yogendra@clouddocs.io",
      passwordHash: hashPass(defaultPassword, saltYogendra),
      salt: saltYogendra,
      role: "ADMIN" as const,
      status: "ACTIVE" as const,
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Yogendra",
      storageQuotaBytes: 15 * 1024 * 1024 * 1024, // 15 GB
      storageUsedBytes: 2.84 * 1024 * 1024 * 1024, // 2.84 GB
      department: "Computer Science",
      title: "Lead Cloud Developer & Admin",
      createdAt: "2026-01-15T09:30:00.000Z",
      updatedAt: "2026-08-25T14:20:00.000Z",
    },
    {
      id: "usr_priya",
      name: "Priya Sharma",
      email: "priya.sharma@clouddocs.io",
      passwordHash: hashPass(defaultPassword, saltPriya),
      salt: saltPriya,
      role: "USER" as const,
      status: "ACTIVE" as const,
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Priya",
      storageQuotaBytes: 10 * 1024 * 1024 * 1024,
      storageUsedBytes: 1.42 * 1024 * 1024 * 1024,
      department: "Information Technology",
      title: "Project Lead",
      createdAt: "2026-02-01T11:00:00.000Z",
      updatedAt: "2026-08-22T09:15:00.000Z",
    },
    {
      id: "usr_rahul",
      name: "Rahul Verma",
      email: "rahul.verma@clouddocs.io",
      passwordHash: hashPass(defaultPassword, saltRahul),
      salt: saltRahul,
      role: "USER" as const,
      status: "ACTIVE" as const,
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rahul",
      storageQuotaBytes: 10 * 1024 * 1024 * 1024,
      storageUsedBytes: 980 * 1024 * 1024,
      department: "Computer Science",
      title: "Software Engineer / Student",
      createdAt: "2026-02-10T14:10:00.000Z",
      updatedAt: "2026-08-24T16:40:00.000Z",
    },
    {
      id: "usr_ananya",
      name: "Dr. Ananya Patel",
      email: "ananya.patel@clouddocs.io",
      passwordHash: hashPass(defaultPassword, saltAnanya),
      salt: saltAnanya,
      role: "USER" as const,
      status: "ACTIVE" as const,
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Ananya",
      storageQuotaBytes: 15 * 1024 * 1024 * 1024,
      storageUsedBytes: 3.1 * 1024 * 1024 * 1024,
      department: "Data Engineering",
      title: "Research Scientist",
      createdAt: "2026-03-05T09:00:00.000Z",
      updatedAt: "2026-08-18T11:20:00.000Z",
    },
    {
      id: "usr_vikram",
      name: "Vikram Singh",
      email: "vikram.singh@clouddocs.io",
      passwordHash: hashPass(defaultPassword, saltVikram),
      salt: saltVikram,
      role: "USER" as const,
      status: "ACTIVE" as const,
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Vikram",
      storageQuotaBytes: 10 * 1024 * 1024 * 1024,
      storageUsedBytes: 850 * 1024 * 1024,
      department: "DevOps & Infrastructure",
      title: "Infrastructure Specialist",
      createdAt: "2026-03-12T10:30:00.000Z",
      updatedAt: "2026-08-21T15:00:00.000Z",
    },
    {
      id: "usr_sneha",
      name: "Sneha Deshmukh",
      email: "sneha.deshmukh@clouddocs.io",
      passwordHash: hashPass(defaultPassword, saltSneha),
      salt: saltSneha,
      role: "USER" as const,
      status: "ACTIVE" as const,
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Sneha",
      storageQuotaBytes: 10 * 1024 * 1024 * 1024,
      storageUsedBytes: 620 * 1024 * 1024,
      department: "Machine Learning",
      title: "AI Researcher",
      createdAt: "2026-04-01T12:00:00.000Z",
      updatedAt: "2026-08-19T08:45:00.000Z",
    },
    {
      id: "usr_arjun",
      name: "Arjun Nair",
      email: "arjun.nair@clouddocs.io",
      passwordHash: hashPass(defaultPassword, saltArjun),
      salt: saltArjun,
      role: "USER" as const,
      status: "INACTIVE" as const,
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Arjun",
      storageQuotaBytes: 5 * 1024 * 1024 * 1024,
      storageUsedBytes: 210 * 1024 * 1024,
      department: "Product Design",
      title: "UI/UX Intern",
      createdAt: "2026-05-15T15:20:00.000Z",
      updatedAt: "2026-07-30T17:00:00.000Z",
    },
  ];

  const folders = [
    // Top-level
    {
      id: "fld_college",
      name: "College",
      parentId: null,
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      color: "#3B82F6",
      path: "/College",
      createdAt: "2026-02-01T10:00:00.000Z",
      updatedAt: "2026-08-20T10:00:00.000Z",
    },
    {
      id: "fld_projects",
      name: "Projects",
      parentId: null,
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      color: "#10B981",
      path: "/Projects",
      createdAt: "2026-02-05T11:00:00.000Z",
      updatedAt: "2026-08-22T12:00:00.000Z",
    },
    {
      id: "fld_resume",
      name: "Resume & Career",
      parentId: null,
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      color: "#8B5CF6",
      path: "/Resume & Career",
      createdAt: "2026-02-10T14:00:00.000Z",
      updatedAt: "2026-08-25T09:00:00.000Z",
    },
    {
      id: "fld_certifications",
      name: "Certifications & Badges",
      parentId: null,
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      color: "#F59E0B",
      path: "/Certifications & Badges",
      createdAt: "2026-03-01T09:00:00.000Z",
      updatedAt: "2026-08-15T16:00:00.000Z",
    },

    // Subfolders under College
    {
      id: "fld_college_java",
      name: "Java",
      parentId: "fld_college",
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      color: "#EC4899",
      path: "/College/Java",
      createdAt: "2026-02-02T10:30:00.000Z",
      updatedAt: "2026-08-18T14:00:00.000Z",
    },
    {
      id: "fld_college_aws",
      name: "AWS",
      parentId: "fld_college",
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      color: "#F97316",
      path: "/College/AWS",
      createdAt: "2026-02-02T11:00:00.000Z",
      updatedAt: "2026-08-24T10:00:00.000Z",
    },
    {
      id: "fld_college_dbms",
      name: "DBMS",
      parentId: "fld_college",
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      color: "#6366F1",
      path: "/College/DBMS",
      createdAt: "2026-02-02T11:30:00.000Z",
      updatedAt: "2026-08-19T11:00:00.000Z",
    },

    // Subfolders under Projects
    {
      id: "fld_proj_clouddocs",
      name: "CloudDocs",
      parentId: "fld_projects",
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      color: "#06B6D4",
      path: "/Projects/CloudDocs",
      createdAt: "2026-02-06T12:00:00.000Z",
      updatedAt: "2026-08-25T18:00:00.000Z",
    },
    {
      id: "fld_proj_expenseai",
      name: "ExpenseAI",
      parentId: "fld_projects",
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      color: "#14B8A6",
      path: "/Projects/ExpenseAI",
      createdAt: "2026-02-08T15:00:00.000Z",
      updatedAt: "2026-08-12T13:00:00.000Z",
    },
  ];

  const s3Bucket = "clouddocs-storage-production";

  const documents = [
    {
      id: "doc_resume_pdf",
      name: "Resume_Yogendra_Pratap.pdf",
      originalFileName: "Resume_Yogendra_Pratap.pdf",
      fileType: "PDF" as const,
      mimeType: "application/pdf",
      fileSizeBytes: 245760, // 240 KB
      s3Key: "users/usr_yogendra/documents/doc_resume_pdf/Resume_Yogendra_Pratap_v3.pdf",
      s3Bucket,
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      ownerEmail: "yogendra@clouddocs.io",
      ownerAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Yogendra",
      folderId: "fld_resume",
      currentVersion: 3,
      versionCount: 3,
      isFavorite: true,
      isTrash: false,
      trashAt: null,
      description: "Updated software engineering resume highlighting Java Spring Boot, AWS Cloud & React frontend expertise.",
      tags: ["Career", "Resume", "Spring Boot", "AWS", "React"],
      contentPreviewText: `YOGENDRA PRATAP
Lead Full-Stack Cloud Engineer | yogendra@clouddocs.io | github.com/yogendra

SUMMARY:
Results-driven software engineer with extensive hands-on experience designing scalable cloud platforms, microservices with Spring Boot, secure document repositories on AWS S3, and modern high-performance React applications.

EDUCATION:
Bachelor of Technology in Computer Science & Engineering (2022 - 2026) | GPA: 9.2/10

TECHNICAL SKILLS:
- Languages: Java (17+), TypeScript, JavaScript, SQL, Python
- Frameworks: Spring Boot, Spring Security (JWT), Hibernate/JPA, React, Express, Tailwind CSS
- Cloud & DevOps: Amazon Web Services (S3, EC2, RDS, Lambda, CloudWatch), Docker, Kubernetes, CI/CD
- Databases: MySQL, PostgreSQL, Redis, DynamoDB

FEATURED PROJECTS:
1. CloudDocs - Enterprise Cloud Document Management Platform:
   - Built production-ready multi-tenant document vault with Spring Boot REST API, AWS S3, and MySQL.
   - Enforced fine-grained RBAC, version control, cryptographic hashing, and S3 pre-signed URLs.
2. ExpenseAI - Autonomous Expense & Receipt Parser:
   - Integrated OCR and Gemini AI models with automated categorization.`,
      createdAt: "2026-08-20T09:00:00.000Z",
      updatedAt: "2026-08-25T11:30:00.000Z",
      lastAccessedAt: "2026-08-26T01:45:00.000Z",
      shares: [
        {
          id: "shr_resume_rahul",
          documentId: "doc_resume_pdf",
          sharedWithUserId: "usr_rahul",
          sharedWithUserName: "Rahul Verma",
          sharedWithUserEmail: "rahul.verma@clouddocs.io",
          sharedWithUserAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rahul",
          sharedByUserId: "usr_yogendra",
          sharedByUserName: "Yogendra Pratap",
          permission: "VIEWER" as const,
          createdAt: "2026-08-21T10:00:00.000Z",
          updatedAt: "2026-08-21T10:00:00.000Z",
        },
        {
          id: "shr_resume_priya",
          documentId: "doc_resume_pdf",
          sharedWithUserId: "usr_priya",
          sharedWithUserName: "Priya Sharma",
          sharedWithUserEmail: "priya.sharma@clouddocs.io",
          sharedWithUserAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Priya",
          sharedByUserId: "usr_yogendra",
          sharedByUserName: "Yogendra Pratap",
          permission: "EDITOR" as const,
          createdAt: "2026-08-22T14:30:00.000Z",
          updatedAt: "2026-08-22T14:30:00.000Z",
        },
      ],
    },
    {
      id: "doc_aws_report",
      name: "AWS_Project_Report_Final.pdf",
      originalFileName: "AWS_Project_Report_Final.pdf",
      fileType: "PDF" as const,
      mimeType: "application/pdf",
      fileSizeBytes: 3840000, // 3.84 MB
      s3Key: "users/usr_yogendra/documents/doc_aws_report/AWS_Project_Report_Final.pdf",
      s3Bucket,
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      ownerEmail: "yogendra@clouddocs.io",
      ownerAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Yogendra",
      folderId: "fld_college_aws",
      currentVersion: 2,
      versionCount: 2,
      isFavorite: true,
      isTrash: false,
      trashAt: null,
      description: "Comprehensive architectural and implementation report for Multi-Tier Cloud Deployment using AWS S3, RDS MySQL, and CloudWatch.",
      tags: ["AWS", "College", "Report", "Architecture", "Cloud"],
      contentPreviewText: `PROJECT REPORT: CLOUD COMPUTING & DISTRIBUTED STORAGE ARCHITECTURES
Institution: Department of Computer Science & Engineering
Supervisor: Dr. Ananya Patel | Author: Yogendra Pratap

1. ABSTRACT:
This project demonstrates the design and deployment of a fault-tolerant, scalable, and secure document lifecycle infrastructure. By offloading binary file blobs to Amazon Simple Storage Service (S3) with server-side encryption (SSE-S3/KMS) and maintaining relational metadata in MySQL RDS, we achieve cost efficiency, zero database bloat, and millisecond latency.

2. ARCHITECTURAL PILLARS:
- Tier 1: Frontend SPA (React + TypeScript + Tailwind CSS)
- Tier 2: Microservices Backend (Spring Boot 3.x with Spring Security & JWT)
- Tier 3: Object Store (Amazon S3 bucket with private ACLs and pre-signed GET/PUT URLs)
- Tier 4: Relational Tier (AWS RDS MySQL with read replicas and B-Tree indexes)

3. SECURITY & COMPLIANCE:
All REST endpoints implement stateless JWT authorization. Documents utilize SHA-256 integrity checksum validation during upload streams.`,
      createdAt: "2026-08-18T10:00:00.000Z",
      updatedAt: "2026-08-24T16:00:00.000Z",
      lastAccessedAt: "2026-08-25T20:10:00.000Z",
      shares: [
        {
          id: "shr_aws_priya",
          documentId: "doc_aws_report",
          sharedWithUserId: "usr_priya",
          sharedWithUserName: "Priya Sharma",
          sharedWithUserEmail: "priya.sharma@clouddocs.io",
          sharedWithUserAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Priya",
          sharedByUserId: "usr_yogendra",
          sharedByUserName: "Yogendra Pratap",
          permission: "VIEWER" as const,
          createdAt: "2026-08-23T11:00:00.000Z",
          updatedAt: "2026-08-23T11:00:00.000Z",
        },
      ],
    },
    {
      id: "doc_java_notes",
      name: "Java_Notes_Concurrency_Spring.docx",
      originalFileName: "Java_Notes_Concurrency_Spring.docx",
      fileType: "DOCX" as const,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      fileSizeBytes: 1240000,
      s3Key: "users/usr_yogendra/documents/doc_java_notes/Java_Notes_Concurrency_Spring.docx",
      s3Bucket,
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      ownerEmail: "yogendra@clouddocs.io",
      ownerAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Yogendra",
      folderId: "fld_college_java",
      currentVersion: 1,
      versionCount: 1,
      isFavorite: true,
      isTrash: false,
      trashAt: null,
      description: "Class notes on Java Virtual Threads (Project Loom), CompletableFuture, ConcurrentHashMap, and Spring Transactional boundaries.",
      tags: ["Java", "Spring", "Concurrency", "Notes"],
      contentPreviewText: `CHAPTER 4: ADVANCED JAVA MULTITHREADING & SPRING TRANSACTION MANAGEMENT

1. ExecutorService vs Virtual Threads:
In Java 21+, virtual threads provide lightweight concurrency managed by the JVM rather than the OS kernel. This allows millions of concurrent S3 I/O operations without thread pool exhaustion.

2. Spring @Transactional Isolation Levels:
- READ_COMMITTED (Default in Oracle/PostgreSQL)
- REPEATABLE_READ (Default in MySQL InnoDB)
- SERIALIZABLE (Highest isolation, prevents phantom reads)

3. Optimistic Locking with JPA @Version:
Prevents concurrent edit conflicts when multiple collaborators modify document metadata simultaneously.`,
      createdAt: "2026-08-15T11:20:00.000Z",
      updatedAt: "2026-08-15T11:20:00.000Z",
      lastAccessedAt: "2026-08-25T15:30:00.000Z",
      shares: [],
    },
    {
      id: "doc_dbms_assignment",
      name: "DBMS_Assignment_Schema_Optimization.sql",
      originalFileName: "DBMS_Assignment_Schema_Optimization.sql",
      fileType: "CODE" as const,
      mimeType: "text/x-sql",
      fileSizeBytes: 48200,
      s3Key: "users/usr_yogendra/documents/doc_dbms_assignment/DBMS_Assignment_Schema_Optimization.sql",
      s3Bucket,
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      ownerEmail: "yogendra@clouddocs.io",
      ownerAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Yogendra",
      folderId: "fld_college_dbms",
      currentVersion: 1,
      versionCount: 1,
      isFavorite: false,
      isTrash: false,
      trashAt: null,
      description: "SQL DDL, normal forms (1NF to BCNF) validation, indexing benchmarks (EXPLAIN ANALYZE), and foreign key cascade rules.",
      tags: ["DBMS", "SQL", "MySQL", "Indexing"],
      contentPreviewText: `-- CloudDocs Production Relational Schema Benchmark
-- Optimization for high-throughput document lookup

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    storage_quota_bytes BIGINT UNSIGNED NOT NULL DEFAULT 5368709120,
    storage_used_bytes BIGINT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT UNSIGNED NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    s3_bucket VARCHAR(100) NOT NULL,
    owner_id VARCHAR(36) NOT NULL,
    folder_id VARCHAR(36) NULL,
    current_version INT NOT NULL DEFAULT 1,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_trash BOOLEAN DEFAULT FALSE,
    trash_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_doc_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_doc_folder FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL,
    INDEX idx_doc_owner_trash (owner_id, is_trash),
    INDEX idx_doc_folder (folder_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
      createdAt: "2026-08-12T14:00:00.000Z",
      updatedAt: "2026-08-12T14:00:00.000Z",
      lastAccessedAt: "2026-08-24T18:00:00.000Z",
      shares: [],
    },
    {
      id: "doc_cloud_presentation",
      name: "Cloud_Computing_Presentation.pptx",
      originalFileName: "Cloud_Computing_Presentation.pptx",
      fileType: "PPTX" as const,
      mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      fileSizeBytes: 5420000, // 5.42 MB
      s3Key: "users/usr_yogendra/documents/doc_cloud_presentation/Cloud_Computing_Presentation.pptx",
      s3Bucket,
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      ownerEmail: "yogendra@clouddocs.io",
      ownerAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Yogendra",
      folderId: "fld_college_aws",
      currentVersion: 1,
      versionCount: 1,
      isFavorite: false,
      isTrash: false,
      trashAt: null,
      description: "Slide deck covering S3 lifecycle policies, storage tiers (Standard, Glacier, Intelligent-Tiering), and cross-region replication.",
      tags: ["Presentation", "Cloud", "AWS S3", "Slides"],
      contentPreviewText: `SLIDE 1: SERVERLESS OBJECT STORAGE IN MODERN CLOUD PLATFORMS
Presenter: Yogendra Pratap | Cloud Engineering Seminar

SLIDE 2: THE PROBLEM WITH DATABASE BLOB STORAGE
- Database performance bottlenecks
- Backup explosion and high RDS disk I/O costs
- Lack of CDN edge caching

SLIDE 3: AMAZON S3 INTEGRATION PATTERNS
- Direct Multi-Part Uploads via Pre-signed URLs
- S3 Bucket Policies & IAM Least Privilege
- Event-driven Lambda triggers for thumbnail generation`,
      createdAt: "2026-08-14T16:00:00.000Z",
      updatedAt: "2026-08-14T16:00:00.000Z",
      lastAccessedAt: "2026-08-23T10:00:00.000Z",
      shares: [],
    },
    {
      id: "doc_internship_cert",
      name: "Internship_Certificate_CloudOps.pdf",
      originalFileName: "Internship_Certificate_CloudOps.pdf",
      fileType: "PDF" as const,
      mimeType: "application/pdf",
      fileSizeBytes: 890000,
      s3Key: "users/usr_yogendra/documents/doc_internship_cert/Internship_Certificate_CloudOps.pdf",
      s3Bucket,
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      ownerEmail: "yogendra@clouddocs.io",
      ownerAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Yogendra",
      folderId: "fld_certifications",
      currentVersion: 1,
      versionCount: 1,
      isFavorite: true,
      isTrash: false,
      trashAt: null,
      description: "Certificate of completion for Cloud DevOps & Infrastructure Summer Internship 2025.",
      tags: ["Certificate", "Career", "DevOps"],
      contentPreviewText: `CERTIFICATE OF EXCELLENCE IN CLOUD ENGINEERING
Awarded to: Yogendra Pratap
For outstanding performance as a Cloud Infrastructure Intern. Demonstrated exceptional command of AWS S3, Spring Boot microservices, and Docker containerization.`,
      createdAt: "2026-07-20T10:00:00.000Z",
      updatedAt: "2026-07-20T10:00:00.000Z",
      lastAccessedAt: "2026-08-20T08:00:00.000Z",
      shares: [],
    },
    {
      id: "doc_clouddocs_arch",
      name: "CloudDocs_System_Architecture.png",
      originalFileName: "CloudDocs_System_Architecture.png",
      fileType: "PNG" as const,
      mimeType: "image/png",
      fileSizeBytes: 1540000,
      s3Key: "users/usr_yogendra/documents/doc_clouddocs_arch/CloudDocs_System_Architecture.png",
      s3Bucket,
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      ownerEmail: "yogendra@clouddocs.io",
      ownerAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Yogendra",
      folderId: "fld_proj_clouddocs",
      currentVersion: 2,
      versionCount: 2,
      isFavorite: true,
      isTrash: false,
      trashAt: null,
      description: "Detailed system architecture diagram showing Frontend React, Spring Boot REST Layer, S3 Object Storage, and MySQL RDS cluster.",
      tags: ["Architecture", "System Design", "CloudDocs", "Diagram"],
      contentPreviewText: `[High-Resolution PNG Architectural Blueprint: User -> React Client -> Spring Boot 3 Gateway -> AWS S3 / RDS MySQL Cluster]`,
      createdAt: "2026-08-16T12:00:00.000Z",
      updatedAt: "2026-08-24T17:00:00.000Z",
      lastAccessedAt: "2026-08-26T00:30:00.000Z",
      shares: [
        {
          id: "shr_arch_rahul",
          documentId: "doc_clouddocs_arch",
          sharedWithUserId: "usr_rahul",
          sharedWithUserName: "Rahul Verma",
          sharedWithUserEmail: "rahul.verma@clouddocs.io",
          sharedWithUserAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rahul",
          sharedByUserId: "usr_yogendra",
          sharedByUserName: "Yogendra Pratap",
          permission: "EDITOR" as const,
          createdAt: "2026-08-17T09:00:00.000Z",
          updatedAt: "2026-08-17T09:00:00.000Z",
        },
      ],
    },
    {
      id: "doc_expenseai_spec",
      name: "ExpenseAI_API_Specification.json",
      originalFileName: "ExpenseAI_API_Specification.json",
      fileType: "CODE" as const,
      mimeType: "application/json",
      fileSizeBytes: 24500,
      s3Key: "users/usr_yogendra/documents/doc_expenseai_spec/ExpenseAI_API_Specification.json",
      s3Bucket,
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      ownerEmail: "yogendra@clouddocs.io",
      ownerAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Yogendra",
      folderId: "fld_proj_expenseai",
      currentVersion: 1,
      versionCount: 1,
      isFavorite: false,
      isTrash: false,
      trashAt: null,
      description: "OpenAPI / Swagger 3.0 specification for the ExpenseAI microservices receipt scanning and parsing endpoints.",
      tags: ["OpenAPI", "JSON", "ExpenseAI", "API"],
      contentPreviewText: `{
  "openapi": "3.0.1",
  "info": {
    "title": "ExpenseAI Document Intelligence API",
    "version": "1.2.0",
    "description": "REST API for autonomous optical receipt parsing and ledger synchronization"
  },
  "paths": {
    "/api/v1/receipts/parse": {
      "post": {
        "summary": "Upload and parse receipt image via Gemini AI Vision",
        "parameters": [
          { "name": "Authorization", "in": "header", "required": true, "schema": { "type": "string" } }
        ]
      }
    }
  }
}`,
      createdAt: "2026-08-10T14:30:00.000Z",
      updatedAt: "2026-08-10T14:30:00.000Z",
      lastAccessedAt: "2026-08-21T13:00:00.000Z",
      shares: [],
    },
    {
      id: "doc_project_budget",
      name: "Project_Budget_Q3_Estimates.xlsx",
      originalFileName: "Project_Budget_Q3_Estimates.xlsx",
      fileType: "XLSX" as const,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      fileSizeBytes: 640000,
      s3Key: "users/usr_yogendra/documents/doc_project_budget/Project_Budget_Q3_Estimates.xlsx",
      s3Bucket,
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      ownerEmail: "yogendra@clouddocs.io",
      ownerAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Yogendra",
      folderId: null, // Root
      currentVersion: 1,
      versionCount: 1,
      isFavorite: false,
      isTrash: false,
      trashAt: null,
      description: "AWS Free-Tier and Production cost estimation worksheet covering S3 PUT/GET operations, RDS db.t4g.micro, and CloudWatch metrics.",
      tags: ["Budget", "Excel", "AWS Cost", "Financials"],
      contentPreviewText: `ITEM | RESOURCE TYPE | MONTHLY ESTIMATE | FREE TIER BENEFIT | NET BILL
AWS S3 Standard Storage (50 GB) | Storage | $1.15 | First 5 GB Free | $1.03
AWS RDS MySQL (db.t4g.micro) | Compute/DB | $14.50 | 750 hrs/mo Free (1st yr) | $0.00
AWS CloudFront CDN (100 GB Data Out) | Networking | $8.50 | 1 TB/mo Free | $0.00
Total Estimated Monthly AWS Cloud Cost: $1.03`,
      createdAt: "2026-08-19T11:00:00.000Z",
      updatedAt: "2026-08-19T11:00:00.000Z",
      lastAccessedAt: "2026-08-25T11:00:00.000Z",
      shares: [],
    },
    // Trash document for testing recovery flow
    {
      id: "doc_old_draft_trash",
      name: "Old_Draft_AWS_Notes_Deprecated.txt",
      originalFileName: "Old_Draft_AWS_Notes_Deprecated.txt",
      fileType: "TXT" as const,
      mimeType: "text/plain",
      fileSizeBytes: 12800,
      s3Key: "users/usr_yogendra/documents/doc_old_draft_trash/Old_Draft_AWS_Notes_Deprecated.txt",
      s3Bucket,
      ownerId: "usr_yogendra",
      ownerName: "Yogendra Pratap",
      ownerEmail: "yogendra@clouddocs.io",
      ownerAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Yogendra",
      folderId: null,
      currentVersion: 1,
      versionCount: 1,
      isFavorite: false,
      isTrash: true,
      trashAt: "2026-08-25T08:30:00.000Z",
      description: "Rough draft notes moved to trash bin during documentation cleanup.",
      tags: ["Trash", "Draft", "Deprecated"],
      contentPreviewText: `Rough draft notes on early AWS setup. Deprecated in favor of the formal PDF report.`,
      createdAt: "2026-07-15T09:00:00.000Z",
      updatedAt: "2026-08-25T08:30:00.000Z",
      lastAccessedAt: "2026-08-25T08:30:00.000Z",
      shares: [],
    },
    // Document owned by Priya shared with Yogendra
    {
      id: "doc_team_roadmap",
      name: "Engineering_Team_Roadmap_2026.docx",
      originalFileName: "Engineering_Team_Roadmap_2026.docx",
      fileType: "DOCX" as const,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      fileSizeBytes: 2150000,
      s3Key: "users/usr_priya/documents/doc_team_roadmap/Engineering_Team_Roadmap_2026.docx",
      s3Bucket,
      ownerId: "usr_priya",
      ownerName: "Priya Sharma",
      ownerEmail: "priya.sharma@clouddocs.io",
      ownerAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Priya",
      folderId: null,
      currentVersion: 2,
      versionCount: 2,
      isFavorite: true,
      isTrash: false,
      trashAt: null,
      description: "Q3/Q4 sprint goals, CI/CD pipeline modernization, and security audit milestones.",
      tags: ["Roadmap", "Team", "Sprint", "Documentation"],
      contentPreviewText: `ENGINEERING MILESTONES & ROADMAP 2026
Lead: Priya Sharma | Core Collaborators: Yogendra Pratap, Rahul Verma

MILESTONE 1: S3 OBJECT LIFECYCLE AUTOMATION
- Implement automatic transition from Standard to S3 Glacier Flexible Retrieval for documents older than 90 days.

MILESTONE 2: ZERO-TRUST ROLE BASED ACCESS CONTROL (RBAC)
- Enforce strict JWT claim checking and database ownership checks on every REST endpoint.`,
      createdAt: "2026-08-11T13:00:00.000Z",
      updatedAt: "2026-08-23T15:40:00.000Z",
      lastAccessedAt: "2026-08-25T19:00:00.000Z",
      shares: [
        {
          id: "shr_roadmap_yogendra",
          documentId: "doc_team_roadmap",
          sharedWithUserId: "usr_yogendra",
          sharedWithUserName: "Yogendra Pratap",
          sharedWithUserEmail: "yogendra@clouddocs.io",
          sharedWithUserAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Yogendra",
          sharedByUserId: "usr_priya",
          sharedByUserName: "Priya Sharma",
          permission: "EDITOR" as const,
          createdAt: "2026-08-11T14:00:00.000Z",
          updatedAt: "2026-08-11T14:00:00.000Z",
        },
      ],
    },
    // Document owned by Rahul shared with Yogendra
    {
      id: "doc_docker_compose_notes",
      name: "Docker_Compose_Production_Setup.txt",
      originalFileName: "Docker_Compose_Production_Setup.txt",
      fileType: "TXT" as const,
      mimeType: "text/plain",
      fileSizeBytes: 34200,
      s3Key: "users/usr_rahul/documents/doc_docker_compose_notes/Docker_Compose_Production_Setup.txt",
      s3Bucket,
      ownerId: "usr_rahul",
      ownerName: "Rahul Verma",
      ownerEmail: "rahul.verma@clouddocs.io",
      ownerAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rahul",
      folderId: null,
      currentVersion: 1,
      versionCount: 1,
      isFavorite: false,
      isTrash: false,
      trashAt: null,
      description: "Docker Compose multi-container configuration for Spring Boot, MySQL, and Nginx reverse proxy.",
      tags: ["Docker", "DevOps", "Containers"],
      contentPreviewText: `version: '3.8'
services:
  clouddocs-backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql-db:3306/clouddocs_db
      - AWS_S3_BUCKET_NAME=clouddocs-storage-production
    depends_on:
      - mysql-db
  mysql-db:
    image: mysql:8.0
    environment:
      - MYSQL_DATABASE=clouddocs_db
      - MYSQL_ROOT_PASSWORD=secret`,
      createdAt: "2026-08-17T11:00:00.000Z",
      updatedAt: "2026-08-17T11:00:00.000Z",
      lastAccessedAt: "2026-08-24T12:00:00.000Z",
      shares: [
        {
          id: "shr_docker_yogendra",
          documentId: "doc_docker_compose_notes",
          sharedWithUserId: "usr_yogendra",
          sharedWithUserName: "Yogendra Pratap",
          sharedWithUserEmail: "yogendra@clouddocs.io",
          sharedWithUserAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Yogendra",
          sharedByUserId: "usr_rahul",
          sharedByUserName: "Rahul Verma",
          permission: "VIEWER" as const,
          createdAt: "2026-08-17T11:30:00.000Z",
          updatedAt: "2026-08-17T11:30:00.000Z",
        },
      ],
    },
  ];

  const documentVersions = [
    // Resume versions
    {
      id: "ver_res_v1",
      documentId: "doc_resume_pdf",
      versionNumber: 1,
      versionLabel: "v1.0",
      s3Key: "users/usr_yogendra/documents/doc_resume_pdf/Resume_Yogendra_v1.pdf",
      s3Bucket,
      fileSizeBytes: 210000,
      fileName: "Resume_Yogendra_v1.pdf",
      fileType: "PDF" as const,
      mimeType: "application/pdf",
      checksumSha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      uploadedById: "usr_yogendra",
      uploadedByName: "Yogendra Pratap",
      uploadedByEmail: "yogendra@clouddocs.io",
      changeSummary: "Initial resume upload with coursework and early academic projects.",
      createdAt: "2026-08-20T09:00:00.000Z",
    },
    {
      id: "ver_res_v2",
      documentId: "doc_resume_pdf",
      versionNumber: 2,
      versionLabel: "v2.0",
      s3Key: "users/usr_yogendra/documents/doc_resume_pdf/Resume_Yogendra_v2.pdf",
      s3Bucket,
      fileSizeBytes: 232000,
      fileName: "Resume_Yogendra_v2.pdf",
      fileType: "PDF" as const,
      mimeType: "application/pdf",
      checksumSha256: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
      uploadedById: "usr_yogendra",
      uploadedByName: "Yogendra Pratap",
      uploadedByEmail: "yogendra@clouddocs.io",
      changeSummary: "Added CloudOps internship experience and AWS S3 architecture bullet points.",
      createdAt: "2026-08-22T15:00:00.000Z",
    },
    {
      id: "ver_res_v3",
      documentId: "doc_resume_pdf",
      versionNumber: 3,
      versionLabel: "v3.0",
      s3Key: "users/usr_yogendra/documents/doc_resume_pdf/Resume_Yogendra_Pratap_v3.pdf",
      s3Bucket,
      fileSizeBytes: 245760,
      fileName: "Resume_Yogendra_Pratap.pdf",
      fileType: "PDF" as const,
      mimeType: "application/pdf",
      checksumSha256: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
      uploadedById: "usr_yogendra",
      uploadedByName: "Yogendra Pratap",
      uploadedByEmail: "yogendra@clouddocs.io",
      changeSummary: "Polished typography, updated GPA, added Spring Security & JWT competencies.",
      createdAt: "2026-08-25T11:30:00.000Z",
    },

    // AWS Report versions
    {
      id: "ver_aws_v1",
      documentId: "doc_aws_report",
      versionNumber: 1,
      versionLabel: "v1.0",
      s3Key: "users/usr_yogendra/documents/doc_aws_report/AWS_Project_Report_Draft.pdf",
      s3Bucket,
      fileSizeBytes: 3100000,
      fileName: "AWS_Project_Report_Draft.pdf",
      fileType: "PDF" as const,
      mimeType: "application/pdf",
      checksumSha256: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
      uploadedById: "usr_yogendra",
      uploadedByName: "Yogendra Pratap",
      uploadedByEmail: "yogendra@clouddocs.io",
      changeSummary: "First draft submitted for supervisor review.",
      createdAt: "2026-08-18T10:00:00.000Z",
    },
    {
      id: "ver_aws_v2",
      documentId: "doc_aws_report",
      versionNumber: 2,
      versionLabel: "v2.0",
      s3Key: "users/usr_yogendra/documents/doc_aws_report/AWS_Project_Report_Final.pdf",
      s3Bucket,
      fileSizeBytes: 3840000,
      fileName: "AWS_Project_Report_Final.pdf",
      fileType: "PDF" as const,
      mimeType: "application/pdf",
      checksumSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      uploadedById: "usr_yogendra",
      uploadedByName: "Yogendra Pratap",
      uploadedByEmail: "yogendra@clouddocs.io",
      changeSummary: "Incorporated Dr. Ananya's feedback on S3 pre-signed URL security and IAM boundaries.",
      createdAt: "2026-08-24T16:00:00.000Z",
    },

    // Roadmap versions
    {
      id: "ver_rdm_v1",
      documentId: "doc_team_roadmap",
      versionNumber: 1,
      versionLabel: "v1.0",
      s3Key: "users/usr_priya/documents/doc_team_roadmap/Roadmap_v1.docx",
      s3Bucket,
      fileSizeBytes: 1980000,
      fileName: "Roadmap_v1.docx",
      fileType: "DOCX" as const,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      checksumSha256: "8729837198273918273981273981273981273918273918273918273918273918",
      uploadedById: "usr_priya",
      uploadedByName: "Priya Sharma",
      uploadedByEmail: "priya.sharma@clouddocs.io",
      changeSummary: "Initial roadmap proposal.",
      createdAt: "2026-08-11T13:00:00.000Z",
    },
    {
      id: "ver_rdm_v2",
      documentId: "doc_team_roadmap",
      versionNumber: 2,
      versionLabel: "v2.0",
      s3Key: "users/usr_priya/documents/doc_team_roadmap/Engineering_Team_Roadmap_2026.docx",
      s3Bucket,
      fileSizeBytes: 2150000,
      fileName: "Engineering_Team_Roadmap_2026.docx",
      fileType: "DOCX" as const,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      checksumSha256: "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
      uploadedById: "usr_priya",
      uploadedByName: "Priya Sharma",
      uploadedByEmail: "priya.sharma@clouddocs.io",
      changeSummary: "Updated sprint capacity and added S3 lifecycle automation deliverables.",
      createdAt: "2026-08-23T15:40:00.000Z",
    },
  ];

  const auditLogs = [
    {
      id: "audit_1",
      userId: "usr_yogendra",
      userName: "Yogendra Pratap",
      userEmail: "yogendra@clouddocs.io",
      action: "UPLOAD_VERSION" as const,
      resourceId: "doc_resume_pdf",
      resourceName: "Resume_Yogendra_Pratap.pdf",
      resourceType: "DOCUMENT" as const,
      details: "Uploaded version v3.0 of Resume_Yogendra_Pratap.pdf to AWS S3",
      ipAddress: "192.168.1.104",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126.0",
      timestamp: "2026-08-25T11:30:00.000Z",
    },
    {
      id: "audit_2",
      userId: "usr_yogendra",
      userName: "Yogendra Pratap",
      userEmail: "yogendra@clouddocs.io",
      action: "SHARE_DOCUMENT" as const,
      resourceId: "doc_aws_report",
      resourceName: "AWS_Project_Report_Final.pdf",
      resourceType: "DOCUMENT" as const,
      details: "Shared document with Priya Sharma (priya.sharma@clouddocs.io) with VIEWER permission",
      ipAddress: "192.168.1.104",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126.0",
      timestamp: "2026-08-24T16:15:00.000Z",
    },
    {
      id: "audit_3",
      userId: "usr_priya",
      userName: "Priya Sharma",
      userEmail: "priya.sharma@clouddocs.io",
      action: "UPLOAD_VERSION" as const,
      resourceId: "doc_team_roadmap",
      resourceName: "Engineering_Team_Roadmap_2026.docx",
      resourceType: "DOCUMENT" as const,
      details: "Uploaded version v2.0 of Engineering_Team_Roadmap_2026.docx",
      ipAddress: "172.16.4.22",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/126.0",
      timestamp: "2026-08-23T15:40:00.000Z",
    },
    {
      id: "audit_4",
      userId: "usr_yogendra",
      userName: "Yogendra Pratap",
      userEmail: "yogendra@clouddocs.io",
      action: "DOWNLOAD_DOCUMENT" as const,
      resourceId: "doc_team_roadmap",
      resourceName: "Engineering_Team_Roadmap_2026.docx",
      resourceType: "DOCUMENT" as const,
      details: "Downloaded document via secure AWS S3 pre-signed URL token",
      ipAddress: "192.168.1.104",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126.0",
      timestamp: "2026-08-23T16:00:00.000Z",
    },
    {
      id: "audit_5",
      userId: "usr_yogendra",
      userName: "Yogendra Pratap",
      userEmail: "yogendra@clouddocs.io",
      action: "SOFT_DELETE_DOCUMENT" as const,
      resourceId: "doc_old_draft_trash",
      resourceName: "Old_Draft_AWS_Notes_Deprecated.txt",
      resourceType: "DOCUMENT" as const,
      details: "Moved Old_Draft_AWS_Notes_Deprecated.txt to trash bin",
      ipAddress: "192.168.1.104",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126.0",
      timestamp: "2026-08-25T08:30:00.000Z",
    },
    {
      id: "audit_6",
      userId: "usr_admin",
      userName: "System Administrator",
      userEmail: "admin@clouddocs.io",
      action: "LOGIN" as const,
      resourceId: "usr_admin",
      resourceName: "System Administrator",
      resourceType: "AUTH" as const,
      details: "Admin session initialized via JWT authentication",
      ipAddress: "10.0.0.1",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) Firefox/128.0",
      timestamp: "2026-08-25T07:00:00.000Z",
    },
  ];

  const notifications = [
    {
      id: "notif_1",
      userId: "usr_yogendra",
      title: "Document Shared With You",
      message: 'Priya Sharma shared "Engineering_Team_Roadmap_2026.docx" with you as Editor.',
      type: "SHARE" as const,
      read: false,
      documentId: "doc_team_roadmap",
      createdAt: "2026-08-23T15:45:00.000Z",
    },
    {
      id: "notif_2",
      userId: "usr_yogendra",
      title: "New Document Version",
      message: 'Priya Sharma uploaded v2.0 of "Engineering_Team_Roadmap_2026.docx".',
      type: "VERSION" as const,
      read: false,
      documentId: "doc_team_roadmap",
      createdAt: "2026-08-23T15:40:00.000Z",
    },
    {
      id: "notif_3",
      userId: "usr_yogendra",
      title: "Document Shared With You",
      message: 'Rahul Verma shared "Docker_Compose_Production_Setup.txt" with you as Viewer.',
      type: "SHARE" as const,
      read: true,
      documentId: "doc_docker_compose_notes",
      createdAt: "2026-08-17T11:30:00.000Z",
    },
    {
      id: "notif_4",
      userId: "usr_yogendra",
      title: "AWS S3 Backup Complete",
      message: "Weekly automated bucket integrity audit completed with 100% SHA-256 match.",
      type: "SYSTEM" as const,
      read: true,
      createdAt: "2026-08-24T00:00:00.000Z",
    },
  ];

  return {
    users,
    folders,
    documents,
    documentVersions,
    auditLogs,
    notifications,
  };
}
