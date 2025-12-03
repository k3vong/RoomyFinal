package com.roomy.model;

public class StatusUpdateRequest {

    private String status;        // AVAILABLE, BUSY, WORKING, CLEANING, AWAY, CUSTOM
    private String customStatus;  // optional text

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
}
