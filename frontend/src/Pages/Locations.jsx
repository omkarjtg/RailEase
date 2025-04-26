import React, { useState, useEffect } from 'react';
import './Location.css';
import AddLocationForm from './AddLocation';
import LocationService from '../services/LocationService';

const AllLocations = () => {
  const [locations, setLocations] = useState([]);
  const [flashMessage, setFlashMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.isAdmin) {
    return <div className='ErrorWindow'>ERROR 403 FORBIDDEN
      <br /> Access denied. You must be an admin to view this page.</div>;
  }

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getAllLocations();
        console.log('Fetched locations:', data);
        if (Array.isArray(data)) {
          setLocations(data);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleRemove = async (id) => {
    try {
      await deleteLocation(id);
      setLocations(locations.filter(location => location.id !== id));
      setFlashMessage('Location removed successfully!');
    } catch (error) {
      console.error(`Error removing location with ID: ${id}`, error);
      setFlashMessage('Failed to remove location.');
    }
  };

  const handleFormSuccess = () => {
    const fetchLocations = async () => {
      try {
        const data = await getAllLocations();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  };

  return (
    <div id="container">
      <h1>Locations</h1>
      {flashMessage && <div className="alert alert-info">{flashMessage}</div>}
      <AddLocationForm onSuccess={handleFormSuccess} />

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th>Postal Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {locations.length > 0 ? (
            locations.map(location => (
              <tr key={location.id}>
                <td>{location.city}</td>
                <td>{location.state}</td>
                <td>{location.country}</td>
                <td>{location.postalCode}</td>
                <td>
                  <div>
                    <button id='locationBtnRemove' className='btn btn-danger' onClick={() => handleRemove(location.id)}>Remove</button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No locations available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllLocations;
