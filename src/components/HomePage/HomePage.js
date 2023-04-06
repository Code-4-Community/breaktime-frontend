import Announcements from './Announcements';
import Messages from './Messages';
import MonthAtAGlance from './MonthAtAGlance';

export default function HomePage() {

  return (
    <div style={{ 'display': 'grid', 'gridTemplateRows': 'minmax(max-content, 1fr) minmax(max-content, 1fr)', 'gridTemplateColumns': 'minmax(max-content, 1fr) minmax(max-content, 1fr)', 'gap': '1%' }}>
      <MonthAtAGlance />
      <Announcements />
      <Messages />
    </div>
  );
}
