import React, { useState } from 'react';
import { Card, Alert, Button, CloseButton } from 'react-bootstrap';
import { defaultColors } from '../../utils';
import { IconContext } from 'react-icons';
import { BiMessageDetail } from 'react-icons/bi';

const SAMPLE_MESSAGES_LIST = [
  { type: 'Reminder', body: 'Submit timesheet for 11/6-11/12' },
  { type: 'Approved', body: 'Timesheet for 10/30-11/5 by SUPERVISOR' }];

export default function Messages() {
  const [messages, setMessages] = useState(SAMPLE_MESSAGES_LIST);

  // const addMessage = (message) => {
  //   setMessages(messages.push(message));
  // };

  const deleteMessage = (index) => {
    const delMessage = [...messages];
    delMessage.splice(index, 1);
    setMessages(delMessage)
  };

  return (
    <div className='messages' style={{ 'display': 'flex', 'gridColumnStart': 2, 'gridRowStart': 1, 'gridRowEnd': 3 }}>
      <Card style={{ 'width': '100%' }}>
        <Card.Header as='h5' style={{ 'backgroundColor': defaultColors.BREAKTIME_BLUE, 'color': 'white', 'display': 'flex', 'gap': '1%', 'alignItems': 'center' }}>
          <IconContext.Provider value={{ color: 'white' }}>
            <BiMessageDetail />
          </IconContext.Provider>
          Messages
        </Card.Header>
        <Card.Body>
          {messages[0] ?
            <div>
              {messages.map((message, index) => (
                <Alert key={index} style={{ 'display': 'flex', 'gap': '1%', 'alignItems': 'center' }}>
                  <CloseButton onClick={() => deleteMessage(index)} />
                  {message.type + ': ' + message.body}
                  <Button style={{ 'backgroundColor': defaultColors.BREAKTIME_BLUE, 'borderWidth': '0px' }}>View</Button>
                </Alert>))}
            </div>
            : 'No messages'}
        </Card.Body>
      </Card>
    </div>);
}