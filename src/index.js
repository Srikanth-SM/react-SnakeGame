import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import Square from "./square";

const size = 10;

class Pair {
  constructor(x, y) {
    this.X = x;
    this.Y = y;
  }
}

function initialiseBoard() {
  let matrix = new Array(size);
  for (let i = 0; i < size; i++) {
    let b = new Array(size).fill(0);
    matrix[i] = b;
  }
  return matrix;
}

class Game extends React.Component {
  constructor(props) {
    let matrix = initialiseBoard();
    super(props);
    this.state = {
      squares: matrix,
      X: 0,
      Y: 0,
      path: [new Pair(0, 0)],
      setPath: { "00": 1 }
    };
  }

  initializeGame = () => {
    const squares = this.state.squares.slice();
    squares[this.state.X][this.state.Y] = 1;
    let i, j;
    do {
      i = Math.floor(Math.random() * size);
      j = Math.floor(Math.random() * size);
      squares[i][j] = 2;
    } while (i === 0 && j === 0);
    this.setState({ squares: squares, randomX: i, randomY: j });
  };

  componentWillMount() {
    this.initializeGame();
  }

  boundaryIsValid = (key, val) => {
    return (
      this.state[key] + val >= 0 &&
      this.state[key] + val >= 0 &&
      this.state[key] + val < size &&
      this.state[key] + val < size
    );
  };

  moveRight = () => {
    const prevX = this.state.X;
    const prevY = this.state.Y;
    this.boundaryIsValid("Y", 1) &&
      this.setState(
        prevState => {
          return { Y: prevState.Y + 1 };
        },
        () => {
          this.progressGame(prevX, prevY);
        }
      );
  };

  moveDown = () => {
    const prevX = this.state.X;
    const prevY = this.state.Y;
    this.boundaryIsValid("X", 1) &&
      this.setState(
        prevState => {
          return { X: prevState.X + 1 };
        },
        () => {
          this.progressGame(prevX, prevY);
        }
      );
  };

  moveLeft = () => {
    const prevX = this.state.X;
    const prevY = this.state.Y;
    this.boundaryIsValid("Y", -1) &&
      this.setState(
        prevState => {
          const squares = this.state.squares.slice();
          squares[prevX][prevY] = 0;
          return { Y: prevState.Y - 1, squares: squares };
        },
        () => {
          this.progressGame(prevX, prevY);
        }
      );
  };

  moveTop = () => {
    const prevX = this.state.X;
    const prevY = this.state.Y;
    this.boundaryIsValid("X", -1) &&
      this.setState(
        prevState => {
          const squares = this.state.squares.slice();
          squares[prevX][prevY] = 0;
          return { X: prevState.X - 1, squares: squares };
        },
        () => {
          this.progressGame(prevX, prevY);
        }
      );
  };

  fillSquares = (path, X) => {
    const squares = initialiseBoard();
    const setPath = {};
    squares[this.state.randomX][this.state.randomY] = 2;
    for (let pair of path) {
      setPath["" + pair.X + pair.Y] = 1;
      squares[pair.X][pair.Y] = 1;
    }
    return squares;
  };

  createRandomDot = squares => {
    const setPath = this.state.setPath;
    let isPairInSetPath = true;
    let i, j;
    while (isPairInSetPath) {
      i = Math.floor(Math.random() * size);
      j = Math.floor(Math.random() * size);
      let key = "" + i + j;
      if (!(key in setPath)) {
        isPairInSetPath = false;
        setPath[key] = 1;
      }
    }
    return [i, j];
  };

  progressGame = (prevX, prevY) => {
    let squares = this.state.squares.slice();
    let path = this.state.path.slice() || [];
    let setPath = this.state.setPath || {};
    const { X, Y } = this.state;
    const pair = new Pair(X, Y);
    let randValues;
    if (squares[X][Y] === 0) {
      squares[prevX][prevY] = 0;
      path.pop();
      let key = "" + prevX + prevY;
      key in setPath && delete setPath["" + prevX + prevY];
      path.unshift(pair);
    } else if (squares[X][Y] === 2) {
      path.unshift(pair);
      setPath["" + X + Y] = 1;
      randValues = this.createRandomDot();
    }
    squares = this.fillSquares(path, X);
    let randomX, randomY;
    if (randValues && randValues.length > 0) {
      randomX = randValues[0];
      randomY = randValues[1];
      squares[randomX][randomY] = 2;
    }
    this.setState(prevState => {
      return {
        squares: squares,
        setPath: setPath,
        path: path,
        randomX: randomX || prevState.randomX,
        randomY: randomY || prevState.randomY
      };
    });
  };

  render() {
    const squares = this.state.squares;
    // let htmlSquares = "";
    const htmlSquares = squares.map((square, i) => {
      const temp = square.map((s, j) => {
        return (
          <Square
            value={i + "" + j}
            addClass={
              squares[i][j] === 1
                ? "blink "
                : squares[i][j] === 2
                ? "blink_red "
                : " "
            }
            moveRight={this.moveRight}
            moveLeft={this.moveLeft}
            moveTop={this.moveTop}
            moveDown={this.moveDown}
          />
        );
      });
      return <div className="board-row">{temp}</div>;
    });

    return htmlSquares;
  }
}

// ========================================

ReactDOM.render(
  <div>
    <h3>Welcome to the Game of Snake.</h3>
    <Game />
  </div>,
  document.getElementById("root")
);
