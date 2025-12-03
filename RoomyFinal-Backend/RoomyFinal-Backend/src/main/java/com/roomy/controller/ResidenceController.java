package com.roomy.controller;

import com.roomy.model.Residence;
import com.roomy.repository.ResidenceRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/residence")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ResidenceController {

    private final ResidenceRepository repo;

    public ResidenceController(ResidenceRepository repo) {
        this.repo = repo;
    }

    // Add a user to an apartment
    @PostMapping("/join")
    public void joinApartment(@RequestParam int userId, @RequestParam int apartmentId) {
        repo.addResidence(userId, apartmentId);
    }

    // View all residents of an apartment
    @GetMapping("/{apartmentId}")
    public List<Residence> getResidents(@PathVariable int apartmentId) {
        return repo.getResidentsByApartment(apartmentId);
    }

    // Get the apartment of a specific user
    @GetMapping("/user/{userId}")
    public Integer getUserApartment(@PathVariable int userId) {
        return repo.getApartmentByUser(userId);
    }

    // Leave apartment
    @DeleteMapping("/leave/{userId}")
    public void leaveApartment(@PathVariable int userId) {
        repo.removeResidence(userId);
    }
}
