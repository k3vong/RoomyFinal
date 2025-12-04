package com.roomy.controller;

import com.roomy.model.StatusUpdateRequest;
import com.roomy.model.User;
import com.roomy.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("User Controller Tests")
class UserControllerTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserController userController;

    private User testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testUser = new User();
        testUser.setUserId(1);
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setEmail("test@example.com");
        testUser.setStatus("AVAILABLE");
    }

    @Test
    @DisplayName("Test 11: Get All Users - Should return list of users")
    void testGetAllUsers() {
        User user2 = new User();
        user2.setUserId(2);
        user2.setUsername("john");
        
        List<User> users = Arrays.asList(testUser, user2);
        when(userRepository.getAllUsers()).thenReturn(users);

        List<User> result = userController.getAll();

        assertEquals(2, result.size());
        assertEquals("testuser", result.get(0).getUsername());
        verify(userRepository, times(1)).getAllUsers();
    }

    @Test
    @DisplayName("Test 12: Signup - Should create new user and return without password")
    void testSignup() {
        when(userRepository.addUser(any(User.class))).thenReturn(1);

        User result = userController.signup(testUser);

        assertNotNull(result);
        assertNull(result.getPassword(), "Password should be null in response");
        verify(userRepository, times(1)).addUser(testUser);
    }

    @Test
    @DisplayName("Test 13: Login - Should authenticate user successfully")
    void testLoginSuccess() {
        when(userRepository.login("testuser", "password123")).thenReturn(testUser);

        User loginUser = new User();
        loginUser.setUsername("testuser");
        loginUser.setPassword("password123");

        User result = userController.login(loginUser);

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertNull(result.getPassword(), "Password should be cleared from response");
        verify(userRepository, times(1)).login("testuser", "password123");
    }

    @Test
    @DisplayName("Test 14: Login Failure - Should return null for invalid credentials")
    void testLoginFailure() {
        when(userRepository.login("testuser", "wrongpassword")).thenReturn(null);

        User loginUser = new User();
        loginUser.setUsername("testuser");
        loginUser.setPassword("wrongpassword");

        User result = userController.login(loginUser);

        assertNull(result, "Login should return null for invalid credentials");
        verify(userRepository, times(1)).login("testuser", "wrongpassword");
    }

    @Test
    @DisplayName("Test 15: Update Status - Should update user status correctly")
    void testUpdateStatus() {
        StatusUpdateRequest request = new StatusUpdateRequest();
        request.setStatus("BUSY");
        request.setCustomStatus("Working on project");

        doNothing().when(userRepository).updateStatus(1, "BUSY", "Working on project");

        assertDoesNotThrow(() -> {
            userController.updateStatus(1, request);
        });

        verify(userRepository, times(1)).updateStatus(1, "BUSY", "Working on project");
    }

    @Test
    @DisplayName("Test 16: Update Profile - Should update user profile successfully")
    void testUpdateProfile() {
        testUser.setBio("Updated bio");
        doNothing().when(userRepository).updateUser(testUser);

        assertDoesNotThrow(() -> {
            userController.updateProfile(1, testUser);
        });

        verify(userRepository, times(1)).updateUser(testUser);
    }
}
