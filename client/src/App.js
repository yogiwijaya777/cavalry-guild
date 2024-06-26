import './App.css';
import Login from './routes/Login';
import NotFound from './routes/NotFound';
import TopDecks from './routes/TopDecks';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SingleDeck from './routes/SingleDeck';
import Header from './components/Header';
import SignUp from './routes/SignUp';
import Footer from './components/Footer';
import Home from './routes/Home';
function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="/top-decks" element={<TopDecks />} />
            <Route path="/decks/:id" element={<SingleDeck />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
