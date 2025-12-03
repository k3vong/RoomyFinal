package com.roomy.model;

import java.time.LocalDate;

public class Chore {
    private int choreId;
    private int apartmentId;
    private int createdBy;
    private String title;
    private String description;
    private boolean isRecurring;
    private String recurrenceType;
    private LocalDate dueDate;
    private boolean isCompleted;

    // Getters & Setters
    public int getChoreId() { return choreId; }
    public void setChoreId(int choreId) { this.choreId = choreId; }

    public int getApartmentId() { return apartmentId; }
    public void setApartmentId(int apartmentId) { this.apartmentId = apartmentId; }

    public int getCreatedBy() { return createdBy; }
    public void setCreatedBy(int createdBy) { this.createdBy = createdBy; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isRecurring() { return isRecurring; }
    public void setRecurring(boolean recurring) { isRecurring = recurring; }

    public String getRecurrenceType() { return recurrenceType; }
    public void setRecurrenceType(String recurrenceType) { this.recurrenceType = recurrenceType; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public boolean isCompleted() { return isCompleted; }
    public void setCompleted(boolean completed) { isCompleted = completed; }
}
