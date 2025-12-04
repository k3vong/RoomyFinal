package com.roomy.controller;

import com.roomy.model.Chore;
import com.roomy.repository.ChoreRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("Chore Controller Tests")
class ChoreControllerTest {

    @Mock
    private ChoreRepository choreRepository;

    @InjectMocks
    private ChoreController choreController;

    private Chore testChore;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testChore = new Chore();
        testChore.setChoreId(1);
        testChore.setApartmentId(1);
        testChore.setCreatedBy(1);
        testChore.setTitle("Take out trash");
        testChore.setDescription("Take trash to dumpster");
        testChore.setRecurring(true);
        testChore.setRecurrenceType("DAILY");
        testChore.setDueDate(LocalDate.now());
        testChore.setCompleted(false);
    }

    @Test
    @DisplayName("Test 19: Add Chore - Should create new chore")
    void testAddChore() {
        doNothing().when(choreRepository).addChore(any(Chore.class));

        assertDoesNotThrow(() -> {
            choreController.addChore(testChore);
        });

        verify(choreRepository, times(1)).addChore(testChore);
    }

    @Test
    @DisplayName("Test 20: Get Chores by Apartment - Should return list of chores")
    void testGetChoresByApartment() {
        Chore chore2 = new Chore();
        chore2.setChoreId(2);
        chore2.setTitle("Clean kitchen");
        
        List<Chore> chores = Arrays.asList(testChore, chore2);
        when(choreRepository.getChoresByApartment(1)).thenReturn(chores);

        List<Chore> result = choreController.getChores(1);

        assertEquals(2, result.size());
        assertEquals("Take out trash", result.get(0).getTitle());
        verify(choreRepository, times(1)).getChoresByApartment(1);
    }

    @Test
    @DisplayName("Test 21: Update Chore - Should update chore details")
    void testUpdateChore() {
        testChore.setTitle("Updated title");
        doNothing().when(choreRepository).updateChore(testChore);

        assertDoesNotThrow(() -> {
            choreController.updateChore(1, testChore);
        });

        assertEquals(1, testChore.getChoreId());
        verify(choreRepository, times(1)).updateChore(testChore);
    }

    @Test
    @DisplayName("Test 22: Complete Chore - Should mark chore as complete")
    void testCompleteChore() {
        doNothing().when(choreRepository).markChoreComplete(1);

        assertDoesNotThrow(() -> {
            choreController.completeChore(1);
        });

        verify(choreRepository, times(1)).markChoreComplete(1);
    }

    @Test
    @DisplayName("Test 23: Delete Chore - Should remove chore")
    void testDeleteChore() {
        doNothing().when(choreRepository).deleteChore(1);

        assertDoesNotThrow(() -> {
            choreController.deleteChore(1);
        });

        verify(choreRepository, times(1)).deleteChore(1);
    }
}
