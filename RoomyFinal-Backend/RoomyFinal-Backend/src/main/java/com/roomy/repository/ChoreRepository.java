package com.roomy.repository;

import com.roomy.model.Chore;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class ChoreRepository {

    private final JdbcTemplate jdbc;

    public ChoreRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void addChore(Chore chore) {
        String sql = """
            INSERT INTO chores (apartment_id, created_by, title, description, is_recurring, recurrence_type, due_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """;
        jdbc.update(sql, chore.getApartmentId(), chore.getCreatedBy(), chore.getTitle(),
                chore.getDescription(), chore.isRecurring(), chore.getRecurrenceType(), chore.getDueDate());
    }

    public List<Chore> getChoresByApartment(int apartmentId) {
        String sql = "SELECT * FROM chores WHERE apartment_id = ?";
        return jdbc.query(sql, (rs, rowNum) -> {
            Chore c = new Chore();
            c.setChoreId(rs.getInt("chore_id"));
            c.setApartmentId(rs.getInt("apartment_id"));
            c.setCreatedBy(rs.getInt("created_by"));
            c.setTitle(rs.getString("title"));
            c.setDescription(rs.getString("description"));
            c.setRecurring(rs.getBoolean("is_recurring"));
            c.setRecurrenceType(rs.getString("recurrence_type"));
            c.setDueDate(rs.getDate("due_date") != null ? rs.getDate("due_date").toLocalDate() : null);
            c.setCompleted(rs.getBoolean("is_completed"));
            return c;
        }, apartmentId);
    }

    public void markChoreComplete(int choreId) {
        String sql = "UPDATE chores SET is_completed = TRUE WHERE chore_id = ?";
        jdbc.update(sql, choreId);
    }

    public void updateChore(Chore chore) {
        String sql = """
            UPDATE chores 
            SET title = ?, description = ?, is_recurring = ?, recurrence_type = ?, due_date = ?, is_completed = ?
            WHERE chore_id = ?
        """;
        jdbc.update(sql, chore.getTitle(), chore.getDescription(), chore.isRecurring(),
                chore.getRecurrenceType(), chore.getDueDate(), chore.isCompleted(), chore.getChoreId());
    }

    public void deleteChore(int choreId) {
        String sql = "DELETE FROM chores WHERE chore_id = ?";
        jdbc.update(sql, choreId);
    }
}
