package com.roomy.repository;

import com.roomy.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbc;

    public UserRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // Get all users from our database
    public List<User> getAllUsers() {
        String sql = "SELECT * FROM users";
        return jdbc.query(sql, (rs, rowNum) -> {
            User u = new User();
            u.setUserId(rs.getInt("user_id"));
            u.setUsername(rs.getString("username"));
            u.setFirstName(rs.getString("first_name"));
            u.setLastName(rs.getString("last_name"));
            u.setEmail(rs.getString("email"));
            u.setStatus(rs.getString("status"));
            u.setCustomStatus(rs.getString("custom_status"));
            u.setBio(rs.getString("bio"));
            return u;
        });
    }

    // Add new user (signup)
    public int addUser(User user) {
        String sql = """
            INSERT INTO users (username, password, first_name, last_name, email)
            VALUES (?, ?, ?, ?, ?)
            RETURNING user_id
        """;
        // status & custom_status use defaults / can be updated later
        Integer userId = jdbc.queryForObject(sql, Integer.class,
                user.getUsername(),
                user.getPassword(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail());
        
        if (userId != null) {
            user.setUserId(userId);
        }
        return userId != null ? userId : 0;
    }

    // Login (check credentials)
    public User login(String username, String password) {
        String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
        List<User> users = jdbc.query(sql, (rs, rowNum) -> {
            User u = new User();
            u.setUserId(rs.getInt("user_id"));
            u.setUsername(rs.getString("username"));
            u.setFirstName(rs.getString("first_name"));
            u.setLastName(rs.getString("last_name"));
            u.setEmail(rs.getString("email"));
            u.setStatus(rs.getString("status"));
            u.setCustomStatus(rs.getString("custom_status"));
            u.setBio(rs.getString("bio"));
            return u;
        }, username, password);

        return users.isEmpty() ? null : users.get(0);
    }

    // Update user status
    public void updateStatus(int userId, String status, String customStatus) {
        String sql = "UPDATE users SET status = ?, custom_status = ? WHERE user_id = ?";
        jdbc.update(sql, status, customStatus, userId);
    }

    // Update full user profile
    public void updateUser(User user) {
        String sql = """
            UPDATE users 
            SET first_name = ?, last_name = ?, username = ?, email = ?, 
                status = ?, custom_status = ?, bio = ?
            WHERE user_id = ?
        """;
        jdbc.update(sql, 
            user.getFirstName(), 
            user.getLastName(), 
            user.getUsername(), 
            user.getEmail(),
            user.getStatus(),
            user.getCustomStatus(),
            user.getBio(),
            user.getUserId()
        );
    }

    // Delete user account
    public void deleteUser(int userId) {
        // First delete from residence table
        String deleteResidence = "DELETE FROM residence WHERE user_id = ?";
        jdbc.update(deleteResidence, userId);
        
        // Then delete user
        String deleteUser = "DELETE FROM users WHERE user_id = ?";
        jdbc.update(deleteUser, userId);
    }
}
