package com.roomy.model;

public class User {
    private int userId;
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String email;

    // Status 
    private String status;        // e.g. AVAILABLE, BUSY, WORKING, CLEANING, AWAY, CUSTOM
    private String customStatus;  // users can type custom text like "Studying for midterms"
    private String bio;           // User biography

    // Getters and Setters
    public int getUserId() {
        return userId;
    }
    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public String getCustomStatus() {
        return customStatus;
    }
    public void setCustomStatus(String customStatus) {
        this.customStatus = customStatus;
    }

    public String getBio() {
        return bio;
    }
    public void setBio(String bio) {
        this.bio = bio;
    }
}
