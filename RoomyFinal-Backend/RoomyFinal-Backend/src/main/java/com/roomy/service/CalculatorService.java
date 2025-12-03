package com.roomy.service;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CalculatorService {

    public double calculate(String operation, List<Double> numbers) {

        if (numbers == null || numbers.isEmpty()) {
            throw new IllegalArgumentException("Number list cannot be empty");
        }

        return switch (operation.toLowerCase()) {
            case "add" -> add(numbers);
            case "subtract" -> subtract(numbers);
            case "multiply" -> multiply(numbers);
            case "divide" -> divide(numbers);
            case "exponent" -> exponent(numbers);
            default -> throw new IllegalArgumentException("Unknown operation: " + operation);
        };
    }

    private double add(List<Double> nums) {
        return nums.stream().mapToDouble(Double::doubleValue).sum();
    }

    private double subtract(List<Double> nums) {
        double result = nums.get(0);
        for (int i = 1; i < nums.size(); i++) {
            result -= nums.get(i);
        }
        return result;
    }

    private double multiply(List<Double> nums) {
        double result = 1;
        for (double n : nums) result *= n;
        return result;
    }

    private double divide(List<Double> nums) {
        double result = nums.get(0);
        for (int i = 1; i < nums.size(); i++) {
            if (nums.get(i) == 0) {
                throw new ArithmeticException("Division by zero is not allowed");
            }
            result /= nums.get(i);
        }
        return result;
    }

    private double exponent(List<Double> nums) {
        double result = nums.get(0);
        for (int i = 1; i < nums.size(); i++) {
            result = Math.pow(result, nums.get(i));
        }
        return result;
    }
}
