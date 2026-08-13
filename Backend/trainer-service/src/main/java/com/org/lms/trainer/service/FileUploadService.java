package com.org.lms.trainer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class FileUploadService {

    @Value("${app.file.upload-dir:uploads/assignments}")
    private String uploadDir;

    // Allowed document types with their MIME types
    private static final Map<String, Set<String>> ALLOWED_FILE_TYPES = new HashMap<>();

    static {
        // PDF
        ALLOWED_FILE_TYPES.put("PDF", new HashSet<>(Collections.singletonList("application/pdf")));

        // Word Documents
        ALLOWED_FILE_TYPES.put("DOCX", new HashSet<>(Arrays.asList(
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-word.document.macroEnabled.12"
        )));

        ALLOWED_FILE_TYPES.put("DOC", new HashSet<>(Arrays.asList(
                "application/msword",
                "application/vnd.ms-word.document.macroEnabled.12"
        )));

        // Excel/Spreadsheets
        ALLOWED_FILE_TYPES.put("XLSX", new HashSet<>(Collections.singletonList(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )));

        ALLOWED_FILE_TYPES.put("XLS", new HashSet<>(Arrays.asList(
                "application/vnd.ms-excel",
                "application/x-xls"
        )));

        // PowerPoint
        ALLOWED_FILE_TYPES.put("PPTX", new HashSet<>(Collections.singletonList(
                "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        )));

        ALLOWED_FILE_TYPES.put("PPT", new HashSet<>(Collections.singletonList(
                "application/vnd.ms-powerpoint"
        )));

        // Text Files
        ALLOWED_FILE_TYPES.put("TXT", new HashSet<>(Collections.singletonList("text/plain")));

        // Images
        ALLOWED_FILE_TYPES.put("PNG", new HashSet<>(Collections.singletonList("image/png")));
        ALLOWED_FILE_TYPES.put("JPG", new HashSet<>(Arrays.asList("image/jpeg", "image/jpg")));
        ALLOWED_FILE_TYPES.put("JPEG", new HashSet<>(Collections.singletonList("image/jpeg")));

        // Compressed Files
        ALLOWED_FILE_TYPES.put("ZIP", new HashSet<>(Arrays.asList(
                "application/zip",
                "application/x-zip-compressed"
        )));

        ALLOWED_FILE_TYPES.put("RAR", new HashSet<>(Collections.singletonList("application/x-rar-compressed")));

        // CSV
        ALLOWED_FILE_TYPES.put("CSV", new HashSet<>(Arrays.asList(
                "text/csv",
                "application/csv"
        )));
    }

    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

    /**
     * Validates if the file is allowed for upload
     * @param file MultipartFile to validate
     * @return FileValidationResult with validation status and details
     */
    public FileValidationResult validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return new FileValidationResult(false, "File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            return new FileValidationResult(false, "File size exceeds maximum limit of 50 MB");
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isEmpty()) {
            return new FileValidationResult(false, "File name is invalid");
        }

        String fileExtension = getFileExtension(originalFileName).toUpperCase();
        if (fileExtension.isEmpty()) {
            return new FileValidationResult(false, "File has no extension");
        }

        if (!ALLOWED_FILE_TYPES.containsKey(fileExtension)) {
            return new FileValidationResult(false, "File type ." + fileExtension + " is not allowed");
        }

        String mimeType = file.getContentType();
        if (mimeType != null && !ALLOWED_FILE_TYPES.get(fileExtension).contains(mimeType)) {
            return new FileValidationResult(false, "File MIME type does not match the extension");
        }

        return new FileValidationResult(true, "File is valid");
    }

    /**
     * Uploads a file to the file system
     * @param file MultipartFile to upload
     * @param assignmentId ID of the assignment
     * @return FileUploadResult with file path and metadata
     * @throws IOException if file upload fails
     */
    public FileUploadResult uploadFile(MultipartFile file, Long assignmentId) throws IOException {
        FileValidationResult validation = validateFile(file);
        if (!validation.isValid()) {
            throw new IllegalArgumentException("File validation failed: " + validation.getMessage());
        }

        String originalFileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        String uniqueFileName = generateUniqueFileName(originalFileName);

        // Create directory structure: uploads/assignments/{assignmentId}/
        Path uploadPath = Paths.get(uploadDir, String.valueOf(assignmentId));
        Files.createDirectories(uploadPath);

        // Save file
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.write(filePath, file.getBytes());

        return new FileUploadResult(
                uniqueFileName,
                file.getContentType(),
                file.getSize(),
                filePath.toString(),
                fileExtension.toUpperCase(),
                true,
                "File uploaded successfully"
        );
    }

    /**
     * Deletes a file from the file system
     * @param filePath Path of the file to delete
     * @return true if deletion was successful, false otherwise
     */
    public boolean deleteFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            if (Files.exists(path)) {
                Files.delete(path);
                return true;
            }
            return false;
        } catch (IOException e) {
            return false;
        }
    }

    /**
     * Gets the file extension from filename
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty() || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    /**
     * Generates a unique file name with timestamp
     */
    private String generateUniqueFileName(String originalFileName) {
        String timestamp = System.currentTimeMillis() + "";
        String fileExtension = getFileExtension(originalFileName);
        String fileNameWithoutExtension = originalFileName.substring(0, originalFileName.lastIndexOf("."));
        return fileNameWithoutExtension + "_" + timestamp + "." + fileExtension;
    }

    /**
     * Gets all allowed file types
     */
    public Set<String> getAllowedFileTypes() {
        return ALLOWED_FILE_TYPES.keySet();
    }

    /**
     * Gets maximum file size in bytes
     */
    public long getMaxFileSize() {
        return MAX_FILE_SIZE;
    }

    // Helper classes for file upload results
    public static class FileValidationResult {
        private final boolean valid;
        private final String message;

        public FileValidationResult(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }

        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
    }

    public static class FileUploadResult {
        private final String fileName;
        private final String fileType;
        private final long fileSize;
        private final String filePath;
        private final String documentType;
        private final boolean success;
        private final String message;

        public FileUploadResult(String fileName, String fileType, long fileSize, String filePath,
                              String documentType, boolean success, String message) {
            this.fileName = fileName;
            this.fileType = fileType;
            this.fileSize = fileSize;
            this.filePath = filePath;
            this.documentType = documentType;
            this.success = success;
            this.message = message;
        }

        // Getters
        public String getFileName() { return fileName; }
        public String getFileType() { return fileType; }
        public long getFileSize() { return fileSize; }
        public String getFilePath() { return filePath; }
        public String getDocumentType() { return documentType; }
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
    }
}
