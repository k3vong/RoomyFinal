package com.roomy.model;

import java.util.List;

public class CalculationRequest {
    private String operation;       // add, subtract, multiply, divide, exponent
    private List<Double> numbers;   // list of numbers to apply operation on

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public List<Double> getNumbers() {
        return numbers;
    }

    public void setNumbers(List<Double> numbers) {
        this.numbers = numbers;
    }
}
