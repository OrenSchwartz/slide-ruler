/**
 * Created by simba on 01/02/2018.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import s from './index.scss';
import format from 'string-format';

class SlideRuler extends React.Component {

  constructor() {
    super();
    this.state = {
      containerWidth: 320,
      canvasHeight: 83,
      canvasWidth: 320,
      boxColor: '#8b8b8b',
      scrollLeft: 0,
      heightDecimal: 35,
      heightDigit: 18,
      lineWidth: 2,
      colorDecimal: '#909090',
      colorDigit: '#b4b4b4',
      spaceBetweenLines: 10,
      fontSize: 20,
      fontColor: '#666666',
      maxValue: 230,
      minValue: 100,
      currentValue: 0,
      textFormat: '{0}',
      showMarker: true,
      markerBaseClassName: s.markerBase,
      markerLineClassName: s.markerLine,
      markerStyle: {},
      markerBaseStyle: {},
      markerLineStyle: {},
      markerColor: '#59AFFF',
      digitsToDecimal: 10,
      alignment: 'top',
    };

    this.initCanvas = this.initCanvas.bind(this);
    this.initState = this.initState.bind(this);
    this.drawRuler = this.drawRuler.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.getCurrentValueFromScroll = this.getCurrentValueFromScroll.bind(this);
  }

  componentDidMount(){
    setTimeout(() => {
      this.initCanvas(this.props);
    }, 0);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.currentValue != nextProps.currentValue){
      this.setState({
        currentValue: nextProps.currentValue
      },()=>{
        this.setPositionStart();
      })
    }
  }

  initCanvas(data){
    new Promise((resolve, reject)=>{
      resolve(this.initState(data))
    }).then(()=>{
      this.setPositionStart();
    })
  }

  initState(data){
    let maxValue = data.maxValue || this.state.maxValue;
    let minValue = data.minValue === undefined ?  this.state.minValue : data.minValue; // handle zero value bug
    let currentValue = data.currentValue || this.state.currentValue;
    let spaceBetweenLines = data.spaceBetweenLines || this.state.spaceBetweenLines
    let digitsToDecimal =  data.digitsToDecimal || this.state.digitsToDecimal;
    let precision = (maxValue - minValue) / (maxValue * digitsToDecimal);
    let containerWidth = data.containerWidth || ReactDOM.findDOMNode(this).offsetWidth;
    let canvasWidth = (maxValue/precision * spaceBetweenLines + containerWidth - minValue/precision * spaceBetweenLines) || this.state.canvasWidth;
    let scrollLeft = (currentValue - minValue) * spaceBetweenLines || this.state.scrollLeft;
    this.setState({
      containerWidth,
      canvasHeight: data.canvasHeight || this.state.canvasHeight,
      canvasWidth,
      scrollLeft,
      heightDecimal: data.heightDecimal || this.state.heightDecimal,
      heightDigit: data.heightDigit || this.state.heightDigit,
      lineWidth: data.lineWidth || this.state.lineWidth,
      colorDecimal: data.colorDecimal || this.state.colorDecimal,
      colorDigit: data.colorDigit || this.state.colorDigit,
      spaceBetweenLines: data.spaceBetweenLines || this.state.spaceBetweenLines,
      precision,
      fontSize: data.fontSize || this.state.fontSize,
      fontColor: data.fontSize || this.state.fontColor,
      maxValue: data.maxValue || this.state.maxValue,
      minValue: data.minValue === undefined ?  this.state.minValue : data.minValue, // handle zero value bug
      currentValue: data.currentValue || this.state.currentValue,
      boxColor: data.boxColor || this.state.boxColor,
      textFormat: data.textFormat || this.state.textFormat,
      showMarker: data.showMarker || this.state.showMarker,
      markerBaseClassName: data.markerBaseClassName || this.state.markerBaseClassName,
      markerLineClassName: data.markerLineClassName || this.state.markerLineClassName,
      markerColor: data.markerColor || this.state.markerColor,
      markerBaseStyle: {borderBottomColor: data.markerColor || this.state.markerColor, ...data.markerStyle, ...data.markerBaseStyle} || this.state.markerBaseStyle,
      markerLineStyle: {backgroundColor: data.markerColor || this.state.markerColor, ...data.markerStyle, ...data.markerLineStyle} || this.state.markerLineStyle,
      digitsToDecimal,
      alignment: data.alignment || this.state.alignment
    },()=>{
      this.drawRuler();
    })
  }

  drawRuler(){
    /* 1.定义变量 */

    // 1.1 定义原点，x轴方向起点与终点各留半屏空白
    if (['top','bottom'].indexOf(this.state.alignment) === -1 ){
      throw new Error('alignment must only be to "top" or "bottom"')
    }
    let origin = { x: this.state.containerWidth, y: ((this.state.alignment == 'top') ? 0 : this.state.canvasHeight * 2 )}
    // 1.2 定义刻度线样式
    let heightDecimal = this.state.heightDecimal * 2;
    let heightDigit = this.state.heightDigit * 2;
    let colorDecimal = this.state.colorDecimal;
    let colorDigit = this.state.colorDigit;
    // 1.3 定义刻度字体样式
    let fontSize = this.state.fontSize * 2;
    let fontColor = this.state.fontColor;
    // 1.4 总刻度值
    let maxValue = this.state.maxValue,minValue = this.state.minValue;
    // 1.5 每个刻度所占位的px
    let spaceBetweenLines = this.state.spaceBetweenLines * 2;
    // 1.6定义每个刻度的精度
    let precision = this.state.precision;
    let textFormat = this.state.textFormat;
    let digitsToDecimal = this.state.digitsToDecimal;
    let derivative = 1 / precision;    
    /* 2.绘制 */

    // 2.1初始化context
    let canvas = this.refs.SlideRuler,
        context = canvas.getContext('2d');
    // 遍历maxValue
    for (var i = minValue/precision; i <= maxValue/precision; i++) {
      context.beginPath();
      // 2.2 画刻度线
      context.moveTo(origin.x + (i - minValue/precision) * spaceBetweenLines, origin.y);
      // 画线到刻度高度，10的位数就加高
      let y = (i % digitsToDecimal == 0) ? Math.abs(origin.y - heightDecimal) : Math.abs(origin.y - heightDigit);
      let x = origin.x + (i - minValue/precision) * spaceBetweenLines;
      context.lineTo(x, y);
      // 设置属性
      context.lineWidth = this.state.lineWidth  * 2;
      // 10的位数就加深
      context.strokeStyle = (i % digitsToDecimal == 0) ? colorDecimal : colorDigit;
      // 描线
      context.stroke();
      // 2.3 描绘刻度值
      context.fillStyle = fontColor;
      context.textAlign = "center";
      context.textBaseline = "top";
      if (i % digitsToDecimal == 0) {
        context.font = `${fontSize}px Arial`;
        const value = Math.round(i / digitsToDecimal) /// (derivative / digitsToDecimal)
        const textPosition = { 
          x: origin.x + (i - minValue/precision) * spaceBetweenLines, 
          y: (this.state.alignment == 'top' ? heightDecimal : this.state.canvasHeight - this.state.heightDecimal)  
        }
        const text = typeof(textFormat) === 'function' ? textFormat(value) : format(textFormat, value)
        context.fillText(text, textPosition.x , textPosition.y);
      }
      context.closePath();
    }
  }

  handleScroll(e){
    this.getCurrentValueFromScroll(e.target.scrollLeft)
  }

  //通过滚动计算当前值
  getCurrentValueFromScroll(scrollLeft){
    const { minValue, precision, digitsToDecimal, spaceBetweenLines } = this.state;
    const unitNumber = scrollLeft / spaceBetweenLines;
    const currentValue = unitNumber * precision
    this.props.getCurrentValue && this.props.getCurrentValue(currentValue);
  }

  //通过当前值计算滚动距离
  setPositionStart(){
    this.refs.rulerBox.scrollLeft = 0;
  }

  render() {
    const { showMarker, markerBaseClassName, markerLineClassName, markerBaseStyle, markerLineStyle } = this.state;
    return (
      <div className={`${this.props.className} ${s.container}`}>
        <div className={s.rulerBox} style={{borderColor: this.state.boxColor}} onScroll={this.handleScroll} ref='rulerBox'>
            <canvas 
              ref='SlideRuler'
              style={{width:this.state.canvasWidth,height:this.state.canvasHeight}} 
              width={this.state.canvasWidth * 2} 
              height={this.state.canvasHeight * 2}
            />
            {
              showMarker 
              ? <div>
                  <div className={markerBaseClassName} style={markerBaseStyle}/>
                  <div className={markerLineClassName} style={markerLineStyle}/>
                </div> 
              : null
            }
        </div>
      </div>
    );
  }
}

export default SlideRuler;

