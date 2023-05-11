import { Grid } from '@chakra-ui/react';
import Announcements from './Announcements';
import Messages from './Messages';
import MonthAtAGlance from './MonthAtAGlance';
import React from 'react';

export default function HomePage() {

  return (
    <Grid>
      <div style={{ 'display': 'grid', 'gridTemplateRows': '1fr 1 fr', 'gridTemplateColumns': '1fr 1 fr', 'gap': '1%' }}>
        <MonthAtAGlance />
        <Announcements />
        <Messages />
      </div>
    </Grid>
  );
}
