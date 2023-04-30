import React from 'react';
import { Card, CardHeader, CardBody, Icon } from '@chakra-ui/react';
import { defaultColors } from '../../utils';
import { data, dataBar } from './dummyData';

import { IconContext } from 'react-icons';
import { BsFillFileBarGraphFill } from 'react-icons/bs';

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

Chart.register(CategoryScale);

export default function MonthAtAGlance() {

  return (
    <div className='monthAtAGlance' style={{ 'display': 'flex', 'gridColumnStart': 1, 'gridRowStart': 1 }}>
      <Card style={{ 'width': '100%' }}>
        <CardHeader as='h5' style={{ 'backgroundColor': defaultColors.BREAKTIME_BLUE, 'color': 'white', 'display': 'flex', 'gap': '1%', 'alignItems': 'center' }}>
            <Icon as={BsFillFileBarGraphFill} />
          Month at a Glance
        </CardHeader>
        <CardBody style={{ 'display': 'flex', 'justifyContent': 'space-around', 'alignItems': 'center' }}>
          <div style={{ 'width': '1fr' }}>
            <Pie data={data} />
          </div>
          <div style={{ 'width': '1fr' }}>
            <Bar data={dataBar} />
          </div>
        </CardBody>
      </Card>
    </div>);
}