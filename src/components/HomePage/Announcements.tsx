import React, { useState } from 'react';
import { Card, Alert, Image, Button } from 'react-bootstrap';
import { defaultColors } from '../../constants';
import { IconContext } from 'react-icons';
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
        <Card.Header as='h5' style={{ 'backgroundColor': defaultColors.BREAKTIME_BLUE, 'color': 'white', 'display': 'flex', 'gap': '1%', 'alignItems': 'center' }}>
          <IconContext.Provider value={{ color: 'white' }}>
            <TfiAnnouncement />
          </IconContext.Provider>
          Announcements
        </Card.Header>
        <Card.Body>
          {events[0] ?
            <div>
              {events.map((event, index) => (
                <Alert key={index} style={{ 'display': 'flex', 'gap': '1%', 'alignItems': 'center' }}>
                  <Image src={event.photo} alt={event.name} rounded={true} style={{ 'width': '10%', 'height': 'auto' }} />
                  {`${event.date}: ${event.name}`}
                  <Button target='_blank' href={event.url} style={{ 'backgroundColor': defaultColors.BREAKTIME_BLUE, 'borderWidth': '0px' }}>Register</Button>
                </Alert>))}
            </div>
            : 'No announcements'}
        </Card.Body>
      </Card>
    </div>);
}