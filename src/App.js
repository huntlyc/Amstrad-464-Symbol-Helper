import React, { useState } from 'react';
import './App.css';


const dataToDecArr = function (rowData) {
  // convert dec to 8-bit-binary string
  let dec = "" + Number(rowData).toString(2);

  // needs to be 8 bit
  dec = dec.padStart(8, '0');

  // convert to array
  dec = dec.split('');

  return dec;
}

function Row(props) {
  let row = props.row;
  let rowData = props.data;
  let onCellChange = props.onCellChange;


  const generateRow = function (cellData) {
    const numberMap = [128, 64, 32, 16, 8, 4, 2, 1];
    return cellData.map((d, i) => <div key={numberMap[i]} data-row={row} data-col={i} data-col-bin={numberMap[i]} data-state={d === "1" ? "on" : "off"} onClick={onCellChange} />);
  };

  return generateRow(dataToDecArr(rowData));
}


function Grid(props) {
  const state = props.state;
  const onCellChange = props.onCellChange;

  const renderRows = function () {
    const rows = state.split(',');
    return rows.map((r, i) => <Row key={i} row={i} data={r} onCellChange={onCellChange} />)
  };

  return <div className="grid">{renderRows()}</div>
}


function App() {
  const [state, setState] = useState("0,0,0,0,0,0,0,0");

  const onInputChange = function (e) {
    let newState = e.target.value;

    //validate input
    if (newState.indexOf(',') > 0) {
      let stateArr = newState.split(',');
      if (stateArr.length === 8) {
        setState(newState)
      }
    }
  };

  const reset = function () {
    setState('0,0,0,0,0,0,0,0');
  };

  const onCellChange = function (e) {
    const row = Number(e.target.getAttribute('data-row'));
    const col = Number(e.target.getAttribute('data-col'));
    const newColState = e.target.getAttribute('data-state') === "off" ? 1 : 0; // is off, about to be on


    //generate new state
    let stateArr = state.split(',');
    let curRowData = stateArr[row];

    curRowData = dataToDecArr(curRowData);
    curRowData[col] = newColState.toString();

    stateArr[row] = "" + parseInt(curRowData.join(''), 2);

    setState(stateArr.join(','));
  };

  return (
    <div className="App">
      <h1>Amstrad 464 Symbol Helper</h1>
      <p>Each symbol is an 8x8 matrix and the command is:<br /><code>SYMBOL CHNUM,r1,r2,r3,r4,r5,r6,r7,r8</code><br />where 'r(n)' is a decimal value that's converted to a binary string which in turn represents the filled in squares of the row!</p>
      <Grid state={state} onCellChange={onCellChange} className="grid" />
      <label for="symbol-data">Symbol Data</label>
      <input id="symbol-data" type="text" value={state} onChange={onInputChange} />
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default App;
