import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/login';
import SignUp from './components/signUp';
import Dashboard from './components/dashboard';
import Filepreview from './components/file-preview';
import "react-toastify/dist/ReactToastify.css";
console.log("Started1");
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:id" element={<Filepreview />} />
      </Routes>
    </Router>
  );
}

export default App;
