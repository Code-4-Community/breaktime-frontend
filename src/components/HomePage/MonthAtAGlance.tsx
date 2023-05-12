import React from 'react';
import { Card, CardHeader, CardBody, Icon, Flex, Container } from '@chakra-ui/react';
import { defaultColors } from '../../constants';
import { data, dataBar } from './dummyData';
import { BsFillFileBarGraphFill } from 'react-icons/bs';

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

Chart.register(CategoryScale);

export default function MonthAtAGlance() {

  return (
    <Flex gridColumnStart={1} gridRowStart={1}>
      <Card width={'100%'} rounded={'lg'}>
        <CardHeader as='h5' backgroundColor={defaultColors.BREAKTIME_BLUE} color={'white'} rounded={'lg'}>
          <Flex gap={'1%'}>
            <Icon as={BsFillFileBarGraphFill} />
            Month at a Glance
          </Flex >
        </CardHeader>
        <CardBody>
          <Flex alignItems={'center'} justifyContent={'space-around'}>
            <Container width={'1fr'}>
              <Pie data={data} />
            </Container>
            <Container width={'1fr'}>
              <Bar data={dataBar} />
            </Container>
          </Flex>
        </CardBody>
      </Card>
    </Flex >);
}