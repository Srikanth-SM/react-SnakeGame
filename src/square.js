import React from "react";
import "./index.css";

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
export default Square;
