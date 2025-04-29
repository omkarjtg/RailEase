import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AddTrains.css';
import { updateLocation } from '../services/LocationService';

const UpdateLocationForm = ({ locationToEdit, onSuccess, onCancel }) => {
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
        city: locationToEdit.city || '',
        state: locationToEdit.state || '',
        postalCode: locationToEdit.postalCode || '',
        stationCode: locationToEdit.stationCode || ''
    };

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            await updateLocation(locationToEdit.id, values);
            toast.success('Location updated successfully!');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Failed to update location:', error);
            toast.error(error.response?.data?.message || 'Failed to update location.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="add-train-container">
            <h2>Update Location</h2>
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

                        <div className="form-actions">
                            <Button variant="primary" type="submit" disabled={isSubmitting} className="submit-btn">
                                {isSubmitting ? 'Updating...' : 'Update Location'}
                            </Button>
                            <Button variant="secondary" onClick={onCancel} className="cancel-btn">
                                Cancel
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default UpdateLocationForm;