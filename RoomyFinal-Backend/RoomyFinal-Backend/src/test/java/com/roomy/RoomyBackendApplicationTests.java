package com.roomy;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Roomy Backend Application Tests
 * 
 * This test suite includes 18 comprehensive unit tests covering:
 * - CalculatorService (Tests 1-10): Mathematical operations and edge cases
 * - UserController (Tests 11-16): User management and authentication
 * - ApartmentController (Tests 17-18): Apartment creation and retrieval
 * 
 * To run all tests:
 * mvnw test
 * 
 * To run specific test class:
 * mvnw test -Dtest=CalculatorServiceTest
 * mvnw test -Dtest=UserControllerTest
 * mvnw test -Dtest=ApartmentControllerTest
 */
@SpringBootTest
@DisplayName("Roomy Backend Application Context Tests")
class RoomyBackendApplicationTests {

	@Test
	@DisplayName("Spring Application Context - Should load successfully")
	void contextLoads() {
		// This test verifies that the Spring application context loads correctly
		// If this test passes, it means all beans are properly configured
	}

}
