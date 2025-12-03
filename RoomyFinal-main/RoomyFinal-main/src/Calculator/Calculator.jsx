import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import './Calculator.css';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  
  const navigate = useNavigate();

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const toggleSign = () => {
    const newValue = parseFloat(display) * -1;
    setDisplay(String(newValue));
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      
      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (operation && previousValue !== null) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <Navigation currentUser={user} onLogout={handleLogout} />
      <PageLayout
        title="🧮 Calculator"
        subtitle="Calculate expenses and split costs"
        actions={
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        }
      >
        <div className="calculator-wrapper">
          <Card className="calculator-card">
            {/* Display */}
            <div className="calculator-display">
              <div className="display-value">{display}</div>
            </div>

            {/* Buttons */}
            <div className="calculator-keypad">
              {/* Row 1: Memory and Clear */}
              <button className="key-function" onClick={clearEntry}>CE</button>
              <button className="key-function" onClick={clear}>C</button>
              <button className="key-function" onClick={toggleSign}>±</button>
              <button className="key-operator" onClick={() => performOperation('÷')}>÷</button>

              {/* Row 2 */}
              <button className="key-number" onClick={() => inputDigit(7)}>7</button>
              <button className="key-number" onClick={() => inputDigit(8)}>8</button>
              <button className="key-number" onClick={() => inputDigit(9)}>9</button>
              <button className="key-operator" onClick={() => performOperation('×')}>×</button>

              {/* Row 3 */}
              <button className="key-number" onClick={() => inputDigit(4)}>4</button>
              <button className="key-number" onClick={() => inputDigit(5)}>5</button>
              <button className="key-number" onClick={() => inputDigit(6)}>6</button>
              <button className="key-operator" onClick={() => performOperation('-')}>−</button>

              {/* Row 4 */}
              <button className="key-number" onClick={() => inputDigit(1)}>1</button>
              <button className="key-number" onClick={() => inputDigit(2)}>2</button>
              <button className="key-number" onClick={() => inputDigit(3)}>3</button>
              <button className="key-operator" onClick={() => performOperation('+')}>+</button>

              {/* Row 5 */}
              <button className="key-number" onClick={inputPercent}>%</button>
              <button className="key-number" onClick={() => inputDigit(0)}>0</button>
              <button className="key-number" onClick={inputDecimal}>.</button>
              <button className="key-equals" onClick={handleEquals}>=</button>
            </div>
          </Card>
        </div>
      </PageLayout>
    </>
  );
}
