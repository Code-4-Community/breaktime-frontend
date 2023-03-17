import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';

import AuthWrapper from "../Auth/AuthWrapper"; 

export default function HomePage() {
  return (
    <div className="App"> 
      <header className="App-header">
        <a href="/timecard">Timesheet</a>
      </header>
    </div>
  ); 
}
