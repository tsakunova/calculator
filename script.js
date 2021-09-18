function strip(number) {
  if (number === 0) return number
  return (parseFloat(number).toPrecision(12)).replace(/[\. | 0]+$/, '')
}

class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.isWorking = false
    this.hasError = false
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.clear()
  }
  clear() {
    this.currentOperand = ''
    this.previousOperand = ''
    this.operation = undefined
    this.hasError = false
  }

  delete() {
    if (!this.currentOperand && this.previousOperand) {
      this.currentOperand = this.previousOperand
      this.previousOperand = ''
      this.operation = undefined
      return
    }
    this.currentOperand = this.currentOperand.toString().slice(0, -1) //отрезает последний введенный символ
    this.hasError = false
  }

  appendNumber(number) {
    if (this.hasError) return
    if (number === '.' && this.currentOperand.includes('.')) return // чтобы добавилась только одна точка
    if (this.isWorking) {
      this.currentOperand = this.currentOperand.toString() + number.toString()
    } else {
      this.currentOperand = number
    }

    if (this.operation === '√') {
      this.previousOperand = this.currentOperand
    }
    this.isWorking = true
  }

  chooseOperation(operation) {
    if (this.hasError) return
    if (this.currentOperand === '' && this.previousOperand !== '') {
      this.operation = operation
    }
    if (operation === '√') {
      this.previousOperand = this.currentOperand
      this.operation = operation
      if (this.currentOperand) {
        this.compute()
      }
      return;
    }
    if (operation === 'min') {
      if (this.currentOperand) {
        this.currentOperand = this.currentOperand * (-1)
      }

      return
    }
    if (this.currentOperand === '') return
    if (this.previousOperand !== '') {
      this.compute()
    }
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
  }

  compute() {
    let computation
    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    if (isNaN(prev) || isNaN(current)) return
    switch (this.operation) {
      case '+':
        computation = strip(prev + current)
        break
      case '-':
        computation = strip(prev - current)
        break
      case '*':
        computation = strip(prev * current)
        break
      case '÷':
        let koof = 1;
        
        if ((Math.sign(prev) > 1 && Math.sign(current) < 1) 
        || (Math.sign(prev) < 1 && Math.sign(current)> 1)
        ) {
          koof = -1
        }
        computation = koof * (prev / current)
        break
      case '√':
        computation = Math.sqrt(current)
        break
      case 'xy':
        computation = Math.pow(prev, current)
        break
      default:
        return
    }

    this.currentOperand = computation
    this.operation = undefined
    this.previousOperand = ''
    this.isWorking = false
    if (isNaN(computation)) {
      this.hasError = true
    }
  }
  getDisplayNumber(number) {
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = ''
    } else {
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0
      })
    }
    if (this.hasError) {
      integerDisplay = 'ERROR'
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand)
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }
  howWork(operations, operationsList){
    operationsList.innerText = ''
      for (var i = 0; i < operations.length; i++) {
      let newLi = document.createElement('li');
      let operationText = operations[i].dataset.doc;
      newLi.innerText = operationText;
      operationsList.appendChild(newLi);
  };
 
}
}

const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')
const howItWork = document.querySelector('[data-howWork]')
const operationsList = document.querySelector('[data-operationsList]');
const documentation = document.querySelectorAll('[data-doc]');
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => { //прошли по массиву чисел и каждому назначаем событие
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
  })
})
operationButtons.forEach(button => { //прошли по массиву чисел и каждому назначаем событие
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
  })
})
equalsButton.addEventListener('click', button => {
  calculator.compute()
  calculator.updateDisplay()
})


allClearButton.addEventListener('click', button => {
  calculator.clear()
  calculator.updateDisplay()
})
deleteButton.addEventListener('click', button => {
  calculator.delete()
  calculator.updateDisplay()
})

howItWork.addEventListener('click', button => {
  calculator.howWork(documentation, operationsList)
} )
