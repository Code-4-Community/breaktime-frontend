// import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';

// import AuthWrapper from "../Auth/AuthWrapper";

import Announcements from './Announcements';
import Messages from './Messages';
import MonthAtAGlance from './MonthAtAGlance';

export default function HomePage() {

  return (
    <div style={{ 'display': 'flex', 'flexDirection': 'row', 'justifyContext': 'spaceBetween'}}>
      <div style={{ 'display': 'flex', 'flexDirection': 'column', 'justifyContext': 'spaceBetween' }}>
        <MonthAtAGlance />
        <Announcements />
      </div>
      <Messages />
    </div>
  );
}
