package com.roomy.model;

import java.time.LocalDateTime;

public class Grocery {
    private int itemId;
    private int apartmentId;
    private int addedBy;
    private String name;
    private String quantity;
    private String category;
    private boolean isPurchased;
    private LocalDateTime createdAt;
    private LocalDateTime purchasedAt;

    public Grocery() {}

    // Getters & Setters

    public int getItemId() {
        return itemId;
    }

    public void setItemId(int itemId) {
        this.itemId = itemId;
    }

    public int getApartmentId() {
        return apartmentId;
    }

    public void setApartmentId(int apartmentId) {
        this.apartmentId = apartmentId;
    }

    public int getAddedBy() {
        return addedBy;
    }

    public void setAddedBy(int addedBy) {
        this.addedBy = addedBy;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isPurchased() {
        return isPurchased;
    }

    public void setPurchased(boolean purchased) {
        isPurchased = purchased;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getPurchasedAt() {
        return purchasedAt;
    }

    public void setPurchasedAt(LocalDateTime purchasedAt) {
        this.purchasedAt = purchasedAt;
    }

    @Override
    public String toString() {
        return "Grocery{" +
                "itemId=" + itemId +
                ", apartmentId=" + apartmentId +
                ", addedBy=" + addedBy +
                ", name='" + name + '\'' +
                ", quantity='" + quantity + '\'' +
                ", category='" + category + '\'' +
                ", isPurchased=" + isPurchased +
                ", createdAt=" + createdAt +
                ", purchasedAt=" + purchasedAt +
                '}';
    }
}
