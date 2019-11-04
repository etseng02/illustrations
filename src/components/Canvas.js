import React, { Component, Fragment, setState } from 'react';
import Pusher from 'pusher-js';
import reactCSS from 'reactcss';
import eraser from '../images/eraser.png';
import pencil from '../images/pencil.png';
import { CirclePicker } from 'react-color';

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

  //COLOR PICKER
  state = {
    drawing: null,
    pencilClicked: "#FFFFFF",
    eraserClicked: "#FFFFFF",
    displayColorPicker: false,
    color: "#000"
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };
  
  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };
  
  handleChange = (color) => {
    this.ctx.lineWidth = 5;
    this.setState({ color: color.hex })
    this.setState({ pencilClicked: "#a2eff5" });
    this.setState({ eraserClicked: "#FFFFFF" })
  };

  convertToBlob() {
    this.canvas.toBlob((blob) =>  {
      this.props.onData(blob);
    }, "image/png", 0.75);
  };
  //COLOR PICKER END
  
  isPainting = false;
  // Different stroke styles to be used for user and guest
  line = [];
  prevPos = { clientX: 0, clientY: 0 };

  // getMousePos(target) {
  //   const rect = this.canvas.getBoundingClientRect();
  //   this.prevPos.clientX -= rect.left;
  //   this.prevPos.clientY -= rect.top;
  // }

  onMouseDown({ nativeEvent }) {
    //console.log(">>>", this.state.color);
    this.setState({ displayColorPicker: false });
    this.userStrokeStyle = this.state.color;
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
    this.setState({ displayColorPicker: false });
    this.userStrokeStyle = this.state.color;
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


  componentDidMount() {
    // Prevent scrolling when touching the canvas: mobile
    this.canvas.addEventListener('touchmove', e => {
      e.preventDefault();
    });
    // Here we set up the properties of the canvas element. 
    this.canvas.width = 375;
    this.canvas.height = 375;
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

  onPencilClick = () => {
    console.log("pencil clicked");
    this.setState({ color: "#000"});
    this.ctx.lineWidth = 5;
    this.setState({ pencilClicked: "#a2eff5" });
    this.setState({ eraserClicked: "#FFFFFF" });
  }

  onEraserClick = () => {
    console.log("eraser clicked");
    this.setState({ color: "#FFFFFF"});
    this.ctx.lineWidth = 20;
    this.setState({ eraserClicked: "#a2eff5" });
    this.setState({ pencilClicked: "#FFFFFF" });
  }

  render() {
    //overwrite the default colors for palette
    const paletteColors = ['#000000', '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
                           '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A',
                           '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548'];
    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: this.state.color,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'absolute',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
        pencilStyle: {
          height: '25px',
          width: '25px',
          margin: '0px 0px 0px 10px',
          borderRadius: '5px',
          background: this.state.pencilClicked,
        },
        eraserStyle: {
          height: '25px',
          width: '25px',
          margin: '0px 0px 0px 10px',
          borderRadius: '5px',
          background: this.state.eraserClicked,
        },
        sample: {
          padding: '20px',
        },
      },
    });
    return (
      <Fragment>
      <div>
        <div style={ styles.swatch } onClick={ this.handleClick }>
          <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <CirclePicker colors={paletteColors} color={ this.state.color } onChange={ this.handleChange } />
        </div> : null }
        <img id="pencilImg" src={pencil} alt={'pencil'} style={styles.pencilStyle} onClick={this.onPencilClick}/>
        <img id="eraserImg" src={eraser} alt={'eraser'} style={styles.eraserStyle} onClick={this.onEraserClick}/>
      </div>
      <div style={{textAlign: 'center'}}>
        <canvas
        // We use the ref attribute to get direct access to the canvas element. 
          ref={(ref) => (this.canvas = ref)}
          style={{ background: 'white', border: '2px solid #33E0FF', position: 'relative'}}
          onMouseDown={this.onMouseDown}
          onMouseLeave={this.endPaintEvent}
          onMouseUp={this.endPaintEvent}
          onMouseMove={this.onMouseMove}

          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.endPaintEvent}
        />
      </div>
      </Fragment>
    );
  }
}
export default Canvas;