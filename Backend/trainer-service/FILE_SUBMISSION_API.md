# Trainer Module - File Submission & Assignment Management API

## Overview
The Trainer module now supports comprehensive file submission functionality, allowing trainers to create assignments and upload various document types (PDFs, Word documents, Excel spreadsheets, PowerPoint presentations, etc.) to assign work to students.

## Supported File Types

### Documents
- **PDF** (.pdf) - `application/pdf`
- **Word Documents**
  - DOCX (.docx) - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - DOC (.doc) - `application/msword`
- **Excel/Spreadsheets**
  - XLSX (.xlsx) - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
  - XLS (.xls) - `application/vnd.ms-excel`
- **PowerPoint**
  - PPTX (.pptx) - `application/vnd.openxmlformats-officedocument.presentationml.presentation`
  - PPT (.ppt) - `application/vnd.ms-powerpoint`
- **Text Files** (.txt) - `text/plain`

### Images
- PNG (.png) - `image/png`
- JPG/JPEG (.jpg, .jpeg) - `image/jpeg`

### Compressed Files
- ZIP (.zip) - `application/zip`
- RAR (.rar) - `application/x-rar-compressed`

### Data Files
- CSV (.csv) - `text/csv`

## Configuration

### File Upload Settings
- **Maximum File Size**: 50 MB per file
- **Maximum Request Size**: 100 MB
- **Upload Directory**: `uploads/assignments/` (configurable via `FILE_UPLOAD_DIR` environment variable)

### Environment Variables
```bash
FILE_UPLOAD_DIR=uploads/assignments  # Directory to store uploaded files
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/trainer_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password
JWT_SECRET=your-jwt-secret
```

## API Endpoints

### Assignment Management

#### 1. Create Assignment
```
POST /api/v1/trainers/{trainerId}/assignments
Content-Type: application/json

{
  "title": "Assignment Title",
  "description": "Assignment Description",
  "courseId": 1,
  "batchId": 1,
  "dueDate": "2024-12-31T23:59:59",
  "status": "DRAFT"
}

Response: 201 Created
{
  "assignmentId": 1,
  "title": "Assignment Title",
  "description": "Assignment Description",
  "courseId": 1,
  "batchId": 1,
  "status": "DRAFT",
  "dueDate": "2024-12-31T23:59:59",
  "createdAt": "2024-08-13T10:30:00",
  "updatedAt": "2024-08-13T10:30:00",
  "files": []
}
```

#### 2. Get All Trainer Assignments
```
GET /api/v1/trainers/{trainerId}/assignments

Response: 200 OK
[
  {
    "assignmentId": 1,
    "title": "Assignment 1",
    "status": "PUBLISHED",
    "files": [...]
  },
  ...
]
```

#### 3. Get Single Assignment
```
GET /api/v1/trainers/{trainerId}/assignments/{assignmentId}

Response: 200 OK
{
  "assignmentId": 1,
  "title": "Assignment Title",
  "description": "Assignment Description",
  "courseId": 1,
  "batchId": 1,
  "status": "DRAFT",
  "dueDate": "2024-12-31T23:59:59",
  "createdAt": "2024-08-13T10:30:00",
  "updatedAt": "2024-08-13T10:30:00",
  "files": [
    {
      "fileId": 1,
      "fileName": "document_1723551000000.pdf",
      "fileType": "application/pdf",
      "fileSize": 2048,
      "documentType": "PDF",
      "uploadedAt": "2024-08-13T10:30:00",
      "uploadedBy": "trainer@example.com"
    }
  ]
}
```

#### 4. Update Assignment
```
PUT /api/v1/trainers/{trainerId}/assignments/{assignmentId}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated Description",
  "dueDate": "2024-12-31T23:59:59",
  "status": "DRAFT"
}

Response: 200 OK
{...assignment details...}
```

#### 5. Publish Assignment
```
POST /api/v1/trainers/{trainerId}/assignments/{assignmentId}/publish

Response: 200 OK
{...assignment details with status: "PUBLISHED"...}

Note: Assignment must have at least one file to be published.
```

#### 6. Delete Assignment
```
DELETE /api/v1/trainers/{trainerId}/assignments/{assignmentId}

Response: 200 OK
{
  "message": "Assignment deleted successfully"
}

Note: Deletes all associated files automatically.
```

### File Upload

#### 1. Upload Single File
```
POST /api/v1/trainers/{trainerId}/assignments/{assignmentId}/files
Content-Type: multipart/form-data

Parameters:
- file: [binary file]

Response: 201 Created
{
  "fileId": 1,
  "fileName": "document_1723551000000.pdf",
  "fileType": "application/pdf",
  "fileSize": 2048,
  "documentType": "PDF",
  "uploadedAt": "2024-08-13T10:30:00",
  "uploadedBy": "trainer@example.com"
}
```

#### 2. Upload Multiple Files
```
POST /api/v1/trainers/{trainerId}/assignments/{assignmentId}/upload-multiple
Content-Type: multipart/form-data

Parameters:
- files: [binary file 1]
- files: [binary file 2]
- files: [binary file 3]

Response: 201 Created
[
  {...file 1 details...},
  {...file 2 details...},
  {...file 3 details...}
]
```

#### 3. Delete File
```
DELETE /api/v1/trainers/{trainerId}/assignments/{assignmentId}/files/{fileId}

Response: 200 OK
{
  "message": "File deleted successfully"
}
```

### Course & Batch Assignments

#### 1. Get Course Assignments
```
GET /api/v1/trainers/courses/{courseId}/assignments

Response: 200 OK
[
  {...assignment 1...},
  {...assignment 2...}
]
```

#### 2. Get Batch Assignments
```
GET /api/v1/trainers/batches/{batchId}/assignments

Response: 200 OK
[
  {...assignment 1...},
  {...assignment 2...}
]
```

## Database Schema

### assignments table
```sql
CREATE TABLE assignments (
  assignment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
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
  file_id BIGINT PRIMARY KEY AUTO_INCREMENT,
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

## Error Handling

### Common Error Responses

**400 Bad Request** - Invalid Input
```json
{
  "error": "Invalid Input",
  "message": "Title is required"
}
```

**400 Bad Request** - File Validation Failed
```json
{
  "error": "Invalid Input",
  "message": "File type .exe is not allowed"
}
```

**413 Payload Too Large** - File Size Exceeded
```json
{
  "error": "File Size Exceeded",
  "message": "Maximum file size is 50MB"
}
```

**404 Not Found** - Assignment Not Found
```json
{
  "error": "Server Error",
  "message": "Assignment not found or unauthorized"
}
```

**500 Internal Server Error** - General Error
```json
{
  "error": "Unexpected Error",
  "message": "File upload failed: IOException details"
}
```

## File Storage

Files are stored in the following directory structure:
```
uploads/assignments/
├── {assignmentId}/
│   ├── document_1723551000000.pdf
│   ├── spreadsheet_1723551001000.xlsx
│   └── presentation_1723551002000.pptx
```

Filenames are automatically prefixed with timestamps to prevent conflicts.

## Usage Examples

### cURL Examples

**Create Assignment**
```bash
curl -X POST http://localhost:8082/api/v1/trainers/1/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Java Basics Assignment",
    "description": "Learn Java fundamentals",
    "courseId": 1,
    "batchId": 1,
    "dueDate": "2024-12-31T23:59:59",
    "status": "DRAFT"
  }'
```

**Upload Single File**
```bash
curl -X POST http://localhost:8082/api/v1/trainers/1/assignments/1/files \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@assignment.pdf"
```

**Upload Multiple Files**
```bash
curl -X POST http://localhost:8082/api/v1/trainers/1/assignments/1/upload-multiple \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@document1.pdf" \
  -F "files=@document2.docx" \
  -F "files=@document3.xlsx"
```

**Publish Assignment**
```bash
curl -X POST http://localhost:8082/api/v1/trainers/1/assignments/1/publish \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Java Client Example

```java
RestTemplate restTemplate = new RestTemplate();

// Create assignment
AssignmentRequest request = new AssignmentRequest(
    "Assignment Title",
    "Description",
    1L,
    1L,
    LocalDateTime.now().plusDays(7)
);

ResponseEntity<AssignmentResponse> response = restTemplate.postForEntity(
    "http://localhost:8082/api/v1/trainers/1/assignments",
    request,
    AssignmentResponse.class
);

AssignmentResponse assignment = response.getBody();

// Upload file
MultipartFile file = new MockMultipartFile(
    "file",
    "test.pdf",
    "application/pdf",
    fileBytes
);

// Make request with file
HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.MULTIPART_FORM_DATA);
// ... upload file
```

## Security Considerations

1. **Authentication**: All endpoints (except /registertrainer) require JWT authentication
2. **Authorization**: Trainers can only manage their own assignments
3. **File Validation**: All files are validated for type and size before upload
4. **Path Traversal Prevention**: File paths are validated and sanitized
5. **MIME Type Validation**: Files are validated against MIME type restrictions

## Performance Tips

1. Batch multiple file uploads using the `/upload-multiple` endpoint
2. Use appropriate file formats (PDF for documents, XLSX for spreadsheets)
3. Compress large files before uploading
4. Archive multiple files into ZIP format when uploading many files

## Future Enhancements

- File preview functionality
- Student submission tracking
- Grading integration
- Plagiarism detection
- File versioning
- Bulk assignment creation
- Template library for common assignments
