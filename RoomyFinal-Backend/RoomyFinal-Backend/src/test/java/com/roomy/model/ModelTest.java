package com.roomy.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Model Tests - User and Apartment")
class ModelTest {

    private User testUser;
    private Apartment testApartment;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testApartment = new Apartment();
    }

    @Test
    @DisplayName("Test 32: User Model - Should set and get all properties")
    void testUserModel() {
        testUser.setUserId(1);
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setEmail("test@example.com");
        testUser.setStatus("AVAILABLE");
        testUser.setCustomStatus("Studying");
        testUser.setBio("Test bio");

        assertEquals(1, testUser.getUserId());
        assertEquals("testuser", testUser.getUsername());
        assertEquals("password123", testUser.getPassword());
        assertEquals("Test", testUser.getFirstName());
        assertEquals("User", testUser.getLastName());
        assertEquals("test@example.com", testUser.getEmail());
        assertEquals("AVAILABLE", testUser.getStatus());
        assertEquals("Studying", testUser.getCustomStatus());
        assertEquals("Test bio", testUser.getBio());
    }

    @Test
    @DisplayName("Test 33: Apartment Model - Should set and get all properties")
    void testApartmentModel() {
        testApartment.setApartmentId(1);
        testApartment.setComplexName("Sunset Apartments");
        testApartment.setRoomNumber("101");
        testApartment.setRentAmount(new BigDecimal("2000.00"));
        testApartment.setRentDueDay(1);
        testApartment.setPaymentType("SPLIT");
        testApartment.setCreatedBy(1);

        assertEquals(1, testApartment.getApartmentId());
        assertEquals("Sunset Apartments", testApartment.getComplexName());
        assertEquals("101", testApartment.getRoomNumber());
        assertEquals(new BigDecimal("2000.00"), testApartment.getRentAmount());
        assertEquals(1, testApartment.getRentDueDay());
        assertEquals("SPLIT", testApartment.getPaymentType());
        assertEquals(1, testApartment.getCreatedBy());
    }
}
