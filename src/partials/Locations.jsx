import React from 'react';
import './Location.css';
const AllLocations = () => {
  const locations = [
    { id: 1, city: 'Mumbai', description: 'The city of dreams' },
    { id: 2, city: 'Pune', description: 'The Oxford of the East' },
    { id: 3, city: 'Indore', description: 'Mini Mumbai' },
    { id: 4, city: 'Vadodara', description: 'Cultural Capital of Gujarat' },
    { id: 5, city: 'Panji', description: 'The Party Capital' },
    { id: 6, city: 'New Delhi', description: 'The Heart of India' },
    { id: 7, city: 'Jaipur', description: 'The Pink City' },
    { id: 8, city: 'Banglore', description: 'The Silicon Valley of India' },
    { id: 9, city: 'Darjeeling', description: 'The Queen of the Hills' },
    { id: 10, city: 'Dehradun', description: 'The Gateway to the Garhwal' },
  ];

  const handleUpdate = (id) => {
    console.log(`Update location with ID: ${id}`);
  };

  const handleRemove = (id) => {
    console.log(`Remove location with ID: ${id}`);
  };

  return (
    <div id="container">
      <h1 >All Locations</h1>
      <table >
        <thead>
          <tr>
            <th >City</th>
            <th>Description</th>
            <th >Action</th>
          </tr>
        </thead>
        <tbody>
          {locations.map(location => (
            <tr key={location.id}>
              <td >{location.city}</td>
              <td >{location.description}</td>
              <td >
                <div>
                  <button id='btn1' onClick={() => handleUpdate(location.id)}>Update</button>
                  <button id='btn2' onClick={() => handleRemove(location.id)}>Remove</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default AllLocations;
