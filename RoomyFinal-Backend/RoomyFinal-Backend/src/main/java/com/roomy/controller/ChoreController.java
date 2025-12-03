package com.roomy.controller;

import com.roomy.model.Chore;
import com.roomy.repository.ChoreRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chores")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ChoreController {

    private final ChoreRepository repo;

    public ChoreController(ChoreRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public void addChore(@RequestBody Chore chore) {
        repo.addChore(chore);
    }

    @GetMapping("/{apartmentId}")
    public List<Chore> getChores(@PathVariable int apartmentId) {
        return repo.getChoresByApartment(apartmentId);
    }

    @PutMapping("/{choreId}")
    public void updateChore(@PathVariable int choreId, @RequestBody Chore chore) {
        chore.setChoreId(choreId);
        repo.updateChore(chore);
    }

    @PutMapping("/{choreId}/complete")
    public void completeChore(@PathVariable int choreId) {
        repo.markChoreComplete(choreId);
    }

    @DeleteMapping("/{choreId}")
    public void deleteChore(@PathVariable int choreId) {
        repo.deleteChore(choreId);
    }
}
