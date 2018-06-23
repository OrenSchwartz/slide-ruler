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
                    textFormat={(value) => {
                      let ampm = value / 12 < 1 ? 'AM' : 'PM';
                      let ampmValue = value % 12;
                      if (ampm == 'PM' && value == 12) { ampmValue = 12 ;}
                      if (ampm == 'PM' && value == 24) { ampm = 'AM' ;}
                      return `${ampmValue}:00 ${ampm}`
                    }}
                    markerColor='#edcd1f'
                    markerStyle={{
                      width: 3,
                      borderRadius: 100,
                    }}
                    fontSize={18}
                    alignment='bottom'
                    />
      </div>
    );
  }
}

export default IndexPage;

