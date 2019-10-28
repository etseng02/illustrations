import React, { Component, Fragment } from 'react';
import Pusher from 'pusher-js';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.endPaintEvent = this.endPaintEvent.bind(this);
    this.convertToBlob = this.convertToBlob.bind(this);
    //mobile
    this.onTouchStart= this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.pusher = new Pusher('b37e8b05f23c407c454e', {
      cluster: 'us2',
    });
  }

  isPainting = false;
  // Different stroke styles to be used for user and guest
  userStrokeStyle = '#000';
  line = [];
  prevPos = { clientX: 0, clientY: 0 };

  // getMousePos(target) {
  //   const rect = this.canvas.getBoundingClientRect();
  //   this.prevPos.clientX -= rect.left;
  //   this.prevPos.clientY -= rect.top;
  // }

  onMouseDown({ nativeEvent }) {
    const { clientX, clientY } = nativeEvent;
    this.isPainting = true;
    this.prevPos = { clientX, clientY };
    const rect = this.canvas.getBoundingClientRect();
    this.prevPos.clientX -= rect.left;
    this.prevPos.clientY -= rect.top;
  }

  onMouseMove({ nativeEvent }) {
    if (this.isPainting) {
      const { clientX, clientY } = nativeEvent;
      const offSetData = { clientX, clientY };
      const rect = this.canvas.getBoundingClientRect();
      offSetData.clientX -= rect.left;
      offSetData.clientY -= rect.top;
      // Set the start and stop position of the paint event.
      const positionData = {
        start: { ...this.prevPos },
        stop: { ...offSetData },
      };
      // Add the position to the line array
      this.line = this.line.concat(positionData);
      this.paint(this.prevPos, offSetData, this.userStrokeStyle);
    }
  }
  //mobile
  onTouchStart({ nativeEvent}) {
    const { clientX, clientY } = nativeEvent.touches[0];
    this.isPainting = true;
    this.prevPos = { clientX, clientY };
    const rect = this.canvas.getBoundingClientRect();
    this.prevPos.clientX -= rect.left;
    this.prevPos.clientY -= rect.top;
  }
  onTouchMove({ nativeEvent }) {
    // e.preventDefault();
    if (this.isPainting) {
      const { clientX, clientY } = nativeEvent.touches[0];
      const offSetData = { clientX, clientY };
      const rect = this.canvas.getBoundingClientRect();
      offSetData.clientX -= rect.left;
      offSetData.clientY -= rect.top;
      // Set the start and stop position of the paint event.
      const positionData = {
        start: { ...this.prevPos },
        stop: { ...offSetData },
      };
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
    const { clientX, clientY } = currPos;
    const { clientX: x, clientY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;
    // Move the the prevPosition of the mouse
    this.ctx.moveTo(x, y);
    // Draw a line to the current position of the mouse
    this.ctx.lineTo(clientX, clientY);
    // Visualize the line using the strokeStyle
    this.ctx.stroke();
    this.prevPos = { clientX, clientY };
  }


  convertToBlob() {
    let img = new Image();
    this.canvas.toBlob(function(blob) {
      const blobURL = URL.createObjectURL(blob);
      img.src = blobURL;
      document.body.appendChild(img);
    }, "image/png", 0.75);
  }

  componentDidMount() {
    // Prevent scrolling when touching the canvas: mobile
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
    
    //time limit for converting canvas to image
    // setTimeout(() => {
    //   let img = new Image();
    //   this.canvas.toBlob(function(blob) {
    //     const blobURL = URL.createObjectURL(blob);
    //     img.src = blobURL;
    //     document.body.appendChild(img);
    //   }, "image/png", 0.75);
    // }, 5000);
  }

  render() {
    return (
      <Fragment>
        <button
          onClick={this.convertToBlob}>
            what
        </button>
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
          onTouchEnd={this.endPaintEvent}
        />
      </Fragment>
    );
  }
}
export default Canvas;