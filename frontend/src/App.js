import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import LandingPage from './pages/landingPage';
import ChatRoom from './pages/chatPage';
import Discussions from './pages/discussion';
import LoginPage from './pages/loginPage';

function  App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/chatRoom' element={<ChatRoom/>} />
        <Route path='/discussions' element={<Discussions/>} />
      </Routes>
    </Router>
  );
}

export default App;
