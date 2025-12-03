package com.roomy.controller;

import com.roomy.model.RentPayment;
import com.roomy.repository.RentPaymentRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rent")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class RentPaymentController {

    private final RentPaymentRepository repo;

    public RentPaymentController(RentPaymentRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public void addRent(@RequestBody RentPayment rent) {
        repo.addRentPayment(rent);
    }

    @GetMapping("/{apartmentId}")
    public List<RentPayment> getPayments(@PathVariable int apartmentId) {
        return repo.getPaymentsByApartment(apartmentId);
    }

    @PutMapping("/{rentId}/pay")
    public void payRent(@PathVariable int rentId, @RequestParam int userId) {
        repo.markAsPaid(rentId, userId);
    }
}
