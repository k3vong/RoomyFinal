package com.roomy.model;

import java.time.LocalDateTime;

public class Residence {
    private int residenceId;
    private int userId;
    private int apartmentId;
    private LocalDateTime joinDate;

    // Optional (when joined with users)
    private String username;
    private String firstName;
    private String lastName;
    private String email;

    public Residence() {}

    public Residence(int residenceId, int userId, int apartmentId, LocalDateTime joinDate) {
        this.residenceId = residenceId;
        this.userId = userId;
        this.apartmentId = apartmentId;
        this.joinDate = joinDate;
    }

    //  Getters & Setters
    public int getResidenceId() {
        return residenceId;
    }

    public void setResidenceId(int residenceId) {
        this.residenceId = residenceId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getApartmentId() {
        return apartmentId;
    }

    public void setApartmentId(int apartmentId) {
        this.apartmentId = apartmentId;
    }

    public LocalDateTime getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(LocalDateTime joinDate) {
        this.joinDate = joinDate;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    @Override
    public String toString() {
        return "Residence{" +
                "residenceId=" + residenceId +
                ", userId=" + userId +
                ", apartmentId=" + apartmentId +
                ", joinDate=" + joinDate +
                ", username='" + username + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
