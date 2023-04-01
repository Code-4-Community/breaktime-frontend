// import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';

// import AuthWrapper from "../Auth/AuthWrapper";

import Announcements from './Announcements';
import Messages from './Messages';

export default function HomePage() {

  return (
    <div style={{ 'display': 'flex' }}>
      <header className="App-header">
        <Announcements/>
        <Messages/>
      </header>
    </div>
  );
}
