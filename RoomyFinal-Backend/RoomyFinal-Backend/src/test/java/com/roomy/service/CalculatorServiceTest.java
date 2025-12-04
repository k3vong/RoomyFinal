package com.roomy.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Calculator Service Tests")
class CalculatorServiceTest {

    private CalculatorService calculatorService;

    @BeforeEach
    void setUp() {
        calculatorService = new CalculatorService();
    }

    @Test
    @DisplayName("Test 1: Addition - Should add multiple numbers correctly")
    void testAddition() {
        List<Double> numbers = Arrays.asList(10.0, 20.0, 30.0);
        double result = calculatorService.calculate("add", numbers);
        assertEquals(60.0, result, 0.001);
    }

    @Test
    @DisplayName("Test 2: Subtraction - Should subtract numbers in sequence")
    void testSubtraction() {
        List<Double> numbers = Arrays.asList(100.0, 30.0, 20.0);
        double result = calculatorService.calculate("subtract", numbers);
        assertEquals(50.0, result, 0.001);
    }

    @Test
    @DisplayName("Test 3: Multiplication - Should multiply numbers correctly")
    void testMultiplication() {
        List<Double> numbers = Arrays.asList(5.0, 4.0, 2.0);
        double result = calculatorService.calculate("multiply", numbers);
        assertEquals(40.0, result, 0.001);
    }

    @Test
    @DisplayName("Test 4: Division - Should divide numbers correctly")
    void testDivision() {
        List<Double> numbers = Arrays.asList(100.0, 5.0, 2.0);
        double result = calculatorService.calculate("divide", numbers);
        assertEquals(10.0, result, 0.001);
    }

    @Test
    @DisplayName("Test 5: Exponent - Should calculate power correctly")
    void testExponent() {
        List<Double> numbers = Arrays.asList(2.0, 3.0);
        double result = calculatorService.calculate("exponent", numbers);
        assertEquals(8.0, result, 0.001);
    }

    @Test
    @DisplayName("Test 6: Division by Zero - Should throw ArithmeticException")
    void testDivisionByZero() {
        List<Double> numbers = Arrays.asList(10.0, 0.0);
        assertThrows(ArithmeticException.class, () -> {
            calculatorService.calculate("divide", numbers);
        });
    }

    @Test
    @DisplayName("Test 7: Empty List - Should throw IllegalArgumentException")
    void testEmptyList() {
        List<Double> numbers = Collections.emptyList();
        assertThrows(IllegalArgumentException.class, () -> {
            calculatorService.calculate("add", numbers);
        });
    }

    @Test
    @DisplayName("Test 8: Unknown Operation - Should throw IllegalArgumentException")
    void testUnknownOperation() {
        List<Double> numbers = Arrays.asList(10.0, 20.0);
        assertThrows(IllegalArgumentException.class, () -> {
            calculatorService.calculate("modulus", numbers);
        });
    }

    @Test
    @DisplayName("Test 9: Single Number Addition - Should return the number itself")
    void testSingleNumberAddition() {
        List<Double> numbers = Collections.singletonList(42.0);
        double result = calculatorService.calculate("add", numbers);
        assertEquals(42.0, result, 0.001);
    }

    @Test
    @DisplayName("Test 10: Negative Numbers - Should handle negative values correctly")
    void testNegativeNumbers() {
        List<Double> numbers = Arrays.asList(-10.0, -20.0);
        double result = calculatorService.calculate("add", numbers);
        assertEquals(-30.0, result, 0.001);
    }
}
