package com.roomy.controller;

import com.roomy.model.Apartment;
import com.roomy.repository.ApartmentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apartments")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ApartmentController {

    private final ApartmentRepository repo;

    public ApartmentController(ApartmentRepository repo) {
        this.repo = repo;
    }

    //  Create new apartment
    @PostMapping
    public int createApartment(@RequestBody Apartment apartment) {
        return repo.addApartment(apartment);
    }

    //  Get all apartments
    @GetMapping
    public List<Apartment> getAllApartments() {
        return repo.getAllApartments();
    }

    //  Get specific apartment
    @GetMapping("/{id}")
    public Apartment getApartmentById(@PathVariable int id) {
        return repo.getApartmentById(id);
    }

    //  Update apartment info
    @PutMapping("/{id}")
    public void updateApartment(@PathVariable int id, @RequestBody Apartment apartment) {
        apartment.setApartmentId(id);
        repo.updateApartment(apartment);
    }

    //  Delete apartment
    @DeleteMapping("/{id}")
    public void deleteApartment(@PathVariable int id) {
        repo.deleteApartment(id);
    }
}
