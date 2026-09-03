# ☁️ CloudDocs — Cloud-Based Document Management & Collaboration Platform

<p align="center">

<img src="https://img.shields.io/badge/Java-17%2B-orange?style=for-the-badge&logo=openjdk" />
<img src="https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=for-the-badge&logo=springboot" />
<img src="https://img.shields.io/badge/React-TypeScript-blue?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql" />
<img src="https://img.shields.io/badge/AWS-S3-orange?style=for-the-badge&logo=amazonaws" />
<img src="https://img.shields.io/badge/JWT-Authentication-purple?style=for-the-badge" />

</p>

<p align="center">
  <b>A secure, scalable and modern cloud document management platform for individuals, students, teams and organizations.</b>
</p>

---

## ✨ Overview

**CloudDocs** is a full-stack cloud-based document management and collaboration platform designed to help users securely upload, organize, search, share, download and manage documents from a centralized dashboard.

The application combines a modern React frontend with a secure Spring Boot backend, MySQL database and Amazon S3 cloud storage.

Instead of storing large files directly inside the database, CloudDocs stores document files in **Amazon S3** while storing document metadata, ownership, sharing permissions, versions and activity information in **MySQL**.

---

## 🎯 Problem Statement

Managing documents across laptops, email attachments, messaging applications and multiple cloud drives can become difficult.

Common problems include:

- Documents scattered across different locations
- Difficulty finding old files
- Duplicate document versions
- Unsafe file sharing
- No centralized activity tracking
- Poor access control
- Accidental deletion
- Lack of document history
- Difficulty managing team documents

CloudDocs addresses these problems through a centralized, secure and user-friendly document management system.

---

## 💡 Solution

CloudDocs provides a single platform where users can:

- Upload documents
- Create folders
- Organize files
- Search documents
- Download files
- Share documents
- Control sharing permissions
- Create document versions
- Favorite important documents
- Restore deleted files
- Track recent activity
- Manage account settings
- Monitor storage usage

Administrators can additionally manage users, monitor platform activity and view system-level analytics.

---

# 🚀 Key Features

## 🔐 Authentication & Authorization

- User registration
- User login
- JWT-based authentication
- Secure password hashing
- Logout
- Protected routes
- Role-based authorization
- USER and ADMIN roles
- Profile management
- Change password
- Account enable/disable
- Authentication validation
- Secure API endpoints

---

## 📊 Dashboard

The dashboard provides an overview of the user's documents and activities.

### Dashboard statistics

- Total documents
- Total folders
- Storage usage
- Shared documents
- Favorite documents
- Recently accessed files

### Analytics

- Upload activity
- Download activity
- Storage usage
- File type distribution
- Recent document activity

---

## 📁 Document Management

Users can perform complete CRUD operations on documents.

### Supported operations

- Upload document
- View document
- View document details
- Rename document
- Download document
- Move document
- Delete document
- Restore document
- Permanently delete document
- Favorite/unfavorite document
- Upload new version
- View document version history

### Supported file types

```text
PDF
DOC
DOCX
XLS
XLSX
PPT
PPTX
TXT
JPG
JPEG
PNG
```

---

# ☁️ AWS S3 Cloud Storage

CloudDocs uses **Amazon S3** for storing actual document files.

The database stores only metadata such as:

```text
File Name
File Type
File Size
Owner
Folder
S3 Object Key
Version
Created Date
Updated Date
```

The actual document is stored in:

```text
Amazon S3
```

### Storage architecture

```text
User
  |
  v
React Frontend
  |
  v
Spring Boot REST API
  |
  +--------------------+
  |                    |
  v                    v
MySQL Database      Amazon S3
  |                    |
  |                    |
Metadata             Actual File
```

---

# 📂 Folder Management

Users can organize documents using folders.

Features include:

- Create folder
- Rename folder
- Delete folder
- Move folder
- Nested folders
- Parent-child folder relationships
- Breadcrumb navigation

Example:

```text
My Documents
│
├── College
│   ├── Assignments
│   ├── Projects
│   └── Notes
│
├── Resume
│
└── Certificates
```

---

# 🔎 Search & Filtering

CloudDocs provides document search functionality.

Users can search using:

- File name
- File type
- Folder
- Owner
- Upload date
- Modified date

Example API:

```http
GET /api/documents/search?query=resume
```

---

# 🤝 Document Sharing

Users can share documents with registered users.

### Sharing permissions

```text
VIEWER
EDITOR
```

### Viewer

Can:

- View document
- Download document

### Editor

Can:

- View document
- Download document
- Modify document
- Upload new version

Users can also remove previously granted access.

---

# 📝 Document Versioning

CloudDocs maintains document history.

Example:

```text
Resume_v1
Resume_v2
Resume_v3
Resume_v4
```

Each version stores:

```text
Version Number
S3 Object Key
File Size
Uploaded By
Upload Date
Change Description
```

Example:

```text
Version 1
Initial Resume

Version 2
Updated Skills

Version 3
Added Internship Experience
```

---

# ⭐ Favorites

Users can mark frequently used documents as favorites.

Features:

- Add to favorites
- Remove from favorites
- Favorite documents page
- Quick access

---

# 🕒 Recent Documents

The system tracks recently accessed documents.

Users can quickly access:

- Recently opened documents
- Recently downloaded documents
- Recently uploaded documents

---

# 🗑️ Trash / Recycle Bin

Deleted documents are first moved to trash instead of being permanently removed.

Users can:

```text
Delete
   ↓
Trash
   ↓
Restore
   ↓
Document
```

Or:

```text
Trash
   ↓
Permanent Delete
```

---

# 📜 Activity & Audit Logs

CloudDocs records important user activities.

Example:

```text
USER uploaded Resume.pdf
USER downloaded Project.pdf
USER renamed Notes.pdf
USER shared Report.pdf
USER deleted Assignment.pdf
USER restored Resume.pdf
```

Example database table:

```text
audit_logs
```

---

# 👨‍💼 Admin Dashboard

Administrators receive a separate dashboard.

Admin statistics include:

- Total users
- Active users
- Total documents
- Total storage
- Total uploads
- Total downloads
- File type distribution
- User activity

Admin operations:

- View users
- Search users
- Activate users
- Deactivate users
- View document metadata
- Monitor activity
- Manage platform resources

---

# 🛠️ Technology Stack

## Frontend

```text
React
TypeScript
Tailwind CSS
React Router
Axios
Recharts
HTML5
CSS3
```

## Backend

```text
Java
Spring Boot
Spring Security
JWT
Spring Data JPA
Hibernate
Maven
REST API
```

## Database

```text
MySQL 8+
```

## Cloud

```text
Amazon S3
AWS IAM
AWS Lambda
AWS RDS
AWS CloudWatch
```

> Use only the AWS services that you actually implement. For a student project, S3 + a local MySQL database is enough to demonstrate the core architecture.

---

# 🏗️ System Architecture

```text
                   ┌─────────────────────┐
                   │       User          │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │   React Frontend    │
                   │  TypeScript + UI    │
                   └──────────┬──────────┘
                              │
                         REST API
                              │
                              ▼
                   ┌─────────────────────┐
                   │   Spring Boot API   │
                   │                     │
                   │ Controllers         │
                   │ Services            │
                   │ Security            │
                   │ Repositories        │
                   └───────┬─────┬───────┘
                           │     │
                  ┌────────┘     └────────┐
                  ▼                       ▼
          ┌───────────────┐       ┌──────────────┐
          │     MySQL     │       │  Amazon S3   │
          │               │       │              │
          │ Metadata      │       │ Actual Files │
          │ Users         │       │ Documents    │
          │ Documents     │       │ Versions     │
          │ Permissions   │       │              │
          └───────────────┘       └──────────────┘
```

---

# 📁 Project Structure

```text
CloudDocs/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   │
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── clouddocs/
│   │   │   │           ├── controller/
│   │   │   │           ├── service/
│   │   │   │           ├── repository/
│   │   │   │           ├── entity/
│   │   │   │           ├── dto/
│   │   │   │           ├── security/
│   │   │   │           ├── config/
│   │   │   │           └── exception/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── architecture.png
│   └── api-documentation.md
│
├── .gitignore
├── README.md
└── LICENSE
```

---

# 🗄️ Database Design

## Users

```text
users
-------------------------
id
name
email
password
role
enabled
created_at
updated_at
```

---

## Roles

```text
roles
-------------------------
id
name
```

---

## Documents

```text
documents
-------------------------
id
user_id
folder_id
file_name
file_type
file_size
s3_key
version
is_deleted
created_at
updated_at
```

---

## Folders

```text
folders
-------------------------
id
user_id
parent_folder_id
name
created_at
updated_at
```

---

## Document Versions

```text
document_versions
-------------------------
id
document_id
version_number
s3_key
file_size
uploaded_by
change_description
created_at
```

---

## Document Shares

```text
document_shares
-------------------------
id
document_id
shared_by
shared_with
permission
created_at
```

---

## Favorites

```text
favorites
-------------------------
id
user_id
document_id
created_at
```

---

## Audit Logs

```text
audit_logs
-------------------------
id
user_id
document_id
action
created_at
```

---

## Notifications

```text
notifications
-------------------------
id
user_id
message
is_read
created_at
```

---

# 🔐 Authentication Flow

```text
User
 |
 | Register
 v
Spring Boot
 |
 | Validate Data
 v
Password Hashing
 |
 v
MySQL
 |
 | Login
 v
JWT Generated
 |
 v
Frontend
 |
 | JWT
 v
Protected API
```

---

# 🔑 JWT Security

The application uses JWT authentication.

Example:

```http
Authorization: Bearer <JWT_TOKEN>
```

The backend validates the token before allowing access to protected resources.

---

# 🌐 REST API

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

---

## Documents

```http
GET    /api/documents
POST   /api/documents
GET    /api/documents/{id}
PUT    /api/documents/{id}
DELETE /api/documents/{id}
```

---

## Document Versions

```http
POST /api/documents/{id}/versions
GET  /api/documents/{id}/versions
GET  /api/documents/{id}/versions/{versionId}
```

---

## Document Sharing

```http
POST   /api/documents/{id}/share
GET    /api/documents/{id}/shares
DELETE /api/documents/{id}/share/{userId}
```

---

## Folders

```http
GET    /api/folders
POST   /api/folders
PUT    /api/folders/{id}
DELETE /api/folders/{id}
```

---

## Search

```http
GET /api/documents/search?query=resume
```

---

## Favorites

```http
GET  /api/favorites
POST /api/documents/{id}/favorite
DELETE /api/documents/{id}/favorite
```

---

## Activity

```http
GET /api/activity
```

---

# 🎨 UI/UX

CloudDocs follows a modern SaaS-style interface.

### UI components

- Responsive sidebar
- Collapsible navigation
- Top navigation bar
- Profile menu
- Notification system
- Global search
- Breadcrumb navigation
- Mobile navigation
- Dark mode
- Light mode
- File cards
- File table
- Upload modal
- Share modal
- Version history modal
- Confirmation dialogs
- Toast notifications

---

# ⏳ Loading States

The application includes:

```text
Skeleton loaders
Spinners
Upload progress
Disabled buttons
Loading cards
Loading tables
```

---

# 📭 Empty States

Examples:

```text
No documents found.

Upload your first document to get started.
```

```text
No favorites yet.

Mark important documents as favorites.
```

```text
Trash is empty.

Deleted documents will appear here.
```

---

# ⚡ Optimistic Updates

For safe operations, the frontend can update the UI immediately and rollback if the API request fails.

Example:

```text
User clicks Favorite
        ↓
UI instantly shows Favorite
        ↓
API request
        ↓
Success → Keep update
        ↓
Failure → Rollback UI
```

---

# 🔒 Security

CloudDocs follows common application security practices.

Security features include:

- JWT authentication
- Password hashing
- Role-based access control
- Ownership validation
- Backend authorization
- Private S3 bucket
- Secure object keys
- File type validation
- File size validation
- CORS configuration
- Environment variables
- SQL injection protection through JPA/parameterized queries
- Secure API endpoints
- No sensitive credentials committed to GitHub

---

# ☁️ AWS S3 Configuration

Create an S3 bucket for document storage.

Example environment variables:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your_bucket_name
```

Never commit real AWS credentials.

Add them to:

```text
.env
```

and ensure `.env` is included in `.gitignore`.

---

# 🧪 Environment Variables

## Backend

Example:

```env
DB_URL=jdbc:mysql://localhost:3306/clouddocs
DB_USERNAME=root
DB_PASSWORD=your_password

JWT_SECRET=your_secure_jwt_secret

AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your_bucket_name
```

---

## Frontend

Example:

```env
VITE_API_URL=http://localhost:8080/api
```

---

# 🧰 Prerequisites

Install the following:

```text
Java 17+
Node.js 18+
npm
MySQL 8+
Git
Maven
AWS Account
```

Check versions:

```bash
java -version
node -v
npm -v
mysql --version
git --version
mvn -version
```

---

# 📥 Installation

## 1. Clone Repository

```bash
git clone https://github.com/Yogendra630/CloudDocs.git
```

Move into the project:

```bash
cd CloudDocs
```

---

# 🗄️ 2. Configure MySQL

Open MySQL:

```sql
CREATE DATABASE clouddocs;
```

Select the database:

```sql
USE clouddocs;
```

Run the database schema:

```bash
mysql -u root -p clouddocs < database/schema.sql
```

Run seed data:

```bash
mysql -u root -p clouddocs < database/seed.sql
```

---

# ⚙️ 3. Configure Backend

Go to backend:

```bash
cd backend
```

Update:

```text
src/main/resources/application.properties
```

Example:

```properties
spring.application.name=CloudDocs

server.port=8080

spring.datasource.url=jdbc:mysql://localhost:3306/clouddocs
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB

jwt.secret=YOUR_SECURE_JWT_SECRET

aws.region=ap-south-1
aws.s3.bucket=YOUR_BUCKET_NAME
aws.access-key=${AWS_ACCESS_KEY_ID}
aws.secret-key=${AWS_SECRET_ACCESS_KEY}
```

---

# ▶️ 4. Run Backend

Inside the backend directory:

```bash
mvn clean install
```

Then:

```bash
mvn spring-boot:run
```

Backend will run on:

```text
http://localhost:8080
```

---

# 💻 5. Configure Frontend

Open a new terminal.

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env
```

Add:

```env
VITE_API_URL=http://localhost:8080/api
```

---

# ▶️ 6. Run Frontend

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

# 👤 Demo User

After running the seed script, you can configure demo accounts such as:

```text
Admin
Email: admin@example.com

User
Email: user@example.com
```

For security, use a hashed password in the actual database seed and change demo credentials before production deployment.

---

# 🔄 Typical User Workflow

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Create Folder
   ↓
Upload Document
   ↓
Document Stored in S3
   ↓
Metadata Stored in MySQL
   ↓
Search Document
   ↓
Share Document
   ↓
Download Document
   ↓
Upload New Version
   ↓
Activity Logged
```

---

# 📊 Example Dashboard

```text
+----------------------------------------------------+
| CloudDocs                           Profile        |
+----------------------------------------------------+
|                                                    |
|  Total Documents     125                           |
|  Storage Used        2.4 GB                        |
|  Shared Documents    18                            |
|  Favorites           12                            |
|                                                    |
+----------------------------------------------------+
| Upload Activity                                    |
|                                                    |
|        █                                             |
|      █ █       █                                     |
|  █ █ █ █ █   █ █                                     |
|----------------------------------------------------|
|                                                    |
| Recent Documents                                   |
|                                                    |
| Resume.pdf                 2.4 MB                  |
| ProjectReport.pdf          5.1 MB                  |
| Assignment.docx            1.2 MB                  |
|                                                    |
+----------------------------------------------------+
```

---

# 🎬 GitHub Animation

You can add an animated typing header using:

```html
<p align="center">
  <img
    src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=28&pause=1000&color=36BCF7&center=true&vCenter=true&width=800&lines=CloudDocs;Cloud+Document+Management;Secure+Document+Storage;Document+Sharing+%26+Collaboration"
    alt="CloudDocs Animation"
  />
</p>
```

---

# 🖼️ Screenshots

Add your screenshots here after completing the project.

Example:

```markdown
## Dashboard

![Dashboard](docs/screenshots/dashboard.png)

## Documents

![Documents](docs/screenshots/documents.png)

## Upload

![Upload](docs/screenshots/upload.png)

## Admin Dashboard

![Admin Dashboard](docs/screenshots/admin-dashboard.png)
```

Recommended screenshot structure:

```text
docs/
└── screenshots/
    ├── login.png
    ├── register.png
    ├── dashboard.png
    ├── documents.png
    ├── upload.png
    ├── sharing.png
    ├── versions.png
    └── admin-dashboard.png
```

---

# 🧪 Testing

Backend tests can be executed using:

```bash
mvn test
```

Frontend build:

```bash
npm run build
```

Frontend preview:

```bash
npm run preview
```

---

# 🐳 Optional Docker Setup

Example backend Dockerfile:

```dockerfile
FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build:

```bash
docker build -t clouddocs-backend .
```

Run:

```bash
docker run -p 8080:8080 clouddocs-backend
```

---

# 🚀 Deployment Architecture

For cloud deployment, the architecture can be extended to:

```text
                   Internet
                      |
                      v
              ┌───────────────┐
              │ React Frontend│
              └───────┬───────┘
                      |
                      v
              ┌───────────────┐
              │ Spring Boot   │
              │ Backend       │
              └───────┬───────┘
                      |
             ┌────────┴─────────┐
             |                  |
             v                  v
       ┌───────────┐      ┌───────────┐
       │ AWS RDS   │      │ AWS S3    │
       │ MySQL     │      │ Documents │
       └───────────┘      └───────────┘
```

Optional components:

```text
AWS Lambda
AWS CloudWatch
AWS IAM
AWS CloudFront
```

Use only services you actually need and verify current AWS Free Tier/credit eligibility before deploying paid resources.

---

# 💰 AWS Cost Awareness

For a student project, keep the AWS architecture minimal.

Recommended:

```text
Amazon S3
+
Local MySQL
+
Spring Boot
```

For a more cloud-native deployment:

```text
React
+
Spring Boot
+
Amazon S3
+
Amazon RDS
```

Before deploying:

- Enable AWS billing alerts
- Create a budget
- Monitor S3 storage
- Delete unused resources
- Delete test buckets/files
- Stop or remove unused cloud resources
- Avoid unnecessary always-running services

---

# 📈 Future Improvements

Potential future features:

- AI document summarization
- OCR
- Intelligent document classification
- Duplicate document detection
- Full-text document search
- Elasticsearch/OpenSearch integration
- Document preview
- PDF text extraction
- Virus scanning
- Email notifications
- Real-time collaboration
- Comments
- Document approval workflow
- Digital signatures
- Google Drive integration
- Microsoft OneDrive integration
- Mobile application
- Advanced analytics
- AI-powered document assistant

---

# 🤖 AI Features — Future Scope

A future AI module could allow users to ask:

```text
"Summarize this document."

"Find all documents related to Java."

"What are the important points in this PDF?"

"Show me documents uploaded last month."

"Which documents are shared with my team?"
```

Possible AI architecture:

```text
Document
   ↓
Text Extraction
   ↓
Chunking
   ↓
Embedding
   ↓
Vector Database
   ↓
RAG Pipeline
   ↓
AI Assistant
```

---

# 🧠 Learning Outcomes

By developing CloudDocs, you can demonstrate knowledge of:

### Backend

- Java
- Spring Boot
- REST API development
- Spring Security
- JWT
- JPA
- Hibernate
- Exception handling
- DTO architecture
- Service layer
- Repository pattern

### Frontend

- React
- TypeScript
- Component architecture
- State management
- REST API integration
- Responsive UI
- Form validation
- Loading states
- Optimistic updates

### Database

- MySQL
- Relational database design
- Relationships
- Foreign keys
- Indexing
- CRUD operations

### Cloud

- Amazon S3
- AWS IAM
- Cloud architecture
- Object storage
- Secure file access

### Software Engineering

- Authentication
- Authorization
- API design
- Error handling
- Security
- Git
- GitHub
- Deployment

---

# 💼 Resume Description

Use the following description on your resume:

```text
CloudDocs — Cloud-Based Document Management & Collaboration Platform

Developed a full-stack document management platform using React, TypeScript, Java, Spring Boot, MySQL and Amazon S3. Implemented JWT authentication, role-based access control, document CRUD operations, folder organization, secure cloud storage, document sharing, version control, favorites, trash recovery and activity auditing. Designed RESTful APIs and a responsive SaaS dashboard with search, analytics, loading states and optimistic UI updates.
```

---

# 📌 Resume Bullet Points

```text
• Developed a full-stack cloud document management platform using React, TypeScript, Spring Boot, MySQL and Amazon S3.

• Implemented JWT authentication, password hashing, role-based authorization and backend ownership validation for secure document access.

• Built document upload, CRUD, search, folder organization, sharing, favorites, trash recovery and version management workflows.

• Integrated Amazon S3 for scalable object storage while maintaining document metadata and permissions in MySQL.

• Designed a responsive SaaS dashboard with analytics, activity tracking, loading states, empty states and optimistic UI updates.
```

---

# 📚 API Documentation

Create:

```text
docs/api-documentation.md
```

Document each endpoint using:

```text
Endpoint
HTTP Method
Authentication
Request Body
Response
Error Codes
Example
```

Example:

```http
POST /api/documents
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

---

# 🧹 .gitignore

Example:

```gitignore
# Node
node_modules/
dist/

# Environment
.env
.env.local
.env.production

# Java
target/
*.class

# IDE
.idea/
.vscode/
*.iml

# Logs
*.log

# OS
.DS_Store
Thumbs.db

# Secrets
*.pem
*.key
```

---

# 🔀 Git Workflow

Initialize repository:

```bash
git init
```

Add files:

```bash
git add .
```

Commit:

```bash
git commit -m "Initial commit - CloudDocs"
```

Add remote:

```bash
git remote add origin https://github.com/Yogendra630/CloudDocs.git
```

Rename branch:

```bash
git branch -M main
```

Push:

```bash
git push -u origin main
```

---

# 🔄 Future Git Workflow

For new features:

```bash
git checkout -b feature/document-sharing
```

After development:

```bash
git add .
git commit -m "Add document sharing"
git push origin feature/document-sharing
```

Create a Pull Request on GitHub.

---

# 🤝 Contributing

Contributions are welcome.

## Steps

```bash
git clone https://github.com/Yogendra630/CloudDocs.git
```

Create a branch:

```bash
git checkout -b feature/new-feature
```

Make your changes.

Commit:

```bash
git add .
git commit -m "Add new feature"
```

Push:

```bash
git push origin feature/new-feature
```

Then open a Pull Request.

---

# 📜 License

This project is licensed under the MIT License.

You can create a `LICENSE` file containing the MIT License text.

---

# 👨‍💻 Author

## Yogendra Maurya

Computer Science Engineering Student  
Interested in:

```text
Java
Spring Boot
React
Full Stack Development
Machine Learning
Cloud Computing
AWS
Data Structures & Algorithms
```

GitHub:

```text
https://github.com/Yogendra630
```

---

# ⭐ Support

If you find this project useful:

```text
⭐ Star the repository
🍴 Fork the project
🐛 Report issues
💡 Suggest improvements
🤝 Contribute
```

---

# 📌 Project Status

```text
🚧 Development
```

The project can be continuously improved with additional cloud, AI, collaboration and security features.

---

# 🎯 Final Project Goal

CloudDocs aims to demonstrate how a modern full-stack application can combine:

```text
Frontend
   +
Backend
   +
Database
   +
Authentication
   +
Cloud Storage
   +
Security
   +
REST APIs
   +
Modern UI
   +
Analytics
```

into a practical real-world software solution.

---

<p align="center">

<b>☁️ CloudDocs</b>

<br>

<i>Store. Organize. Share. Collaborate.</i>

<br><br>

⭐ Built with Java + Spring Boot + React + MySQL + AWS ⭐

</p>
