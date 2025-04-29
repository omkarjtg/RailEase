import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { addLocation } from '../services/LocationService';
import '../styles/AddTrains.css';

const AddLocationForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [flashMessage, setFlashMessage] = useState('');

  const validationSchema = Yup.object({
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    postalCode: Yup.string().required('Postal code is required'),
    stationCode: Yup.string()
      .required('Station code is required')
      .max(5, 'Station code must be at most 5 characters')
      .matches(/^[A-Z0-9]+$/, 'Only uppercase letters and numbers allowed')
  });

  const initialValues = {
    city: '',
    state: '',
    postalCode: '',
    stationCode: ''
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await addLocation(values);
      console.log('Location added successfully:', response.data);
      resetForm();
      setFlashMessage('Location added successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to add location:', error);
      setFlashMessage(error.response?.data?.message || 'Failed to add location.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-train-container">
      <h2>Add Location</h2>
      {flashMessage && (
        <div className={`alert ${flashMessage.includes('success') ? 'alert-success' : 'alert-danger'}`}>
          {flashMessage}
        </div>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="train-form">
            <Row className="mb-3">
              <Col md={6}>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <Field
                    type="text"
                    name="city"
                    className="form-control"
                    placeholder="Enter City"
                  />
                  <ErrorMessage name="city" component="div" className="text-danger" />
                </div>
              </Col>

              <Col md={6}>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <Field
                    type="text"
                    name="state"
                    className="form-control"
                    placeholder="Enter State"
                  />
                  <ErrorMessage name="state" component="div" className="text-danger" />
                </div>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <Field
                    type="text"
                    name="postalCode"
                    className="form-control"
                    placeholder="Enter Postal Code"
                  />
                  <ErrorMessage name="postalCode" component="div" className="text-danger" />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-group">
                  <label htmlFor="stationCode">Station Code</label>
                  <Field
                    type="text"
                    name="stationCode"
                    className="form-control"
                    placeholder="Enter Station Code (e.g., NDLS)"
                    onInput={(e) => {
                      e.target.value = e.target.value.toUpperCase();
                    }}
                  />
                  <ErrorMessage name="stationCode" component="div" className="text-danger" />
                  <small className="text-muted">Use official railway station codes (3-5 uppercase letters)</small>
                </div>
              </Col>
            </Row>

            <Button variant="primary" type="submit" disabled={isSubmitting} className="submit-btn">
              {isSubmitting ? 'Submitting...' : 'Add Location'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddLocationForm;