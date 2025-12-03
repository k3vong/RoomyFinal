package com.roomy.repository;

import com.roomy.model.Grocery;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class GroceryRepository {

    private final JdbcTemplate jdbc;

    public GroceryRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // Add a new grocery item
    public void addGrocery(Grocery grocery) {
        String sql = """
            INSERT INTO groceries (apartment_id, added_by, name, quantity, category, is_purchased)
            VALUES (?, ?, ?, ?, ?, ?)
        """;

        jdbc.update(sql,
                grocery.getApartmentId(),
                grocery.getAddedBy(),
                grocery.getName(),
                grocery.getQuantity(),
                grocery.getCategory(),
                grocery.isPurchased()
        );
    }

    // Get all groceries for an apartment
    public List<Grocery> getGroceriesByApartment(int apartmentId) {
        String sql = "SELECT * FROM groceries WHERE apartment_id = ? ORDER BY is_purchased, created_at DESC";

        return jdbc.query(sql, (rs, rowNum) -> {
            Grocery g = new Grocery();
            g.setItemId(rs.getInt("item_id"));
            g.setApartmentId(rs.getInt("apartment_id"));
            g.setAddedBy(rs.getInt("added_by"));
            g.setName(rs.getString("name"));
            g.setQuantity(rs.getString("quantity"));
            g.setCategory(rs.getString("category"));
            g.setPurchased(rs.getBoolean("is_purchased"));

            Timestamp createdTs = rs.getTimestamp("created_at");
            if (createdTs != null) {
                g.setCreatedAt(createdTs.toLocalDateTime());
            }

            Timestamp purchasedTs = rs.getTimestamp("purchased_at");
            if (purchasedTs != null) {
                g.setPurchasedAt(purchasedTs.toLocalDateTime());
            }

            return g;
        }, apartmentId);
    }

    // Mark an item as purchased
    public void markAsPurchased(int itemId) {
        String sql = """
            UPDATE groceries
            SET is_purchased = TRUE,
                purchased_at = CURRENT_TIMESTAMP
            WHERE item_id = ?
        """;
        jdbc.update(sql, itemId);
    }

    // Delete an item
    public void deleteGrocery(int itemId) {
        String sql = "DELETE FROM groceries WHERE item_id = ?";
        jdbc.update(sql, itemId);
    }
}
