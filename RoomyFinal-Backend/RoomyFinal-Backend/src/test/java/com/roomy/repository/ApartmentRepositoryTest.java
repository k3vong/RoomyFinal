package com.roomy.repository;

import com.roomy.model.Apartment;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@DisplayName("Apartment Repository Tests")
class ApartmentRepositoryTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    private ApartmentRepository apartmentRepository;
    private Apartment testApartment;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        apartmentRepository = new ApartmentRepository(jdbcTemplate);
        
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
    @DisplayName("Test 34: Add Apartment - Should insert and return ID")
    void testAddApartment() {
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), 
            any(), any(), any(), any(), any(), any())).thenReturn(1);

        int result = apartmentRepository.addApartment(testApartment);

        assertEquals(1, result);
        verify(jdbcTemplate, times(1)).queryForObject(anyString(), eq(Integer.class),
            eq("Sunset Apartments"), eq("101"), any(BigDecimal.class), eq(1), eq("SPLIT"), eq(1));
    }

    @Test
    @DisplayName("Test 35: Get All Apartments - Should return list")
    void testGetAllApartments() {
        List<Apartment> apartments = Arrays.asList(testApartment);
        when(jdbcTemplate.query(anyString(), any(RowMapper.class))).thenReturn(apartments);

        List<Apartment> result = apartmentRepository.getAllApartments();

        assertEquals(1, result.size());
        verify(jdbcTemplate, times(1)).query(anyString(), any(RowMapper.class));
    }

    @Test
    @DisplayName("Test 36: Get Apartment by ID - Should return single apartment")
    void testGetApartmentById() {
        List<Apartment> apartments = Arrays.asList(testApartment);
        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq(1))).thenReturn(apartments);

        Apartment result = apartmentRepository.getApartmentById(1);

        assertNotNull(result);
        assertEquals("Sunset Apartments", result.getComplexName());
        verify(jdbcTemplate, times(1)).query(anyString(), any(RowMapper.class), eq(1));
    }

    @Test
    @DisplayName("Test 37: Update Apartment - Should update existing apartment")
    void testUpdateApartment() {
        when(jdbcTemplate.update(anyString(), any(), any(), any(), any(), any(), any())).thenReturn(1);

        assertDoesNotThrow(() -> {
            apartmentRepository.updateApartment(testApartment);
        });

        verify(jdbcTemplate, times(1)).update(anyString(), 
            eq("Sunset Apartments"), eq("101"), any(BigDecimal.class), eq(1), eq("SPLIT"), eq(1));
    }
}
