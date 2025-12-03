package com.roomy.controller;

import com.roomy.model.StatusUpdateRequest;
import com.roomy.model.User;
import com.roomy.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class UserController {

    private final UserRepository repo;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }

    // Get all users
    @GetMapping("/users")
    public List<User> getAll() {
        return repo.getAllUsers();
    }

    // Sign up a new user
    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        try {
            repo.addUser(user);
            user.setPassword(null);
            return user;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create user: " + e.getMessage());
        }
    }

    // Login existing user
    @PostMapping("/login")
    public User login(@RequestBody User user) {
        try {
            if (user.getUsername() == null || user.getPassword() == null) {
                return null;
            }
            User found = repo.login(user.getUsername(), user.getPassword());
            if (found != null) {
                found.setPassword(null);
                return found;
            }
            return null;
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    // Update user status
    @PutMapping("/users/{userId}/status")
    public void updateStatus(@PathVariable int userId,
                             @RequestBody StatusUpdateRequest statusRequest) {
        repo.updateStatus(userId,
                statusRequest.getStatus(),
                statusRequest.getCustomStatus());
    }

    // Update full user profile
    @PutMapping("/users/{userId}")
    public void updateProfile(@PathVariable int userId, @RequestBody User user) {
        user.setUserId(userId);
        repo.updateUser(user);
    }

    // Delete user account
    @DeleteMapping("/users/{userId}")
    public void deleteUser(@PathVariable int userId) {
        repo.deleteUser(userId);
    }
}
