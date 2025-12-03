package com.roomy.repository;

import com.roomy.model.RentPayment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class RentPaymentRepository {

    private final JdbcTemplate jdbc;

    public RentPaymentRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void addRentPayment(RentPayment rent) {
        String sql = """
            INSERT INTO rent_payments (apartment_id, due_date, total_amount, payment_type, paid_by, is_paid)
            VALUES (?, ?, ?, ?, ?, ?)
        """;
        jdbc.update(sql, rent.getApartmentId(), rent.getDueDate(),
                rent.getTotalAmount(), rent.getPaymentType(),
                rent.getPaidBy(), rent.getIsPaid());
    }

    public List<RentPayment> getPaymentsByApartment(int apartmentId) {
        String sql = "SELECT * FROM rent_payments WHERE apartment_id = ?";
        return jdbc.query(sql, (rs, rowNum) -> {
            RentPayment rent = new RentPayment();
            rent.setRentId(rs.getInt("rent_id"));
            rent.setApartmentId(rs.getInt("apartment_id"));
            rent.setDueDate(rs.getDate("due_date").toLocalDate());
            rent.setTotalAmount(rs.getBigDecimal("total_amount"));
            rent.setPaymentType(rs.getString("payment_type"));
            rent.setPaidBy((Integer) rs.getObject("paid_by"));
            rent.setIsPaid(rs.getBoolean("is_paid"));
            return rent;
        }, apartmentId);
    }

    public void markAsPaid(int rentId, int userId) {
        String sql = "UPDATE rent_payments SET is_paid = TRUE, paid_by = ? WHERE rent_id = ?";
        jdbc.update(sql, userId, rentId);
    }
}
