package com.org.lms.auth.dto;

/**
 * Mirrors the UserLookupResponse shape returned by each of the internal
 * lookup endpoints (student-service, trainer-service, coordinator-service).
 * Field names must match exactly for Jackson to deserialize correctly.
 */
public class UserLookupResponse {

    private String email;
    private String passwordHash;
    private String role;

    public UserLookupResponse() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
