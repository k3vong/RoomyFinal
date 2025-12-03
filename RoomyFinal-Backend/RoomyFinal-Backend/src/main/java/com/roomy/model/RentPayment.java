package com.roomy.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class RentPayment {
    private int rentId;
    private int apartmentId;
    private LocalDate dueDate;
    private BigDecimal totalAmount;
    private String paymentType; // SPLIT or QUEUE
    private Integer paidBy;
    private boolean isPaid;

    // Getters & Setters
    public int getRentId() { return rentId; }
    public void setRentId(int rentId) { this.rentId = rentId; }

    public int getApartmentId() { return apartmentId; }
    public void setApartmentId(int apartmentId) { this.apartmentId = apartmentId; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }

    public Integer getPaidBy() { return paidBy; }
    public void setPaidBy(Integer paidBy) { this.paidBy = paidBy; }

    public boolean getIsPaid() { return isPaid; }
    public void setIsPaid(boolean isPaid) { this.isPaid = isPaid; }
}
