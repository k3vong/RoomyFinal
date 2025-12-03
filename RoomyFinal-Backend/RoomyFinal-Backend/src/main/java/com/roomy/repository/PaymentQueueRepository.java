package com.roomy.repository;

import com.roomy.model.PaymentQueue;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PaymentQueueRepository {
    
    private final JdbcTemplate jdbcTemplate;

    public PaymentQueueRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Get queue for an apartment
    public List<PaymentQueue> getQueueByApartment(int apartmentId) {
        String sql = "SELECT * FROM payment_queue WHERE apartment_id = ? ORDER BY queue_position";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            PaymentQueue pq = new PaymentQueue();
            pq.setQueueId(rs.getInt("queue_id"));
            pq.setApartmentId(rs.getInt("apartment_id"));
            pq.setUserId(rs.getInt("user_id"));
            pq.setQueuePosition(rs.getInt("queue_position"));
            return pq;
        }, apartmentId);
    }

    // Add user to queue
    public void addToQueue(int apartmentId, int userId) {
        // Get the next position
        String maxPosSql = "SELECT COALESCE(MAX(queue_position), -1) + 1 FROM payment_queue WHERE apartment_id = ?";
        Integer nextPosition = jdbcTemplate.queryForObject(maxPosSql, Integer.class, apartmentId);
        
        String sql = "INSERT INTO payment_queue (apartment_id, user_id, queue_position) VALUES (?, ?, ?) " +
                     "ON CONFLICT (apartment_id, user_id) DO NOTHING";
        jdbcTemplate.update(sql, apartmentId, userId, nextPosition);
    }

    // Remove user from queue and reorder
    public void removeFromQueue(int apartmentId, int userId) {
        // Get the position being removed
        String getPosSql = "SELECT queue_position FROM payment_queue WHERE apartment_id = ? AND user_id = ?";
        List<Integer> positions = jdbcTemplate.queryForList(getPosSql, Integer.class, apartmentId, userId);
        
        if (positions.isEmpty()) return;
        
        int removedPosition = positions.get(0);
        
        // Delete the user
        String deleteSql = "DELETE FROM payment_queue WHERE apartment_id = ? AND user_id = ?";
        jdbcTemplate.update(deleteSql, apartmentId, userId);
        
        // Reorder remaining users
        String reorderSql = "UPDATE payment_queue SET queue_position = queue_position - 1 " +
                           "WHERE apartment_id = ? AND queue_position > ?";
        jdbcTemplate.update(reorderSql, apartmentId, removedPosition);
    }

    // Initialize queue with all current apartment members
    public void initializeQueue(int apartmentId, List<Integer> userIds) {
        // Clear existing queue
        String clearSql = "DELETE FROM payment_queue WHERE apartment_id = ?";
        jdbcTemplate.update(clearSql, apartmentId);
        
        // Add all users
        for (int i = 0; i < userIds.size(); i++) {
            String sql = "INSERT INTO payment_queue (apartment_id, user_id, queue_position) VALUES (?, ?, ?)";
            jdbcTemplate.update(sql, apartmentId, userIds.get(i), i);
        }
    }

    // Get current payer based on month
    public Integer getCurrentPayer(int apartmentId) {
        List<PaymentQueue> queue = getQueueByApartment(apartmentId);
        if (queue.isEmpty()) return null;
        
        // Calculate rotation based on current month/year
        java.time.LocalDate now = java.time.LocalDate.now();
        int monthsSinceEpoch = now.getYear() * 12 + now.getMonthValue();
        int currentIndex = monthsSinceEpoch % queue.size();
        
        return queue.get(currentIndex).getUserId();
    }
}
