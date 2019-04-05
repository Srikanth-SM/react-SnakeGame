import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import Square from "./square";

const size = 4;

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
      setPath: { "00": 1 },
      isGameActive: true
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
    console.log("setting state")
    this.setState({ squares: squares, randomX: i, randomY: j });
  };

  componentWillMount() {
    this.initializeGame();
  }

  boundaryIsValid = (key, val) => {
    const isInsideBoundary =
      this.state[key] + val >= 0 &&
      this.state[key] + val >= 0 &&
      this.state[key] + val < size &&
      this.state[key] + val < size;
    !isInsideBoundary &&
      this.setState({ isGameActive: false }, () => {
        alert("GameOver");
        window.location.reload();
      });
    return isInsideBoundary;
  };

  moveRight = () => {
    const prevX = this.state.X;
    const prevY = this.state.Y;
    const nextY = prevY + 1;
    const nextX = prevX;

    !this.isGameOver(nextX, nextY) &&
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
    const nextY = prevY;
    const nextX = prevX + 1;

    !this.isGameOver(nextX, nextY) &&
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
    const nextY = prevY - 1;
    const nextX = prevX;

    !this.isGameOver(nextX, nextY) &&
      this.boundaryIsValid("Y", -1) &&
      this.setState(
        prevState => {
          const squares = this.state.squares.slice();
          squares[prevX][prevY] = 0;
          return { Y: prevState.Y - 1 };
        },
        () => {
          this.progressGame(prevX, prevY);
        }
      );
  };

  moveTop = () => {
    const prevX = this.state.X;
    const prevY = this.state.Y;
    const nextY = prevY;
    const nextX = prevX - 1;

    !this.isGameOver(nextX, nextY) &&
      this.boundaryIsValid("X", -1) &&
      this.setState(
        prevState => {
          const squares = this.state.squares.slice();
          squares[prevX][prevY] = 0;
          return { X: prevState.X - 1 };
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
      setPath[pair.X.toString() + pair.Y.toString()] = 1;
      squares[pair.X][pair.Y] = 1;
      // setPath["" + pair.X + pair.Y] = 1;
    }
    return [squares, setPath];
  };

  createRandomDot = (squares, setPath) => {
    let isPairInSetPath = true;
    // setPath = setPath;
    // console.log(setPath);
    let i, j;
    while (true) {
      i = Math.floor(Math.random() * size);
      j = Math.floor(Math.random() * size);
      let key = i.toString() + j.toString();
      if (key in setPath) {
        continue;
      }
      break;
    }
    console.log(i,j,setPath)
    return [i, j];
  };

  progressGame = (prevX, prevY) => {
    let squares = this.state.squares.slice();
    let path = this.state.path.slice() || [];
    let setPath = this.state.setPath || {};
    const { X, Y } = this.state;
    const pair = new Pair(X, Y);
    let randValues,
      toGenerateRandomPoint = false;
    if (squares[X][Y] === 0) {
      squares[prevX][prevY] = 0;
      let tempPair = path && path.length > 0 && path[path.length - 1];
      let key = tempPair && +tempPair.X.toString() + tempPair.Y.toString();
      // key in setPath && delete setPath[key];
      path.pop();
      path.unshift(pair);
      // setPath["" + X + Y] = 1;
    } else if (squares[X][Y] === 2) {
      path.unshift(pair);
      toGenerateRandomPoint = true;
      // setPath["" + X + Y] = 1;
    }
    let values = this.fillSquares(path, X);
    squares = values[0];
    setPath = values[1];
    if (toGenerateRandomPoint) {
      console.log("create random dot");
      randValues = this.createRandomDot(squares, setPath);
      console.log("exit create random dot");
    }
    console.log("after createRandomDot");
    let randomX, randomY;
    if (randValues && randValues.length > 0) {
      randomX = randValues[0];
      randomY = randValues[1];
      
      squares[randomX][randomY] = 2;
      this.setState({squares:squares,randomX:randomX,randomY:randomY})
    }
    console.log("random", randomX, randomY, this.state.randomX, this.state.randomY);
    console.log("setting state")
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

  isGameOver = (nextX, nextY) => {
    return "" + nextX + nextY in this.state.setPath;
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
      return (
        <div
          className="board-row"
          style={
            !this.state.isGameActive
              ? { pointerEvents: "none", opacity: "0.5" }
              : {}
          }
        >
          {temp}
        </div>
      );
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
