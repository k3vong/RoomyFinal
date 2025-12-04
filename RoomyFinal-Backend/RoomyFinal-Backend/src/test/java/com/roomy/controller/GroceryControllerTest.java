package com.roomy.controller;

import com.roomy.model.Grocery;
import com.roomy.repository.GroceryRepository;
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

@DisplayName("Grocery Controller Tests")
class GroceryControllerTest {

    @Mock
    private GroceryRepository groceryRepository;

    @InjectMocks
    private GroceryController groceryController;

    private Grocery testGrocery;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testGrocery = new Grocery();
        testGrocery.setItemId(1);
        testGrocery.setApartmentId(1);
        testGrocery.setAddedBy(1);
        testGrocery.setName("Milk");
        testGrocery.setQuantity("1 gallon");
        testGrocery.setCategory("Dairy");
        testGrocery.setPurchased(false);
        testGrocery.setCreatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("Test 24: Add Grocery - Should create new grocery item")
    void testAddGrocery() {
        doNothing().when(groceryRepository).addGrocery(any(Grocery.class));

        assertDoesNotThrow(() -> {
            groceryController.addGrocery(testGrocery);
        });

        verify(groceryRepository, times(1)).addGrocery(testGrocery);
    }

    @Test
    @DisplayName("Test 25: Get Groceries by Apartment - Should return list of groceries")
    void testGetGroceriesByApartment() {
        Grocery grocery2 = new Grocery();
        grocery2.setItemId(2);
        grocery2.setName("Eggs");
        
        List<Grocery> groceries = Arrays.asList(testGrocery, grocery2);
        when(groceryRepository.getGroceriesByApartment(1)).thenReturn(groceries);

        List<Grocery> result = groceryController.getGroceries(1);

        assertEquals(2, result.size());
        assertEquals("Milk", result.get(0).getName());
        verify(groceryRepository, times(1)).getGroceriesByApartment(1);
    }

    @Test
    @DisplayName("Test 26: Mark Grocery as Purchased - Should update purchase status")
    void testMarkGroceryPurchased() {
        doNothing().when(groceryRepository).markAsPurchased(1);

        assertDoesNotThrow(() -> {
            groceryController.markPurchased(1);
        });

        verify(groceryRepository, times(1)).markAsPurchased(1);
    }

    @Test
    @DisplayName("Test 27: Delete Grocery - Should remove grocery item")
    void testDeleteGrocery() {
        doNothing().when(groceryRepository).deleteGrocery(1);

        assertDoesNotThrow(() -> {
            groceryController.deleteGrocery(1);
        });

        verify(groceryRepository, times(1)).deleteGrocery(1);
    }
}
