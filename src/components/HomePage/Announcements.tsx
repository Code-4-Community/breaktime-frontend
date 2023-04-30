import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Alert, Image, Button, Icon } from '@chakra-ui/react';
import { defaultColors } from '../../utils';
import { TfiAnnouncement } from 'react-icons/tfi';

const SAMPLE_EVENT_LIST = [
  { name: 'LinkedIn Workshop', photo: 'https://schooloflanguages.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg', url: 'https://www.linkedin.com/', date: '2/30/2023' },
  { name: 'Resume Workshop', photo: 'https://www.seinstitute.com/wp-content/uploads/2020/01/placeholder-female-300x300-1.jpg', url: 'https://en.wikipedia.org/wiki/Capybara', date: '4/31/2023' }];

export default function Announcements() {
  const [events, setEvents] = useState(SAMPLE_EVENT_LIST);

  // const addEvent = (event: { name: String, photo: String, url: String, date: String }) => {
  //   const eventsCopy = events.push(event);
  //   setEvents([...events, event]);
  // };

  return (
    <div className='announcements' style={{ 'display': 'flex', 'gridColumnStart': 1, 'gridRowStart': 2 }}>
      <Card style={{ 'width': '100%' }}>
        <CardHeader as='h5' style={{ 'backgroundColor': defaultColors.BREAKTIME_BLUE, 'color': 'white', 'display': 'flex', 'gap': '1%', 'alignItems': 'center' }}>
          <Icon as={TfiAnnouncement} />
          Announcements
        </CardHeader>
        <CardBody>
          {events[0] ?
            <div>
              {events.map((event, index) => (
                <Alert key={index} style={{ 'display': 'flex', 'gap': '1%', 'alignItems': 'center' }}>
                  <Image src={event.photo} />
                  {`${event.date}: ${event.name}`}
                  <Button style={{ 'backgroundColor': defaultColors.BREAKTIME_BLUE, 'borderWidth': '0px' }}>Register</Button>
                </Alert>))}
            </div>
            : 'No announcements'}
        </CardBody>
      </Card>
    </div>);
}