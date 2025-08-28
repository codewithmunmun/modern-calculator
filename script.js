class Calculator {
    constructor() {
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.currentOperandElement = document.querySelector('.current-operand');
        this.clear();
        this.setupEventListeners();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.previousOperand = '';
                    this.operation = undefined;
                    return;
                }
                computation = prev / current;
                break;
            case 'percent':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    getDisplayNumber(number) {
        if (number === 'Error') return number;
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            let operator;
            switch (this.operation) {
                case 'add': operator = '+'; break;
                case 'subtract': operator = '-'; break;
                case 'multiply': operator = '×'; break;
                case 'divide': operator = '÷'; break;
                case 'percent': operator = '%'; break;
            }
            this.previousOperandElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${operator}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }

    setupEventListeners() {
        // Number buttons
        document.querySelectorAll('.btn.number').forEach(button => {
            button.addEventListener('click', () => {
                if (button.dataset.value === 'decimal') {
                    this.appendNumber('.');
                } else {
                    this.appendNumber(button.dataset.value);
                }
                this.updateDisplay();
            });
        });

        // Operation buttons
        document.querySelectorAll('.btn.operation').forEach(button => {
            button.addEventListener('click', () => {
                const operation = button.dataset.value;
                
                switch (operation) {
                    case 'clear':
                        this.clear();
                        break;
                    case 'backspace':
                        this.delete();
                        break;
                    case 'equals':
                        this.compute();
                        break;
                    case 'add':
                    case 'subtract':
                    case 'multiply':
                    case 'divide':
                    case 'percent':
                        this.chooseOperation(operation);
                        break;
                }
                
                this.updateDisplay();
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (/[0-9]/.test(e.key)) {
                this.appendNumber(e.key);
            } else if (e.key === '.') {
                this.appendNumber('.');
            } else if (e.key === '+' || e.key === '-') {
                this.chooseOperation(e.key === '+' ? 'add' : 'subtract');
            } else if (e.key === '*') {
                this.chooseOperation('multiply');
            } else if (e.key === '/') {
                e.preventDefault();
                this.chooseOperation('divide');
            } else if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                this.compute();
            } else if (e.key === 'Backspace') {
                this.delete();
            } else if (e.key === 'Escape') {
                this.clear();
            } else if (e.key === '%') {
                this.chooseOperation('percent');
            }
            
            this.updateDisplay();
        });
    }
}

// Initialize calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});