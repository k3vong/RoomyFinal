package com.roomy.model;

import java.math.BigDecimal;

public class Apartment {
    private int apartmentId;
    private String complexName;
    private String roomNumber;
    private BigDecimal rentAmount;
    private int rentDueDay;
    private Integer createdBy;

    public Apartment() {}

    public Apartment(int apartmentId, String complexName, String roomNumber, BigDecimal rentAmount, int rentDueDay) {
        this.apartmentId = apartmentId;
        this.complexName = complexName;
        this.roomNumber = roomNumber;
        this.rentAmount = rentAmount;
        this.rentDueDay = rentDueDay;
    }

    public Apartment(int apartmentId, String complexName, String roomNumber, BigDecimal rentAmount, int rentDueDay, Integer createdBy) {
        this.apartmentId = apartmentId;
        this.complexName = complexName;
        this.roomNumber = roomNumber;
        this.rentAmount = rentAmount;
        this.rentDueDay = rentDueDay;
        this.createdBy = createdBy;
    }

    public int getApartmentId() {
        return apartmentId;
    }

    public void setApartmentId(int apartmentId) {
        this.apartmentId = apartmentId;
    }

    public String getComplexName() {
        return complexName;
    }

    public void setComplexName(String complexName) {
        this.complexName = complexName;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public BigDecimal getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(BigDecimal rentAmount) {
        this.rentAmount = rentAmount;
    }

    public int getRentDueDay() {
        return rentDueDay;
    }

    public void setRentDueDay(int rentDueDay) {
        this.rentDueDay = rentDueDay;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }

    @Override
    public String toString() {
        return "Apartment{" +
                "apartmentId=" + apartmentId +
                ", complexName='" + complexName + '\'' +
                ", roomNumber='" + roomNumber + '\'' +
                ", rentAmount=" + rentAmount +
                ", rentDueDay=" + rentDueDay +
                ", createdBy=" + createdBy +
                '}';
    }
}
