import './App.css';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './partials/Navbar';
import Popup from './partials/Popup';
import BookingForm from './Pages/BookingForm';
import BookingDetails from './Pages/MyBookings';
import TrainList from './Pages/TrainList';
import AddTrains from './Pages/AddTrains';
import AboutUs from './Pages/AboutUs';
import FeedbackForm from './Pages/Feedback';
import AllLocations from './Pages/Locations';
import ScheduledTrains from './Pages/ScheduledTrain';
import Search from './partials/SearchResults';
import MockBookedPage from './Pages/MockBookedPage';
import HomePage from './Pages/Home';
import UpdateTrainForm from './Pages/UpdateTrainForm';
import ResetPassword from './partials/ResetPassword';
import ProtectedRoute from './utils/ProtectedRoute'; // Import the ProtectedRoute component

function App() {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', or 'forgot'
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle auth-related routes through the popup
    if (location.pathname === '/login') {
      setShowAuthPopup(true);
      setAuthMode('login');
    } else if (location.pathname === '/register') {
      setShowAuthPopup(true);
      setAuthMode('register');
    } else if (location.pathname === '/forgot-password') {
      setShowAuthPopup(true);
      setAuthMode('forgot');
    } else {
      setShowAuthPopup(false);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname === '/trains' || location.pathname === '/results') {
      document.body.classList.add('no-background');
    } else {
      document.body.classList.remove('no-background');
    }
  }, [location]);

  const handlePopupClose = () => {
    setShowAuthPopup(false);
    navigate('/');
  };

  const handleAuthSuccess = (userData) => {
    setShowAuthPopup(false);
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/myBookings/:userId" element={<BookingDetails />} />
        <Route path="/results" element={<Search />} />
        <Route path="/trains" element={<TrainList />} />
        
        {/* Protected Route for AddTrains */}
        <Route 
          path="/addTrains" 
          element={<ProtectedRoute element={<AddTrains />} allowedRoles={['ADMIN']} />} 
        />
        
        <Route path="/update-train/:trainId" element={<UpdateTrainForm />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/scheduled" element={<ScheduledTrains />} />
        <Route path="/booked" element={<MockBookedPage />} />
        <Route path="/location" element={<AllLocations />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Redirects for auth paths */}
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="/register" element={<Navigate to="/" />} />
        <Route path="/forgot-password" element={<Navigate to="/" />} />
      </Routes>
      <Popup
        show={showAuthPopup}
        onClose={handlePopupClose}
        onLoginSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    </>
  );
}

export default App;
