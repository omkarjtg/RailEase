import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { MdSwapVert } from "react-icons/md";
import API from '../services/axios';
import './BookingForm.css';

const BookingForm = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formik = useFormik({
        initialValues: {
            from: '',
            to: '',
            date: '',
            personWithDisability: false,
            flexibleWithDate: false,
            trainWithAvailableBerth: false,
            railwayPassConcession: false
        },
        validationSchema: Yup.object({
            from: Yup.string().required('Departure station is required'),
            to: Yup.string()
                .required('Destination station is required')
                .notOneOf([Yup.ref('from')], 'Departure and destination must be different'),
            date: Yup.date()
                .required('Date is required')
                .min(new Date(), 'Date cannot be in the past')
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError(null);
            try {
                const response = await API.post('/booking', {
                    from: values.from,
                    to: values.to,
                    date: values.date,
                    preferences: {
                        personWithDisability: values.personWithDisability,
                        flexibleWithDate: values.flexibleWithDate,
                        trainWithAvailableBerth: values.trainWithAvailableBerth,
                        railwayPassConcession: values.railwayPassConcession
                    }
                });
                navigate('/booking-confirmation', { state: { bookingId: response.data.id } });
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to book ticket');
                console.error('Booking error:', err);
            } finally {
                setLoading(false);
            }
        }
    });

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await API.get('/locations');
                setLocations(response.data);
            } catch (err) {
                console.error('Error fetching locations:', err);
            }
        };
        fetchLocations();
    }, []);

    const handleSwap = () => {
        const temp = formik.values.from;
        formik.setFieldValue('from', formik.values.to);
        formik.setFieldValue('to', temp);
    };

    return (
        <div className="container mt-4 booking-form">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h2 className="text-center mb-4">BOOK TICKET</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    <form onSubmit={formik.handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="from" className="form-label">From</label>
                                    <select
                                        id="from"
                                        name="from"
                                        className={`form-select ${formik.touched.from && formik.errors.from ? 'is-invalid' : ''}`}
                                        value={formik.values.from}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">Select departure station</option>
                                        {locations.map(location => (
                                            <option key={location.id} value={location.city}>
                                                {location.city} ({location.code})
                                            </option>
                                        ))}
                                    </select>
                                    {formik.touched.from && formik.errors.from && (
                                        <div className="invalid-feedback">{formik.errors.from}</div>
                                    )}
                                </div>

                                <div className="d-flex justify-content-center mb-3">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary swap-btn"
                                        onClick={handleSwap}
                                        title="Swap stations"
                                    >
                                        <MdSwapVert size={24} />
                                    </button>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="to" className="form-label">To</label>
                                    <select
                                        id="to"
                                        name="to"
                                        className={`form-select ${formik.touched.to && formik.errors.to ? 'is-invalid' : ''}`}
                                        value={formik.values.to}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">Select destination station</option>
                                        {locations.map(location => (
                                            <option key={location.id} value={location.city}>
                                                {location.city} ({location.code})
                                            </option>
                                        ))}
                                    </select>
                                    {formik.touched.to && formik.errors.to && (
                                        <div className="invalid-feedback">{formik.errors.to}</div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="date" className="form-label">Date</label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        className={`form-control ${formik.touched.date && formik.errors.date ? 'is-invalid' : ''}`}
                                        value={formik.values.date}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {formik.touched.date && formik.errors.date && (
                                        <div className="invalid-feedback">{formik.errors.date}</div>
                                    )}
                                </div>

                                <div className="form-check mb-2">
                                    <input
                                        type="checkbox"
                                        id="personWithDisability"
                                        name="personWithDisability"
                                        className="form-check-input"
                                        checked={formik.values.personWithDisability}
                                        onChange={formik.handleChange}
                                    />
                                    <label htmlFor="personWithDisability" className="form-check-label">
                                        Person with disability
                                    </label>
                                </div>

                                <div className="form-check mb-2">
                                    <input
                                        type="checkbox"
                                        id="flexibleWithDate"
                                        name="flexibleWithDate"
                                        className="form-check-input"
                                        checked={formik.values.flexibleWithDate}
                                        onChange={formik.handleChange}
                                    />
                                    <label htmlFor="flexibleWithDate" className="form-check-label">
                                        Flexible with date (±2 days)
                                    </label>
                                </div>

                                <div className="form-check mb-2">
                                    <input
                                        type="checkbox"
                                        id="trainWithAvailableBerth"
                                        name="trainWithAvailableBerth"
                                        className="form-check-input"
                                        checked={formik.values.trainWithAvailableBerth}
                                        onChange={formik.handleChange}
                                    />
                                    <label htmlFor="trainWithAvailableBerth" className="form-check-label">
                                        Only trains with available berths
                                    </label>
                                </div>

                                <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        id="railwayPassConcession"
                                        name="railwayPassConcession"
                                        className="form-check-input"
                                        checked={formik.values.railwayPassConcession}
                                        onChange={formik.handleChange}
                                    />
                                    <label htmlFor="railwayPassConcession" className="form-check-label">
                                        Railway pass concession
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            <button 
                                type="submit" 
                                className="btn btn-primary search-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Searching...
                                    </>
                                ) : 'Search Trains'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;