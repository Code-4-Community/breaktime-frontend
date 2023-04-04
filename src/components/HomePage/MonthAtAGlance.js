import React, { useState } from 'react';
import { Card, Alert, Button } from 'react-bootstrap';
import { defaultColors } from '../../utils';
import {data, dataBar} from './dummyData';

import { IconContext } from 'react-icons';
import { BsFillFileBarGraphFill } from 'react-icons/bs';

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Pie, Bar } from 'react-chartjs-2';

Chart.register(CategoryScale);

export default function MonthAtAGlance() {

  return (
    <div className='monthAtAGlance' style={{ 'display': 'flex', 'width': '50%' }}>
      <Card>
        <Card.Header as='h5' style={{ 'backgroundColor': defaultColors.BREAKTIME_BLUE, 'color': 'white' }}>
          <IconContext.Provider value={{ color: 'white' }}>
            <BsFillFileBarGraphFill />
          </IconContext.Provider>
          Month at a Glance
        </Card.Header>
        <Card.Body style={{ 'display': 'flex', 'flexDirection': 'row', 'justifyContext': 'spaceBetween', 'width': '100%', 'height': 'auto' }}>
          <Pie data={data} />
          <Bar data={dataBar} />
        </Card.Body>
      </Card>
    </div>);
}