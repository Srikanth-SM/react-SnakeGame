import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const size = 10;

// Math.floor(Math.random() * 6) + 1;

class Square extends React.Component {
  state = {
    addClass: ""
  };

  handleClick = event => {
    console.log(event.target);
  };
  handleKeyPress = event => {
    if (event.key === "ArrowRight") {
      return this.props.moveRight();
    }

    if (event.key === "ArrowLeft") {
      return this.props.moveLeft();
    }

    if (event.key === "ArrowDown") {
      return this.props.moveDown();
    }

    if (event.key === "ArrowUp") {
      return this.props.moveTop();
    }
  };
  render() {
    return (
      <button
        className={"square " + this.props.addClass}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyPress}
        name={this.props.value}
      />
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    let matrix = new Array(size);
    for (let i = 0; i < size; i++) {
      let b = new Array(size).fill(0);
      matrix[i] = b;
    }
    super(props);
    this.state = {
      squares: matrix,
      X: 0,
      Y: 0
    };
    // console.log(matrix);
  }
  initializeGame = () => {
    console.log("Inside initialize");
    const squares = this.state.squares.slice();
    squares[this.state.X][this.state.Y] = 1;
    let i, j;
    do {
      i = Math.floor(Math.random() * size);
      j = Math.floor(Math.random() * size);

      console.log(i, j);
      squares[i][j] = 2;
    } while (i === 0 && j === 0);

    this.setState({ squares: squares }, () => {
      console.log(this.state);
    });
  };
  componentWillMount() {
    this.initializeGame();
  }

  boundaryIsValid = () => {
    return (
      this.state.X >= 0 &&
      this.state.Y >= 0 &&
      this.state.X < size &&
      this.state.Y < size
    );
  };

  moveRight = () => {
    this.boundaryIsValid() &&
      this.setState(
        prevState => {
          return { X: prevState.X + 1 };
        },
        () => console.log(this.state)
      );
  };

  moveDown = () => {
    this.boundaryIsValid() &&
      this.setState(
        prevState => {
          return { Y: prevState.Y + 1 };
        },
        () => console.log(this.state)
      );
  };

  moveLeft = () => {
    this.boundaryIsValid() &&
      this.setState(
        prevState => {
          return { X: prevState.X - 1 };
        },
        () => console.log(this.state)
      );
  };

  moveTop = () => {
    this.boundaryIsValid() &&
      this.setState(
        prevState => {
          return { Y: prevState.Y - 1 };
        },
        () => console.log(this.state)
      );
  };

  render() {
    console.log("Inside render");
    const squares = this.state.squares;
    // let htmlSquares = "";
    const htmlSquares = squares.map((square, i) => {
      const temp = square.map((s, j) => {
        // console.log(squares);
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

ReactDOM.render(<Game />, document.getElementById("root"));
