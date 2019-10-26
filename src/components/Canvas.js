import React, { Component } from 'react';
import Pusher from 'pusher-js';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.endPaintEvent = this.endPaintEvent.bind(this);
    //mobile
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchStart= this.onTouchStart.bind(this);
    this.pusher = new Pusher('b37e8b05f23c407c454e', {
      cluster: 'us2',
    });
  }

  isPainting = false;
  // Different stroke styles to be used for user and guest
  userStrokeStyle = '#000';
  // guestStrokeStyle = '#F0C987';
  line = [];
  prevPos = { offsetX: 0, offsetY: 0 };

  onMouseDown({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent;
    this.isPainting = true;
    this.prevPos = { offsetX, offsetY };
  }

  onMouseMove({ nativeEvent }) {
    if (this.isPainting) {
      const { offsetX, offsetY } = nativeEvent;
      console.log("?", nativeEvent);
      const offSetData = { offsetX, offsetY };
      // Set the start and stop position of the paint event.
      const positionData = {
        start: { ...this.prevPos },
        stop: { ...offSetData },
      };
      console.log("what", positionData);
      // Add the position to the line array
      this.line = this.line.concat(positionData);
      this.paint(this.prevPos, offSetData, this.userStrokeStyle);
    }
  }
  //mobile
  onTouchStart({ nativeEvent}) {
    // e.preventDefault();
    const { offsetX, offsetY } = nativeEvent;
    this.isPainting = true;
    this.prevPos = { offsetX, offsetY };
  }
  onTouchMove({ nativeEvent }) {
    // e.preventDefault();
    console.log("ontouchmove");
    console.log(">", this.isPainting);
    if (this.isPainting) {
      const { offsetX, offsetY } = nativeEvent;
      console.log(">?>?>?>", nativeEvent.touches);
      const offSetData = { offsetX, offsetY };
      // Set the start and stop position of the paint event.
      const positionData = {
        start: { ...this.prevPos },
        stop: { ...offSetData },
      };
      console.log(">??", positionData);
      // Add the position to the line array
      this.line = this.line.concat(positionData);
      this.paint(this.prevPos, offSetData, this.userStrokeStyle);
    }
  }

  endPaintEvent() {
    if (this.isPainting) {
      this.isPainting = false;
    }
  }
  paint(prevPos, currPos, strokeStyle) {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;
    // Move the the prevPosition of the mouse
    this.ctx.moveTo(x, y);
    // Draw a line to the current position of the mouse
    this.ctx.lineTo(offsetX, offsetY);
    // Visualize the line using the strokeStyle
    this.ctx.stroke();
    this.prevPos = { offsetX, offsetY };
  }

  componentDidMount() {
    // Prevent scrolling when touching the canvas
    this.canvas.addEventListener('touchmove', e => {
      e.preventDefault();
    });
    // Here we set up the properties of the canvas element. 
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 5;
  }

  render() {
    return (
      <canvas
      // We use the ref attribute to get direct access to the canvas element. 
        ref={(ref) => (this.canvas = ref)}
        style={{ background: 'blue' }}
        onMouseDown={this.onMouseDown}
        onMouseLeave={this.endPaintEvent}
        onMouseUp={this.endPaintEvent}
        onMouseMove={this.onMouseMove}

        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        // onTouchEnd={this.endPaintEvent}
      />
    );
  }
}
export default Canvas;