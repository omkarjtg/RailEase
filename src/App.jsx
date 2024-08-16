import Navbar from './partials/Navbar';
import Popup from './partials/Popup';
import BookingForm from './partials/BookingForm';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Search from './partials/Search';
import ForgetPassword from './partials/ForgetPassword';
import AddTrains from './partials/AddTrains';
import Aboutus from './partials/Aboutus';
import MyBookings from './partials/MyBookings';
import Home from './partials/Home';
import ViewScheduledTrain from './partials/ViewScheduledTrain';

function App() {
  return (
    <>
      <Router>
        <Navbar /> {/* Navbar will be present on all pages */}
        <Routes>
          <Route path="/trains" element={<BookingForm />} />
          <Route path="/results" element={<Search />} />
          <Route path="/popup" element={<Popup />} /> {/* Assuming you want to route to Popup */}
          <Route path='/ForgetPassword' element={<ForgetPassword/>}/>
          <Route path='/addtrains' element={<AddTrains/>}/>
          <Route path='/aboutus' element={<Aboutus/>}/>
          <Route path='/mybookings' element={<MyBookings/>}/>
          <Route path='/Home' element={<Home/>}/>
          <Route path='/schedule' element={<ViewScheduledTrain/>}/>

        </Routes>
      </Router>
    </>
  );
}

export default App;
