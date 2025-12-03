package com.roomy.repository;

import com.roomy.model.Apartment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ApartmentRepository {

    private final JdbcTemplate jdbc;

    public ApartmentRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    //  Add a new apartment
    public int addApartment(Apartment apartment) {
        String sql = """
            INSERT INTO apartments (complex_name, room_number, rent_amount, rent_due_day)
            VALUES (?, ?, ?, ?)
            RETURNING apartment_id
        """;

        Integer result = jdbc.queryForObject(sql, Integer.class,
                apartment.getComplexName(),
                apartment.getRoomNumber(),
                apartment.getRentAmount(),
                apartment.getRentDueDay());
        
        if (result == null) {
            throw new RuntimeException("Failed to create apartment");
        }
        return result;
    }

    //  Get all apartments
    public List<Apartment> getAllApartments() {
        String sql = "SELECT * FROM apartments";
        return jdbc.query(sql, (rs, rowNum) -> {
            Apartment apt = new Apartment();
            apt.setApartmentId(rs.getInt("apartment_id"));
            apt.setComplexName(rs.getString("complex_name"));
            apt.setRoomNumber(rs.getString("room_number"));
            apt.setRentAmount(rs.getBigDecimal("rent_amount"));
            apt.setRentDueDay(rs.getInt("rent_due_day"));
            return apt;
        });
    }

    //  Get apartment by ID
    public Apartment getApartmentById(int id) {
        String sql = "SELECT * FROM apartments WHERE apartment_id = ?";
        List<Apartment> result = jdbc.query(sql, (rs, rowNum) -> {
            Apartment apt = new Apartment();
            apt.setApartmentId(rs.getInt("apartment_id"));
            apt.setComplexName(rs.getString("complex_name"));
            apt.setRoomNumber(rs.getString("room_number"));
            apt.setRentAmount(rs.getBigDecimal("rent_amount"));
            apt.setRentDueDay(rs.getInt("rent_due_day"));
            return apt;
        }, id);

        return result.isEmpty() ? null : result.get(0);
    }

    //  Update apartment info
    public void updateApartment(Apartment apartment) {
        String sql = """
            UPDATE apartments
            SET complex_name = ?, room_number = ?, rent_amount = ?, rent_due_day = ?
            WHERE apartment_id = ?
        """;
        jdbc.update(sql,
                apartment.getComplexName(),
                apartment.getRoomNumber(),
                apartment.getRentAmount(),
                apartment.getRentDueDay(),
                apartment.getApartmentId());
    }

    //  Delete apartment
    public void deleteApartment(int id) {
        String sql = "DELETE FROM apartments WHERE apartment_id = ?";
        jdbc.update(sql, id);
    }
}
