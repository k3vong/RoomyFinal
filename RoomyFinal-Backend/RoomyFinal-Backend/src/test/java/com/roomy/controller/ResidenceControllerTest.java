package com.roomy.controller;

import com.roomy.model.Residence;
import com.roomy.repository.ResidenceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("Residence Controller Tests")
class ResidenceControllerTest {

    @Mock
    private ResidenceRepository residenceRepository;

    @InjectMocks
    private ResidenceController residenceController;

    private Residence testResidence;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testResidence = new Residence();
        testResidence.setResidenceId(1);
        testResidence.setUserId(1);
        testResidence.setApartmentId(1);
        testResidence.setJoinDate(LocalDateTime.now());
        testResidence.setUsername("testuser");
        testResidence.setFirstName("Test");
        testResidence.setLastName("User");
        testResidence.setEmail("test@example.com");
    }

    @Test
    @DisplayName("Test 28: Join Apartment - Should link user to apartment")
    void testJoinApartment() {
        doNothing().when(residenceRepository).addResidence(1, 1);

        assertDoesNotThrow(() -> {
            residenceController.joinApartment(1, 1);
        });

        verify(residenceRepository, times(1)).addResidence(1, 1);
    }

    @Test
    @DisplayName("Test 29: Get Residents by Apartment - Should return list of residents")
    void testGetResidentsByApartment() {
        Residence residence2 = new Residence();
        residence2.setResidenceId(2);
        residence2.setUsername("john");
        
        List<Residence> residents = Arrays.asList(testResidence, residence2);
        when(residenceRepository.getResidentsByApartment(1)).thenReturn(residents);

        List<Residence> result = residenceController.getResidents(1);

        assertEquals(2, result.size());
        assertEquals("testuser", result.get(0).getUsername());
        verify(residenceRepository, times(1)).getResidentsByApartment(1);
    }

    @Test
    @DisplayName("Test 30: Get User Apartment - Should return apartment ID")
    void testGetUserApartment() {
        when(residenceRepository.getApartmentByUser(1)).thenReturn(1);

        Integer result = residenceController.getUserApartment(1);

        assertEquals(1, result);
        verify(residenceRepository, times(1)).getApartmentByUser(1);
    }

    @Test
    @DisplayName("Test 31: Leave Apartment - Should unlink user from apartment")
    void testLeaveApartment() {
        doNothing().when(residenceRepository).removeResidence(1);

        assertDoesNotThrow(() -> {
            residenceController.leaveApartment(1);
        });

        verify(residenceRepository, times(1)).removeResidence(1);
    }
}
