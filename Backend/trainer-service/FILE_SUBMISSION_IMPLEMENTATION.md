# File Submission Feature - Implementation Summary

## Overview
The trainer module now includes comprehensive file submission functionality for assigning work to students. Trainers can create assignments and upload various document types (PDFs, Word documents, Excel spreadsheets, PowerPoint presentations, etc.).

## What Was Implemented

### 1. Entity Classes
- **Assignment.java** - Represents an assignment with metadata (title, description, due date, status)
- **AssignmentFile.java** - Represents uploaded files associated with assignments

### 2. Data Access Layer
- **AssignmentRepository.java** - JPA repository for Assignment entity with custom queries
- **AssignmentFileRepository.java** - JPA repository for AssignmentFile entity

### 3. Data Transfer Objects (DTOs)
- **AssignmentRequest.java** - DTO for creating/updating assignments
- **AssignmentResponse.java** - DTO for returning assignment details with files
- **FileResponse.java** - DTO for returning file metadata

### 4. Service Layer
- **FileUploadService.java** - Handles file uploads with validation and storage
  - Supports 15+ document types (PDF, DOCX, DOC, XLSX, XLS, PPTX, PPT, TXT, PNG, JPG, JPEG, ZIP, RAR, CSV)
  - Validates file types and MIME types
  - Limits file size to 50MB per file
  - Generates unique filenames with timestamps to prevent conflicts
  
- **AssignmentService.java** - Business logic for assignment management
  - Create, read, update, delete assignments
  - Upload single and multiple files
  - Publish assignments (makes them visible to students)
  - Get assignments by trainer, course, or batch

### 5. REST API Controller
- **TrainerController.java** (Updated) - Added 13 new endpoints for:
  - Assignment management (create, read, update, delete, publish)
  - File upload (single and bulk upload)
  - File deletion
  - Querying by course and batch

### 6. Configuration
- **GlobalExceptionHandler.java** - Centralized exception handling for:
  - File size exceeded errors
  - Invalid input validation
  - Runtime errors
  - Generic exceptions
  
- **application.yml** (Updated) - Added configuration for:
  - Multipart file upload (max 50MB per file, 100MB per request)
  - File upload directory (configurable via environment variable)

### 7. Database Schema
- Created migration SQL script with:
  - `assignments` table with status tracking (DRAFT, PUBLISHED, CLOSED)
  - `assignment_files` table with file metadata and cascade delete

### 8. Documentation
- **FILE_SUBMISSION_API.md** - Complete API documentation with:
  - Supported file types
  - Configuration details
  - All endpoint specifications
  - Request/response examples
  - cURL examples
  - Error handling
  - Security considerations

## Supported File Types

| Category | Types | Formats |
|----------|-------|---------|
| Documents | PDF | .pdf |
| Word | DOCX, DOC | .docx, .doc |
| Spreadsheets | XLSX, XLS | .xlsx, .xls |
| Presentations | PPTX, PPT | .pptx, .ppt |
| Text | TXT | .txt |
| Images | PNG, JPG, JPEG | .png, .jpg, .jpeg |
| Compressed | ZIP, RAR | .zip, .rar |
| Data | CSV | .csv |

## Key Features

### File Validation
- ✅ File type validation based on extension and MIME type
- ✅ File size validation (max 50MB)
- ✅ Automatic filename sanitization
- ✅ Unique timestamp-based filenames

### Assignment Management
- ✅ Create assignments with title, description, due date
- ✅ Draft status for editing before publishing
- ✅ Published status visible to students
- ✅ Closed status for finished assignments
- ✅ Automatic timestamp tracking (createdAt, updatedAt)

### File Operations
- ✅ Single file upload
- ✅ Bulk file upload (multiple files)
- ✅ File deletion
- ✅ Automatic file system cleanup on assignment deletion

### Query Capabilities
- ✅ Get assignments by trainer
- ✅ Get assignments by course
- ✅ Get assignments by batch
- ✅ Get assignment with all associated files

## API Endpoints

### Assignment Management
- `POST /api/v1/trainers/{trainerId}/assignments` - Create assignment
- `GET /api/v1/trainers/{trainerId}/assignments` - Get all trainer's assignments
- `GET /api/v1/trainers/{trainerId}/assignments/{assignmentId}` - Get specific assignment
- `PUT /api/v1/trainers/{trainerId}/assignments/{assignmentId}` - Update assignment
- `POST /api/v1/trainers/{trainerId}/assignments/{assignmentId}/publish` - Publish assignment
- `DELETE /api/v1/trainers/{trainerId}/assignments/{assignmentId}` - Delete assignment

### File Operations
- `POST /api/v1/trainers/{trainerId}/assignments/{assignmentId}/files` - Upload single file
- `POST /api/v1/trainers/{trainerId}/assignments/{assignmentId}/upload-multiple` - Upload multiple files
- `DELETE /api/v1/trainers/{trainerId}/assignments/{assignmentId}/files/{fileId}` - Delete file

### Query Endpoints
- `GET /api/v1/trainers/courses/{courseId}/assignments` - Get course assignments
- `GET /api/v1/trainers/batches/{batchId}/assignments` - Get batch assignments

## Configuration

### Environment Variables
```bash
# File upload directory (default: uploads/assignments)
FILE_UPLOAD_DIR=uploads/assignments

# Database configuration (already existing)
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/trainer_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password
JWT_SECRET=your-jwt-secret
```

### Application Properties
File upload settings in `application.yml`:
```yaml
spring:
  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 100MB
      enabled: true

app:
  file:
    upload-dir: ${FILE_UPLOAD_DIR:uploads/assignments}
```

## File Storage Structure

```
uploads/assignments/
├── 1/
│   ├── assignment1_1723551000000.pdf
│   ├── assignment1_1723551001000.docx
│   └── assignment1_1723551002000.xlsx
├── 2/
│   ├── assignment2_1723551003000.pdf
│   └── assignment2_1723551004000.pptx
└── 3/
    └── assignment3_1723551005000.txt
```

## Database Schema

### assignments table
```sql
CREATE TABLE assignments (
  assignment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  trainer_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  batch_id BIGINT NOT NULL,
  status ENUM('DRAFT', 'PUBLISHED', 'CLOSED') DEFAULT 'DRAFT',
  due_date DATETIME NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);
```

### assignment_files table
```sql
CREATE TABLE assignment_files (
  file_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  assignment_id BIGINT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  document_type VARCHAR(50),
  uploaded_at DATETIME NOT NULL,
  uploaded_by VARCHAR(255) NOT NULL,
  FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE
);
```

## Security Features

1. **Authentication** - JWT token validation on all endpoints
2. **Authorization** - Trainers can only manage their own assignments
3. **File Type Validation** - Whitelist-based file type validation
4. **MIME Type Validation** - Validates MIME types against file extensions
5. **File Size Limits** - Prevents oversized file uploads
6. **Path Traversal Prevention** - Safe file path handling

## Error Handling

The implementation includes comprehensive error handling:

- **400 Bad Request** - Invalid input, file validation failures
- **413 Payload Too Large** - File size exceeded
- **404 Not Found** - Assignment or file not found
- **500 Internal Server Error** - Server-side errors

All errors return consistent JSON response format with error code and message.

## Performance Considerations

- ✅ Lazy loading for assignment files (N+1 query optimization)
- ✅ Indexed database columns for faster queries
- ✅ Timestamp-based unique filenames (O(1) collision prevention)
- ✅ Bulk upload endpoint for efficient multi-file uploads
- ✅ Direct file system storage (faster than database blob storage)

## Integration Steps

### 1. Database Migration
Run the migration script:
```sql
-- Execute src/main/resources/db/migration/V1_0_1__Add_File_Submission_Schema.sql
```

### 2. Environment Configuration
Set environment variables:
```bash
export FILE_UPLOAD_DIR=/var/app/uploads/assignments
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/trainer_db
export SPRING_DATASOURCE_USERNAME=root
export SPRING_DATASOURCE_PASSWORD=password
```

### 3. Create Upload Directory
```bash
mkdir -p uploads/assignments
chmod 755 uploads/assignments
```

### 4. Restart Service
```bash
mvn spring-boot:run
# or
java -jar trainer-service-1.0.0.jar
```

## Testing the Feature

### Create Assignment
```bash
curl -X POST http://localhost:8082/api/v1/trainers/1/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Math Assignment",
    "description": "Solve all problems",
    "courseId": 1,
    "batchId": 1,
    "dueDate": "2024-12-31T23:59:59",
    "status": "DRAFT"
  }'
```

### Upload File
```bash
curl -X POST http://localhost:8082/api/v1/trainers/1/assignments/1/files \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test.pdf"
```

### Upload Multiple Files
```bash
curl -X POST http://localhost:8082/api/v1/trainers/1/assignments/1/upload-multiple \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@doc1.pdf" \
  -F "files=@doc2.docx" \
  -F "files=@doc3.xlsx"
```

### Publish Assignment
```bash
curl -X POST http://localhost:8082/api/v1/trainers/1/assignments/1/publish \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Future Enhancement Ideas

1. **File Preview** - Display file previews in the frontend
2. **Student Submissions** - Track student submissions and grades
3. **Plagiarism Detection** - Integrate plagiarism detection tools
4. **File Versioning** - Keep track of file versions
5. **Bulk Assignment** - Create multiple assignments from templates
6. **Notifications** - Send notifications to students about new assignments
7. **Deadline Reminders** - Automated reminders for upcoming deadlines
8. **Analytics** - Track assignment submission statistics

## Files Modified/Created

### Created Files
- `Assignment.java` - Entity
- `AssignmentFile.java` - Entity
- `AssignmentRepository.java` - Repository
- `AssignmentFileRepository.java` - Repository
- `AssignmentRequest.java` - DTO
- `AssignmentResponse.java` - DTO
- `FileResponse.java` - DTO
- `FileUploadService.java` - Service
- `AssignmentService.java` - Service
- `GlobalExceptionHandler.java` - Configuration
- `FILE_SUBMISSION_API.md` - Documentation
- `V1_0_1__Add_File_Submission_Schema.sql` - Migration

### Modified Files
- `TrainerController.java` - Added 13 new endpoints
- `application.yml` - Added multipart and file configuration

## Support & Maintenance

For questions or issues with the file submission feature:
1. Check the `FILE_SUBMISSION_API.md` documentation
2. Review error messages and HTTP status codes
3. Verify file types are in the supported list
4. Check file sizes are within limits
5. Ensure upload directory has write permissions

## Version Information
- Spring Boot: 3.4.2
- Spring Cloud: 2024.0.0
- Java: 17
- Database: MySQL

---

**Implementation Date**: August 13, 2024
**Version**: 1.0.0
