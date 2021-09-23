import React, { useState } from 'react';
import '../App.scss';

// gameboard button component
const Box = ({ value, onClick }) => {

  return (
    <button className="game-button" onClick={onClick}>
      {value}
    </button>
  );
}

//restart button component
const Restart = ({ onClick }) => {

  return (
    <button className="restart" onClick={onClick}>
      Play again
    </button>
  );
}

const checkWinner = (boxes) => {
  let winning = null;
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < winningLines.length; i++) {
    const [a, b, c] = winningLines[i];
    //check if any of the possible winning combinations exist.
    if (boxes[a] && boxes[a] === boxes[b] && boxes[a] === boxes[c]) {
      winning = boxes[a];
    }
  }
  if (winning == null && isBoardFull(boxes)) {
    return 'tie'
  } else return winning;
}

//checks to see if no moves are available
const isBoardFull = (boxes) => {
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i] == null) {
      return false;
    }
  }
  return true;
}

//main gameplay component
const App = () => {
  const [boxes, setBoxes] = useState(Array(9).fill(null));
  const [isAiTurn, setIsAiTurn] = useState(false);
  const currentPlayer = isAiTurn ? "X" : "O";
  const winner = checkWinner(boxes);

  const getStatus = () => {
    if (winner && winner !== "tie") {
      return "😢  You Lose!";
    } else if (isBoardFull(boxes)) {
      return "😏 Tie!";
    }
  }

  //onclick for each button will assign the player's value to that game piece
  const renderBox = (boxNumber) => {
    return (
      <div className="box">
        <Box
          value={boxes[boxNumber]}
          onClick={() => {
            if (boxes[boxNumber] != null || winner != null) {
              return;
            }
            const newBoxes = boxes.slice();
            newBoxes[boxNumber] = currentPlayer;
            setBoxes(newBoxes);
            setIsAiTurn(true)
          }}
        />
      </div>
    );
  }

  //used in the minimax algo to determine if the possible moves will result in a win, loss or tie.
  const possibleScores = {
    X: 1,
    O: -1,
    tie: 0
  }

  const minimax = (boxes, depth, isMaximizing) => {
    let result = checkWinner(boxes);
    if (result !== null) {
      return possibleScores[result];
    }
    if (isMaximizing) {
      let topScore = -Infinity;
      let score;
      for (let i = 0; i < boxes.length; i++) {
        if (boxes[i] == null) {
          //breifly assume this box will be the ai's move
          const newBoxes = boxes.slice();
          newBoxes[i] = "X";
          setBoxes(newBoxes);
          score = minimax(newBoxes, depth + 1, false)
          //reset the boxes to the previous state
          setBoxes(boxes);
          topScore = Math.max(score, topScore)
        }
      }
      return topScore;
    } else {
      let topScore = Infinity;
      let score;
      for (let i = 0; i < boxes.length; i++) {
        if (boxes[i] == null) {
          //breifly assume this box will be the ai's move
          const newBoxes = boxes.slice();
          newBoxes[i] = "O";
          setBoxes(newBoxes);
          score = minimax(newBoxes, depth + 1, true)
          //reset the boxes to the previous state
          setBoxes(boxes);
          topScore = Math.min(score, topScore)
        }
      }
      return topScore;
    }
  }

  const aiMove = (boxNumber) => {
    const newBoxes = boxes.slice();
    newBoxes[boxNumber] = "X";
    setBoxes(newBoxes);
    return (
      <div>
        <Box
          value={boxes[boxNumber]}
        />
      </div>

    )
  }

  const aiTurn = () => {
    if (currentPlayer === "X") {
      let topScore = -Infinity;
      let score;
      let move;
      for (let i = 0; i < boxes.length; i++) {
        console.log(i)
        if (boxes[i] == null) {
          //breifly assume this box will be the ai's move
          const newBoxes = boxes.slice();
          newBoxes[i] = "X";
          setBoxes(newBoxes);
          score = minimax(newBoxes, 0, false)
          //reset the boxes to the previous state
          setBoxes(boxes);
          if (score > topScore) {
            topScore = score;
            move = i;
          }
        }
      }
      // should be human's turn now
      setIsAiTurn(false)
      // to make the ai's turn feel a bit more realistic, wait to invoke the aiMove function 
      const wait = Math.floor(Math.random() * 1000)
      setTimeout(function () { aiMove(move) }, wait)
      // aiMove(move);
    }
  }

  if (currentPlayer === "X") aiTurn();

  const renderRestartButton = () => {
    return (
      <Restart
        onClick={() => {
          setBoxes(Array(9).fill(null));
          setIsAiTurn(true);
        }}
      />
    );
  }

  return (
    <div>
      <div className="container">
        <div className="header">
          <h1>Tic Tac Toe</h1>
          <h2>Good luck!</h2>
        </div>
        <div className="game">
          <div className="game-board">
            <div className="board-column">
              {renderBox(0)}
              {renderBox(1)}
              {renderBox(2)}
            </div>
            <div className="board-column">
              {renderBox(3)}
              {renderBox(4)}
              {renderBox(5)}
            </div>
            <div className="board-column">
              {renderBox(6)}
              {renderBox(7)}
              {renderBox(8)}
            </div>
          </div>
        </div>
        <div className="actions">
          <div className="status">{getStatus()}</div>
          <div className="restart-button">{renderRestartButton()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
