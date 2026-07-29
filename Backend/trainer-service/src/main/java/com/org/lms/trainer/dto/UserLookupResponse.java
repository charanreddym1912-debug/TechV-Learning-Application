package com.org.lms.trainer.dto;

public class UserLookupResponse {

    private String email;
    private String passwordHash;
    private String role;

    public UserLookupResponse() {}

    public UserLookupResponse(String email, String passwordHash, String role) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
