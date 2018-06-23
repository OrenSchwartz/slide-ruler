/**
 * Created by simba on 09/11/2017.
 */
import React from 'react';
import s from './index.scss';
import SlideRuler from '../../../components/index.js';

class IndexPage extends React.Component {

  constructor() {
    super();

    this.state = {
      currentValue: 0
    };

    this.getCurrentValue = this.getCurrentValue.bind(this);
  }

  getCurrentValue(currentValue){
    this.setState({
      currentValue:currentValue
    })
  }

  render() {

    return (
      <div className={s.container}>
        <p className={s.currentValue}>{this.state.currentValue}</p>
        <SlideRuler getCurrentValue={this.getCurrentValue}
                    maxValue={24}
                    minValue={0}
                    boxColor='black'
                    spaceBetweenLines={20}
                    digitsToDecimal={6}
                    textFormat='{0}:00'
                    markerColor='#edcd1f'
                    markerStyle={{
                      width: 3,
                      borderRadius: 100,
                    }}
                    fontSize={18}
                    precision={0.1}/>
      </div>
    );
  }
}

export default IndexPage;

