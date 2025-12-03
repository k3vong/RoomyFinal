package com.roomy.controller;

import com.roomy.model.Grocery;
import com.roomy.repository.GroceryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groceries")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class GroceryController {

    private final GroceryRepository repo;

    public GroceryController(GroceryRepository repo) {
        this.repo = repo;
    }

    // Add new grocery item
    @PostMapping
    public void addGrocery(@RequestBody Grocery grocery) {
        repo.addGrocery(grocery);
    }

    // Get all groceries for an apartment
    @GetMapping("/{apartmentId}")
    public List<Grocery> getGroceries(@PathVariable int apartmentId) {
        return repo.getGroceriesByApartment(apartmentId);
    }

    // Mark item as purchased
    @PutMapping("/{itemId}/purchase")
    public void markPurchased(@PathVariable int itemId) {
        repo.markAsPurchased(itemId);
    }

    // Delete item
    @DeleteMapping("/{itemId}")
    public void deleteGrocery(@PathVariable int itemId) {
        repo.deleteGrocery(itemId);
    }
}
