import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Alert, Button, CloseButton, Icon } from '@chakra-ui/react';
import { defaultColors } from '../../utils';
import { BiMessageDetail } from 'react-icons/bi';

enum MessageTypes {
  Reminder = "Reminder",
  Approved = "Approved"
};

const SAMPLE_MESSAGES_LIST = [
  { type: MessageTypes.Reminder, body: 'Submit timesheet for 11/6-11/12' },
  { type: MessageTypes.Approved, body: 'Timesheet for 10/30-11/5 by SUPERVISOR' }];

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
        <CardHeader as='h5' style={{ 'backgroundColor': defaultColors.BREAKTIME_BLUE, 'color': 'white', 'display': 'flex', 'gap': '1%', 'alignItems': 'center' }}>
            <Icon as={BiMessageDetail} />
          Messages
        </CardHeader>
        <CardBody>
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
        </CardBody>
      </Card>
    </div>);
}