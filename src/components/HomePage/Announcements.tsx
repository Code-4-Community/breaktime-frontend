import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Alert, Image, Button, Icon, Flex, VStack, Spacer } from '@chakra-ui/react';
import { defaultColors } from '../../constants';
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
    <Flex gridArea={'Announcements'}>
      <Card width={'100%'} rounded={'lg'}>
        <CardHeader as='h5' backgroundColor={defaultColors.BREAKTIME_BLUE} color={'white'} rounded={'lg'}>
          <Flex gap={'1%'}>
            <Icon as={TfiAnnouncement} />
            Announcements
          </Flex >
        </CardHeader>
        <CardBody>
          {events[0] ?
            <VStack>
              {events.map((event, index) => (
                <Alert key={index} display={'flex'} gap={'1%'} alignItems={'center'} rounded={'lg'}>
                  <Image src={event.photo} width={'10%'} />
                  {`${event.date}: ${event.name}`}
                  <Spacer />
                  <Button as='a' href={event.url} target='_blank' backgroundColor={defaultColors.BREAKTIME_BLUE}
                    borderWidth={'0px'} color={'white'}>Register</Button>
                </Alert>))}
            </VStack>
            : 'No announcements'}
        </CardBody>
      </Card>
    </Flex>
  );
}