
import ApiClient from '../Auth/apiClient'; 

export default function HomePage() {
    ApiClient.signout() 
  return (
    <div className="App"> 
      <header className="App-header">
        <h3>Logged out</h3>
        
      </header>
    </div>
  ); 
}
