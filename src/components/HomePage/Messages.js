import React, { useState } from 'react';
import { Card, Alert, Button, CloseButton } from 'react-bootstrap';
import BREAKTIME_BLUE from '../../utils';
import { IconContext } from 'react-icons';
import { BiMessageDetail } from 'react-icons/bi';

const SAMPLE_MESSAGES_LIST = [
  { type: 'Reminder', body: 'Submit timesheet for 11/6-11/12' },
  { type: 'Approved', body: 'Timesheet for 10/30-11/5 by SUPERVISOR' }];

export default function Messages() {
  const [messages, setMessages] = useState(SAMPLE_MESSAGES_LIST);

  const addMessage = (message) => {
    setMessages(messages.push(message));
  };

  const deleteMessage = (delMessage) => {
    setMessages(messages.filter(message => (message.body !== delMessage.body)));
  };

  return (
    <div className='messages' style={{ 'display': 'flex' }}>
      <Card>
        <Card.Header as='h5' style={{ 'backgroundColor': BREAKTIME_BLUE, 'color': 'white' }}>
          <IconContext.Provider value={{ color: 'white' }}>
            <BiMessageDetail />
          </IconContext.Provider>
          Messages
        </Card.Header>
        <Card.Body>
          {messages[0] ?
            <div>
              {messages.map((message, index) => (
                <Alert key={index}>
                  <CloseButton />
                  {message.type + ': ' + message.body}
                  <Button href={message.url} style={{ 'backgroundColor': BREAKTIME_BLUE, 'borderWidth': '0px' }}>View</Button>
                </Alert>))}
            </div>
            : 'No messages'}
        </Card.Body>
      </Card>
    </div>);
}