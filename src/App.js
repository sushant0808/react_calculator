import logo from './logo.svg';
import './App.css';
import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }

      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      // Below if is used for a scenario like this: If user does some operation like for eg 12 + 3 and clicks on equal button then he will get the output as 15. But if he types next operation for eg 4 then our code will directly append 4 to the value 12 which will become 124. So to avoid this we have the below condition which checks if state has an overwrite property which gets set after equal button is clicked, so if it exists then just replace our new operation with the old one
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit, overwrite: false,
        }
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (!state.currentOperand && !state.previousOperand) {
        console.log('okdi');
        return state;
      }

      // Below is used to in a scenario like if user types a number and selects an operation eg: +, and then if he wants to choose another operation in place of the existing + operation then this condition will remove the existing operation and put the new operation selected by him.
      if (!state.currentOperand) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      // Here below if is used to add the given operation i.e + or - or etc etc. This will only work when there is no previousOperand available. Now if we already have a previous operand and then again we select an operation like + or - then the last return statement will be executed where we are calculating the result and then displaying its output
      if (state.previousOperand === undefined) {
        console.log('me hu');
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload.operation,
          currentOperand: undefined,
        }
      }

      return {
        ...state,
        previousOperand: evaluateOperation(state),
        currentOperand: undefined,
        operation: payload.operation
      }


    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.EVALUATE:
      if (!state.operation || !state.currentOperand || !state.previousOperand) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: undefined,
        operation: undefined,
        currentOperand: evaluateOperation(state)
      }

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: undefined
        }
      }

      // Below if is used to check if we do not have the currentOperand then just return current state
      if (!state.currentOperand) {
        return state;
      }

      // Below if is used for cond when we have only 1 digit. If we directly delete without applying below condition the currentOperand will get empty string value so to avoid that we have this condition which when satisfied then it will set currentOperand to undefined
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: undefined
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }

  }
}

function evaluateOperation({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) {
    console.log('hi');
    return "";
  }

  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;

    case "-":
      computation = prev - current;
      break;

    case "*":
      computation = prev * current;
      break;

    case "/":
      computation = prev / current;
      break;

  }

  console.log('cccc', computation.toString())
  return computation.toString();
}

// Below function is used to format our operands for eg: if user puts 12000 then it will be formatted to 12,000
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

// Below function formats the operand value
function formatOperand(operand) {
  if (!operand) return
  const [integer, decimal] = operand.split(".");
  if (!decimal) {
    return INTEGER_FORMATTER.format(integer);
  }

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  console.log('currentOperand', currentOperand);
  console.log('previousOperand', previousOperand);
  console.log('operation', operation);


  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Calculator</h1>
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation="/" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
    </>
  );
}

export default App;
