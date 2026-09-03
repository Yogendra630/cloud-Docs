export interface SpringBootSourceFile {
  filePath: string;
  category: 'Controller' | 'Service' | 'Security' | 'Entity' | 'Repository' | 'Config' | 'Database' | 'DevOps';
  description: string;
  code: string;
}

export const springBootSources: SpringBootSourceFile[] = [
  {
    filePath: "src/main/java/com/clouddocs/config/SecurityConfig.java",
    category: "Security",
    description: "Spring Security 6 configuration with stateless JWT filter chain, CORS policy, and role-based endpoint protection.",
    code: `package com.clouddocs.config;

import com.clouddocs.security.JwtAuthenticationFilter;
import com.clouddocs.security.JwtEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final JwtEntryPoint unauthorizedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/health", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}`
  },
  {
    filePath: "src/main/java/com/clouddocs/controller/DocumentController.java",
    category: "Controller",
    description: "REST Controller exposing endpoints for Document CRUD, version uploads, pre-signed download tokens, and sharing.",
    code: `package com.clouddocs.controller;

import com.clouddocs.dto.ApiResponse;
import com.clouddocs.dto.DocumentDto;
import com.clouddocs.dto.ShareRequest;
import com.clouddocs.entity.Document;
import com.clouddocs.entity.DocumentVersion;
import com.clouddocs.security.UserPrincipal;
import com.clouddocs.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentDto>>> listDocuments(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam(required = false) String folderId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false, defaultValue = "false") boolean favorite,
            @RequestParam(required = false, defaultValue = "false") boolean trash,
            @RequestParam(required = false, defaultValue = "false") boolean shared,
            @RequestParam(required = false, defaultValue = "date_desc") String sort,
            @RequestParam(required = false) String search) {
        
        List<DocumentDto> docs = documentService.getUserDocuments(user.getId(), user.getRole(), folderId, type, favorite, trash, shared, sort, search);
        return ResponseEntity.ok(ApiResponse.success(docs));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<DocumentDto>> uploadDocument(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "folderId", required = false) String folderId,
            @RequestParam(value = "description", required = false) String description) {

        DocumentDto uploaded = documentService.uploadDocument(user.getId(), file, name, folderId, description);
        return ResponseEntity.ok(ApiResponse.success("Document uploaded to AWS S3 successfully", uploaded));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DocumentDto>> getDocument(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String id) {
        DocumentDto doc = documentService.getDocumentDetails(id, user.getId(), user.getRole());
        return ResponseEntity.ok(ApiResponse.success(doc));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DocumentDto>> updateDocument(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String id,
            @RequestBody DocumentDto updateDto) {
        DocumentDto updated = documentService.updateDocumentMetadata(id, user.getId(), user.getRole(), updateDto);
        return ResponseEntity.ok(ApiResponse.success("Document updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> moveToTrash(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String id) {
        documentService.moveToTrash(id, user.getId(), user.getRole());
        return ResponseEntity.ok(ApiResponse.success("Document moved to trash", null));
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<Void>> restoreFromTrash(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String id) {
        documentService.restoreFromTrash(id, user.getId(), user.getRole());
        return ResponseEntity.ok(ApiResponse.success("Document restored", null));
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<ApiResponse<Void>> permanentDelete(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String id) {
        documentService.permanentDelete(id, user.getId(), user.getRole());
        return ResponseEntity.ok(ApiResponse.success("Document permanently removed from S3 and database", null));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String id,
            @RequestParam(required = false) Integer version) {
        return documentService.downloadFile(id, user.getId(), user.getRole(), version);
    }

    @PostMapping(value = "/{id}/upload-version", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<DocumentVersion>> uploadNewVersion(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String id,
            @RequestParam("file") MultipartFile file,
            @RequestParam("changeSummary") String changeSummary) {
        DocumentVersion version = documentService.uploadNewVersion(id, user.getId(), user.getRole(), file, changeSummary);
        return ResponseEntity.ok(ApiResponse.success("New version v" + version.getVersionNumber() + ".0 stored in S3", version));
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<ApiResponse<Void>> shareDocument(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String id,
            @RequestBody ShareRequest shareRequest) {
        documentService.shareDocument(id, user.getId(), shareRequest.getEmail(), shareRequest.getPermission());
        return ResponseEntity.ok(ApiResponse.success("Document shared successfully", null));
    }
}`
  },
  {
    filePath: "src/main/java/com/clouddocs/service/S3StorageService.java",
    category: "Service",
    description: "AWS SDK v2 Amazon S3 client service managing byte streams, SHA-256 validation, and Pre-Signed URL generation.",
    code: `package com.clouddocs.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.HexFormat;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3StorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("\${aws.s3.bucket-name}")
    private String bucketName;

    /**
     * Uploads file to private S3 bucket with server-side encryption (SSE-S3).
     */
    public String uploadFile(String s3Key, MultipartFile file) throws IOException {
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Key)
                .contentType(file.getContentType())
                .serverSideEncryption(ServerSideEncryption.AES256)
                .build();

        s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        log.info("Successfully uploaded object to s3://{}/{}", bucketName, s3Key);
        return s3Key;
    }

    /**
     * Generates a secure, temporary Pre-Signed URL valid for 15 minutes.
     */
    public String generatePresignedDownloadUrl(String s3Key, String originalFileName) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Key)
                .responseContentDisposition("attachment; filename=\\"" + originalFileName + "\\"")
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15))
                .getObjectRequest(getObjectRequest)
                .build();

        PresignedGetObjectRequest presigned = s3Presigner.presignGetObject(presignRequest);
        return presigned.url().toString();
    }

    /**
     * Deletes object permanently from S3.
     */
    public void deleteFile(String s3Key) {
        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Key)
                .build();
        s3Client.deleteObject(deleteRequest);
        log.info("Deleted object from s3://{}/{}", bucketName, s3Key);
    }

    /**
     * Computes cryptographic SHA-256 checksum for audit & tampering detection.
     */
    public String calculateSha256(MultipartFile file) {
        try (InputStream is = file.getInputStream()) {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] buffer = new byte[8192];
            int read;
            while ((read = is.read(buffer)) > 0) {
                digest.update(buffer, 0, read);
            }
            return HexFormat.of().formatHex(digest.digest());
        } catch (Exception e) {
            log.error("Failed to compute SHA-256 checksum", e);
            return "unknown_checksum";
        }
    }
}`
  },
  {
    filePath: "src/main/java/com/clouddocs/entity/Document.java",
    category: "Entity",
    description: "JPA Entity mapped to MySQL documents table with relational foreign keys, soft delete flags, and cascade bindings.",
    code: `package com.clouddocs.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "documents", indexes = {
    @Index(name = "idx_doc_owner_trash", columnList = "owner_id, is_trash"),
    @Index(name = "idx_doc_folder", columnList = "folder_id"),
    @Index(name = "idx_doc_file_type", columnList = "file_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(name = "original_file_name", nullable = false)
    private String originalFileName;

    @Column(name = "file_type", length = 20, nullable = false)
    private String fileType;

    @Column(name = "mime_type", length = 100, nullable = false)
    private String mimeType;

    @Column(name = "file_size_bytes", nullable = false)
    private Long fileSizeBytes;

    @Column(name = "s3_key", length = 500, nullable = false)
    private String s3Key;

    @Column(name = "s3_bucket", length = 100, nullable = false)
    private String s3Bucket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    private Folder folder;

    @Column(name = "current_version", nullable = false)
    private Integer currentVersion = 1;

    @Column(name = "is_favorite", nullable = false)
    private Boolean isFavorite = false;

    @Column(name = "is_trash", nullable = false)
    private Boolean isTrash = false;

    @Column(name = "trash_at")
    private LocalDateTime trashAt;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DocumentVersion> versions = new ArrayList<>();

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DocumentShare> shares = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}`
  },
  {
    filePath: "src/main/resources/schema.sql",
    category: "Database",
    description: "MySQL DDL Schema with constraints, composite indexes, foreign keys, and audit log tables.",
    code: `-- CloudDocs MySQL Production Relational Schema
-- Supports multi-tenancy, RBAC, AWS S3 metadata, folder trees, and version control

CREATE DATABASE IF NOT EXISTS clouddocs_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clouddocs_db;

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    avatar_url VARCHAR(500),
    storage_quota_bytes BIGINT UNSIGNED NOT NULL DEFAULT 5368709120, -- 5 GB
    storage_used_bytes BIGINT UNSIGNED NOT NULL DEFAULT 0,
    department VARCHAR(100),
    title VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Folders hierarchy table
CREATE TABLE IF NOT EXISTS folders (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id VARCHAR(36) NULL,
    owner_id VARCHAR(36) NOT NULL,
    color VARCHAR(20) DEFAULT '#3B82F6',
    path VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_folder_parent FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE,
    CONSTRAINT fk_folder_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_folder_owner (owner_id),
    INDEX idx_folder_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Documents metadata table (S3 pointer + properties)
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
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    is_trash BOOLEAN NOT NULL DEFAULT FALSE,
    trash_at TIMESTAMP NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_doc_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_doc_folder FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL,
    INDEX idx_doc_owner_trash (owner_id, is_trash),
    INDEX idx_doc_folder (folder_id),
    INDEX idx_doc_type (file_type),
    INDEX idx_doc_favorite (owner_id, is_favorite)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Document Version Control table
CREATE TABLE IF NOT EXISTS document_versions (
    id VARCHAR(36) PRIMARY KEY,
    document_id VARCHAR(36) NOT NULL,
    version_number INT NOT NULL,
    version_label VARCHAR(20) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    s3_bucket VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT UNSIGNED NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    checksum_sha256 VARCHAR(64) NOT NULL,
    uploaded_by VARCHAR(36) NOT NULL,
    change_summary VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ver_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    CONSTRAINT fk_ver_user FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_doc_version (document_id, version_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Document Sharing & Collaboration table (RBAC)
CREATE TABLE IF NOT EXISTS document_shares (
    id VARCHAR(36) PRIMARY KEY,
    document_id VARCHAR(36) NOT NULL,
    shared_with_user_id VARCHAR(36) NOT NULL,
    shared_by_user_id VARCHAR(36) NOT NULL,
    permission ENUM('VIEWER', 'EDITOR') NOT NULL DEFAULT 'VIEWER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_share_doc FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    CONSTRAINT fk_share_user FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_doc_user_share (document_id, shared_with_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Audit Logs table (Compliance & Tamper-evidence)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,
    resource_id VARCHAR(36) NULL,
    resource_name VARCHAR(255) NULL,
    resource_type VARCHAR(20) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_timestamp (timestamp),
    INDEX idx_audit_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
  },
  {
    filePath: "src/main/resources/application.yml",
    category: "Config",
    description: "Spring Boot configuration for MySQL datasource, JPA Hibernate tuning, AWS S3 credentials, and multipart limits.",
    code: `server:
  port: 8080
  servlet:
    context-path: /

spring:
  application:
    name: clouddocs-backend

  datasource:
    url: \${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/clouddocs_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true}
    username: \${SPRING_DATASOURCE_USERNAME:root}
    password: \${SPRING_DATASOURCE_PASSWORD:}
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      idle-timeout: 300000
      max-lifetime: 1800000

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQLDialect

  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 50MB

# AWS S3 Cloud Storage Configuration
aws:
  region: \${AWS_REGION:us-east-1}
  s3:
    bucket-name: \${AWS_S3_BUCKET_NAME:clouddocs-storage-production}
  credentials:
    access-key: \${AWS_ACCESS_KEY_ID:}
    secret-key: \${AWS_SECRET_ACCESS_KEY:}

# Security & JWT Configuration
jwt:
  secret: \${JWT_SECRET:clouddocs-super-secret-production-key-2026}
  expiration-ms: 604800000 # 7 days`
  },
  {
    filePath: "docker-compose.yml",
    category: "DevOps",
    description: "Multi-container local & cloud deployment specification for Spring Boot, MySQL 8, and S3-compatible localstack.",
    code: `version: '3.8'

services:
  # MySQL Relational Database
  mysql-db:
    image: mysql:8.0
    container_name: clouddocs-mysql
    restart: always
    environment:
      MYSQL_DATABASE: clouddocs_db
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_USER: clouddocs_user
      MYSQL_PASSWORD: userpassword
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./src/main/resources/schema.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - clouddocs-net

  # Spring Boot REST API
  backend-api:
    build: .
    container_name: clouddocs-backend
    restart: always
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql-db:3306/clouddocs_db?useSSL=false&allowPublicKeyRetrieval=true
      SPRING_DATASOURCE_USERNAME: clouddocs_user
      SPRING_DATASOURCE_PASSWORD: userpassword
      AWS_REGION: us-east-1
      AWS_S3_BUCKET_NAME: clouddocs-storage-production
    depends_on:
      - mysql-db
    networks:
      - clouddocs-net

volumes:
  mysql_data:

networks:
  clouddocs-net:
    driver: bridge`
  }
];
