package com.roomy.controller;

import com.roomy.model.CalculationRequest;
import com.roomy.service.CalculatorService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calculator")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class CalculatorController {

    private final CalculatorService service;

    public CalculatorController(CalculatorService service) {
        this.service = service;
    }

    @PostMapping
    public double calculate(@RequestBody CalculationRequest request) {
        return service.calculate(request.getOperation(), request.getNumbers());
    }
}
