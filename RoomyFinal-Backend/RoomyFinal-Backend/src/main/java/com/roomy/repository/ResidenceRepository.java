package com.roomy.repository;

import com.roomy.model.Residence;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class ResidenceRepository {

    private final JdbcTemplate jdbc;

    public ResidenceRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // Connect user ↔ apartment
    public void addResidence(int userId, int apartmentId) {
        String sql = "INSERT INTO residence (user_id, apartment_id) VALUES (?, ?)";
        jdbc.update(sql, userId, apartmentId);
    }

    // Get all users in a specific apartment
    public List<Residence> getResidentsByApartment(int apartmentId) {
        String sql = """
            SELECT r.residence_id, r.user_id, r.apartment_id, r.join_date,
                   u.username, u.first_name, u.last_name, u.email
            FROM residence r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.apartment_id = ?
        """;
        return jdbc.query(sql, (rs, rowNum) -> {
            Residence res = new Residence();
            res.setResidenceId(rs.getInt("residence_id"));
            res.setUserId(rs.getInt("user_id"));
            res.setApartmentId(rs.getInt("apartment_id"));
            res.setJoinDate(rs.getTimestamp("join_date").toLocalDateTime());
            res.setUsername(rs.getString("username"));
            res.setFirstName(rs.getString("first_name"));
            res.setLastName(rs.getString("last_name"));
            res.setEmail(rs.getString("email"));
            return res;
        }, apartmentId);
    }

    // Get which apartment a user belongs to
    public Integer getApartmentByUser(int userId) {
        String sql = "SELECT apartment_id FROM residence WHERE user_id = ?";
        List<Integer> result = jdbc.query(sql, (rs, rowNum) -> rs.getInt("apartment_id"), userId);
        return result.isEmpty() ? null : result.get(0);
    }
}
