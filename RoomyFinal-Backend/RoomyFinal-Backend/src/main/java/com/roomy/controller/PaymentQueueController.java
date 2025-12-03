package com.roomy.controller;

import com.roomy.model.PaymentQueue;
import com.roomy.repository.PaymentQueueRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment-queue")
@CrossOrigin(origins = "*")
public class PaymentQueueController {
    
    private final PaymentQueueRepository paymentQueueRepository;

    public PaymentQueueController(PaymentQueueRepository paymentQueueRepository) {
        this.paymentQueueRepository = paymentQueueRepository;
    }

    @GetMapping("/{apartmentId}")
    public ResponseEntity<List<PaymentQueue>> getQueue(@PathVariable int apartmentId) {
        return ResponseEntity.ok(paymentQueueRepository.getQueueByApartment(apartmentId));
    }

    @PostMapping("/initialize")
    public ResponseEntity<String> initializeQueue(@RequestBody Map<String, Object> request) {
        int apartmentId = (int) request.get("apartmentId");
        @SuppressWarnings("unchecked")
        List<Integer> userIds = (List<Integer>) request.get("userIds");
        paymentQueueRepository.initializeQueue(apartmentId, userIds);
        return ResponseEntity.ok("Queue initialized");
    }

    @PostMapping("/add")
    public ResponseEntity<String> addToQueue(@RequestBody Map<String, Integer> request) {
        paymentQueueRepository.addToQueue(request.get("apartmentId"), request.get("userId"));
        return ResponseEntity.ok("User added to queue");
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromQueue(@RequestParam int apartmentId, @RequestParam int userId) {
        paymentQueueRepository.removeFromQueue(apartmentId, userId);
        return ResponseEntity.ok("User removed from queue");
    }

    @GetMapping("/{apartmentId}/current-payer")
    public ResponseEntity<Map<String, Integer>> getCurrentPayer(@PathVariable int apartmentId) {
        Integer payerId = paymentQueueRepository.getCurrentPayer(apartmentId);
        Map<String, Integer> response = new HashMap<>();
        response.put("userId", payerId);
        return ResponseEntity.ok(response);
    }
}
