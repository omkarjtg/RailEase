import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './partials/Navbar';
import Popup from './partials/Popup';
import BookingForm from './Pages/BookingForm';
import './App.css';
import Search from './partials/Search';
import TrainList from './Pages/TrainList';
import AddTrains from './Pages/AddTrains';
import AboutUs from './Pages/AboutUs';
import FeedbackForm from './Pages/Feedback';

function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/trains') {
      document.body.classList.add('no-background');
    }
    else if(location.pathname === '/results') {
      document.body.classList.add('no-background');

    } else {
      document.body.classList.remove('no-background');
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/book" element={<BookingForm />} />
        <Route path="/results" element={<Search />} />
        <Route path="/popup" element={<Popup />} />
        <Route path="/trains" element={<TrainList />} />
        <Route path="/addTrains" element={<AddTrains/>}/>
        <Route path="/aboutUs" element={<AboutUs/>}/>
        <Route path="/feedback" element={<FeedbackForm/>}/>
      </Routes>
    </>
  );
}

export default App;
