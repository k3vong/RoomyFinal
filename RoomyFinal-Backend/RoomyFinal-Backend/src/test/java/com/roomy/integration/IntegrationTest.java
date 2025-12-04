package com.roomy.integration;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@DisplayName("Integration Tests")
class IntegrationTest {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    @DisplayName("Test 38: Application Context - All beans should load")
    void testApplicationContextLoads() {
        assertNotNull(applicationContext);
        assertTrue(applicationContext.getBeanDefinitionCount() > 0);
    }

    @Test
    @DisplayName("Test 39: User Controller Bean - Should be present")
    void testUserControllerBeanExists() {
        assertTrue(applicationContext.containsBean("userController"));
    }

    @Test
    @DisplayName("Test 40: Apartment Controller Bean - Should be present")
    void testApartmentControllerBeanExists() {
        assertTrue(applicationContext.containsBean("apartmentController"));
    }

    @Test
    @DisplayName("Test 41: Chore Controller Bean - Should be present")
    void testChoreControllerBeanExists() {
        assertTrue(applicationContext.containsBean("choreController"));
    }

    @Test
    @DisplayName("Test 42: Grocery Controller Bean - Should be present")
    void testGroceryControllerBeanExists() {
        assertTrue(applicationContext.containsBean("groceryController"));
    }

    @Test
    @DisplayName("Test 43: Calculator Service Bean - Should be present")
    void testCalculatorServiceBeanExists() {
        assertTrue(applicationContext.containsBean("calculatorService"));
    }

    @Test
    @DisplayName("Test 44: User Repository Bean - Should be present")
    void testUserRepositoryBeanExists() {
        assertTrue(applicationContext.containsBean("userRepository"));
    }
}
