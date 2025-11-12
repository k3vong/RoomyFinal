import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomyLanding from './LandingPage/RoomyLanding';
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import SignUp from './SignUp/Signup';
import Apartments from './Apartments/Apartments';
import Chores from './Chores/Chores';
import Payments from './Payments/Payments';
import Roommates from './Roommates/Roommates';
// import Search from './Search'; // example destination after login

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoomyLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Dashboard />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/chores" element={<Chores />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/roommates" element={<Roommates />} />
        {/* <Route path="/search" element={<Search />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
