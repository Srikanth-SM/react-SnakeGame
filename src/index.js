import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import Square from "./square";

const size = 3;

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

class Board extends React.Component {
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
      // if(i!=0 && j!=0)
      if (i !== 0 || j !== 0) squares[i][j] = 2;
    } while (i === 0 && j === 0);
    this.setState({ squares: squares, randomX: i, randomY: j });
  };

  componentWillMount() {
    this.initializeGame();
  }

  componentDidMount() {
    window.addEventListener("load", event => {
      document.getElementsByTagName("button")[0].focus();
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  boundaryIsValid = (key, val) => {
    const isInsideBoundary =
      this.state[key] + val >= 0 &&
      this.state[key] + val >= 0 &&
      this.state[key] + val < size &&
      this.state[key] + val < size &&
      this.state.path.length < size * size;
    !isInsideBoundary &&
      this.setState({ isGameActive: false }, () => {
        let status = {
          isGameActive: this.state.isGameActive,
          message: "Player Lost"
        };
        this.props.isGameActive(status);
        this.timeout = setTimeout(()=>window.location.reload(), 5000);
      });
    return isInsideBoundary;
  };

  moveRight = () => {
    const prevX = this.state.X;
    const prevY = this.state.Y;
    const nextY = prevY + 1;
    const nextX = prevX;
    if (!this.isGameOver(nextX, nextY)) {
      this.boundaryIsValid("Y", 1) &&
        this.setState(
          prevState => {
            return { Y: prevState.Y + 1 };
          },
          () => {
            this.progressGame(prevX, prevY);
          }
        );
    } else {
      return this.changeGameState();
    }
  };

  moveDown = () => {
    const prevX = this.state.X;
    const prevY = this.state.Y;
    const nextY = prevY;
    const nextX = prevX + 1;

    if (!this.isGameOver(nextX, nextY)) {
      this.boundaryIsValid("X", 1) &&
        this.setState(
          prevState => {
            return { X: prevState.X + 1 };
          },
          () => {
            this.progressGame(prevX, prevY);
          }
        );
    } else {
      return this.changeGameState();
    }
  };

  moveLeft = () => {
    const prevX = this.state.X;
    const prevY = this.state.Y;
    const nextY = prevY - 1;
    const nextX = prevX;
    if (!this.isGameOver(nextX, nextY)) {
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
    } else {
      return this.changeGameState();
    }
  };

  moveTop = () => {
    const prevX = this.state.X;
    const prevY = this.state.Y;
    const nextY = prevY;
    const nextX = prevX - 1;
    if (!this.isGameOver(nextX, nextY)) {
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
    } else {
      return this.changeGameState();
    }
  };

  fillSquares = (path, X, toGenerateRandomPoint) => {
    const squares = initialiseBoard();
    const setPath = {};
    squares[this.state.randomX][this.state.randomY] = 2;
    for (let pair of path) {
      setPath[pair.X.toString() + pair.Y.toString()] = 1;
      squares[pair.X][pair.Y] = 1;
    }
    let isGameActive = true;
    if (Object.keys(setPath).length === size * size) isGameActive = false;
    return this.setState({ squares, setPath, path, isGameActive }, () => {
      if (!isGameActive) {
        let status = {
          isGameActive: this.state.isGameActive,
          message: "Player won"
        };
        this.props.isGameActive(status);
        this.timeout = setTimeout(() => window.location.reload(), 5000);
        return;
      }
      if (toGenerateRandomPoint) {
        return this.createRandomDot(
          this.state.squares,
          this.state.setPath,
          () => {
            return;
          }
        );
      }
    });
  };

  createRandomDot = (squares, setPath, cb) => {
    squares = this.state.squares;
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
    squares[i][j] = 2;
    return this.setState({ squares, randomX: i, randomY: j }, () => {
      return cb();
    });
  };

  progressGame = (prevX, prevY) => {
    let squares = this.state.squares.slice();
    let path = this.state.path.slice() || [];
    const { X, Y } = this.state;
    const pair = new Pair(X, Y);
    let toGenerateRandomPoint = false;
    if (squares[X][Y] === 0) {
      path.pop();
      path.unshift(pair);
    } else if (squares[X][Y] === 2) {
      path.unshift(pair);
      toGenerateRandomPoint = true;
    }
    this.fillSquares(path, X, toGenerateRandomPoint);
  };

  isGameOver = (nextX, nextY) => {
    return "" + nextX + nextY in this.state.setPath;
  };

  changeGameState = ()=> {
    return this.setState({ isGameActive: false }, () => {
      let status = {
        isGameActive: this.state.isGameActive,
        message: "Player Lost"
      };
      this.props.isGameActive(status);
      this.timeout = setTimeout(() => window.location.reload(), 5000);
    });
  }

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
class Game extends React.Component {
  state = {
    isGameActive: true,
    message: "playerLost"
  };
  isGameActive = ({ isGameActive, message }) => {
    this.setState({ isGameActive, message });
  };
  render() {
    return (
      <div>
        <Board isGameActive={this.isGameActive} />
        <div style={{ display: !this.state.isGameActive ? "inline" : "None" }}>
          Game over, {this.state.message}
        </div>
      </div>
    );
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
