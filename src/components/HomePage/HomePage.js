import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';


function HomePage() {
  return (
    <div className="App"> 
      <header className="App-header">
        <a href="/timecard">Timesheet</a>
      </header>
    </div>
  ); 
}


export default withAuthenticator(HomePage);
