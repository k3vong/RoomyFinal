package com.roomy.controller;

import com.roomy.model.Apartment;
import com.roomy.repository.ApartmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("Apartment Controller Tests")
class ApartmentControllerTest {

    @Mock
    private ApartmentRepository apartmentRepository;

    @InjectMocks
    private ApartmentController apartmentController;

    private Apartment testApartment;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testApartment = new Apartment();
        testApartment.setApartmentId(1);
        testApartment.setComplexName("Sunset Apartments");
        testApartment.setRoomNumber("101");
        testApartment.setRentAmount(new BigDecimal("2000.00"));
        testApartment.setRentDueDay(1);
        testApartment.setPaymentType("SPLIT");
        testApartment.setCreatedBy(1);
    }

    @Test
    @DisplayName("Test 17: Create Apartment - Should create and return apartment ID")
    void testCreateApartment() {
        when(apartmentRepository.addApartment(any(Apartment.class))).thenReturn(1);

        int result = apartmentController.createApartment(testApartment);

        assertEquals(1, result);
        verify(apartmentRepository, times(1)).addApartment(testApartment);
    }

    @Test
    @DisplayName("Test 18: Get All Apartments - Should return list of apartments")
    void testGetAllApartments() {
        Apartment apartment2 = new Apartment();
        apartment2.setApartmentId(2);
        apartment2.setComplexName("Downtown Lofts");
        apartment2.setRoomNumber("305");
        apartment2.setRentAmount(new BigDecimal("2500.00"));
        apartment2.setRentDueDay(5);
        apartment2.setPaymentType("QUEUE");

        List<Apartment> apartments = Arrays.asList(testApartment, apartment2);
        when(apartmentRepository.getAllApartments()).thenReturn(apartments);

        List<Apartment> result = apartmentController.getAllApartments();

        assertEquals(2, result.size());
        assertEquals("Sunset Apartments", result.get(0).getComplexName());
        assertEquals("Downtown Lofts", result.get(1).getComplexName());
        verify(apartmentRepository, times(1)).getAllApartments();
    }
}
