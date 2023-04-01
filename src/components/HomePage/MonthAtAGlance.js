import React, { useState } from 'react';
import { Card, Alert, Button } from 'react-bootstrap';
import BREAKTIME_BLUE from '../../utils';
import { IconContext } from 'react-icons';
import { BsFillFileBarGraphFill } from 'react-icons/bs';

export default function MonthAtAGlance() {
  return (
    <div className='monthAtAGlance' style={{ 'display': 'flex' }}>
      <Card>
        <Card.Header as='h5' style={{ 'backgroundColor': BREAKTIME_BLUE, 'color': 'white' }}>
          <IconContext.Provider value={{ color: 'white' }}>
            <BsFillFileBarGraphFill />
          </IconContext.Provider>
          Month at a Glance
        </Card.Header>
        <Card.Body>
        </Card.Body>
      </Card>
    </div>);
}