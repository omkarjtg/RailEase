import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { MdSwapVert } from "react-icons/md";
import base64 from 'base-64';
import './BookingForm.css';
import { submitBooking } from '../trainService.js'

export default function BookingForm() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            From: '',
            To: '',
            Date: '',
            PersonWithDisability: false,
            FlexibleWithDate: false,
            TrainWithAvailableBirth: false,
            RailwayPassConcession: false
        },
        validationSchema: Yup.object({
            From: Yup.string().required('Arrival place is required'),
            To: Yup.string().required('Destination place is required'),
            Date: Yup.date().required('Date is required')
        }),
        onSubmit: async values => {
            try {
                const trains = await submitBooking(values.From, values.To, values.Date);
                console.log('Trains fetched', trains);
                navigate('/results', { state: { From: values.From, To: values.To, Date: values.Date } });
            } catch (error) {
                console.error('Error fetching trains:', error);
            }
        }
    });

    const handleSwap = () => {
        formik.setFieldValue('From', formik.values.To);
        formik.setFieldValue('To', formik.values.From);
    };

    return (
        <div className="container mt-4" id='bookingForm'>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h2>BOOK TICKET</h2>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6">
                                <div className='mb-3 position-relative'>
                                    <label htmlFor="From" className='form-label'>From</label>
                                    <input
                                        type="text"
                                        name="From"
                                        id="From"
                                        placeholder="Source Station"
                                        className={`form-control ${formik.touched.From && formik.errors.From ? 'is-invalid' : ''}`}
                                        {...formik.getFieldProps('From')}
                                    />
                                    {formik.touched.From && formik.errors.From ? (
                                        <div className="invalid-feedback">{formik.errors.From}</div>
                                    ) : null}
                                </div>
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <button id='btn5' type="button" className="btn btn-outline-secondary" onClick={handleSwap} title="Swap From and To">
                                        <MdSwapVert />
                                    </button>
                                </div>
                                <div className='mb-3 position-relative'>
                                    <label htmlFor="To" className='form-label'>To</label>
                                    <input
                                        type="text"
                                        name="To"
                                        id="To"
                                        placeholder="Destination Station"
                                        className={`form-control ${formik.touched.To && formik.errors.To ? 'is-invalid' : ''}`}
                                        {...formik.getFieldProps('To')}
                                    />
                                    {formik.touched.To && formik.errors.To ? (
                                        <div className="invalid-feedback">{formik.errors.To}</div>
                                    ) : null}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">
                                <div className='mb-3'>
                                    <label htmlFor="Date" className='form-label'>Date</label>
                                    <input
                                        type="date"
                                        name="Date"
                                        id="Date"
                                        className={`form-control ${formik.touched.Date && formik.errors.Date ? 'is-invalid' : ''}`}
                                        {...formik.getFieldProps('Date')}
                                    />
                                    {formik.touched.Date && formik.errors.Date ? (
                                        <div className="invalid-feedback">{formik.errors.Date}</div>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <button id='btn4' type="submit" className="btn btn-primary">Search</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
