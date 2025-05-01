import './App.css';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './partials/Navbar';
import Popup from './partials/Popup';
import BookingForm from './Pages/BookingForm';
import BookingDetails from './Pages/MyBookings';
import BookingDetail from './Pages/BookingDetail'
import TrainList from './Pages/TrainList';
import AddTrains from './Pages/AddTrains';
import AboutUs from './Pages/AboutUs';
import FeedbackForm from './Pages/Feedback';
import AllLocations from './Pages/Locations';
import HomePage from './Pages/Home';
import UpdateTrainForm from './Pages/UpdateTrainForm';
import ResetPassword from './partials/ResetPassword';
import ProtectedRoute from './utils/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import { getAllTrains } from './services/TrainService';
import BackendError from './partials/BackendError';
import Profile from './Pages/Profile'; // Import the Profile component

function App() {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Add user state
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error checking user session:', err);
      }
    };
    checkUserSession();
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const data = await getAllTrains();
        setTrains(data);
      } catch (error) {
        setError('Error fetching trains: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrains();
  }, []);

  const handlePopupClose = () => {
    setShowAuthPopup(false);
    navigate('/');
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData); // Store user data
    localStorage.setItem('user', JSON.stringify(userData));
    setShowAuthPopup(false);
    navigate('/');
  };

  if (loading) {
    return <div>Loading trains...</div>;
  }

  if (error) {
    return <BackendError message={error} />;
  }

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book" element={<BookingForm train={trains[0]} />} />
        <Route
          path="/myBookings"
          element={user ? <BookingDetails user={user} /> : <Navigate to="/login" replace />}
        />
        <Route path="/bookings/:id" element={<BookingDetail />} />
        <Route path="/trains" element={<TrainList trains={trains} />} />
        <Route
          path="/addTrains"
          element={<ProtectedRoute element={<AddTrains />} allowedRoles={['ADMIN']} />}
        />
        <Route path="/update-train/:trainId" element={<UpdateTrainForm />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route
          path="/feedback"
          element={
            user ? (
              <FeedbackForm user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="/location" element={<AllLocations />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Redirecting unwanted routes */}
        <Route path="/login" element={<Popup />} />
        <Route path="/register" element={<Popup />} />
        <Route path="/forgot-password" element={<Popup />} />
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