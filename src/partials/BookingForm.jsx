import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TfiExchangeVertical } from 'react-icons/tfi';
import './BookingForm.css';
import { useNavigate } from 'react-router-dom';

export default function BookingForm() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            From: '',
            To: '',
            Category: 'GENERAL',
            Date: '',
            SeatTier: 'All Classes',
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
        onSubmit: values => {
            console.log('Booking form submitted', values);
            navigate('/results', { state: values }); // Pass form values to the results page
        }
    });

    // Function to swap "From" and "To" values
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
                                        className={`form-control ${formik.touched.From && formik.errors.From ? 'is-invalid' : ''}`}
                                        {...formik.getFieldProps('From')}
                                    />
                                    {formik.touched.From && formik.errors.From ? (
                                        <div className="invalid-feedback">{formik.errors.From}</div>
                                    ) : null}
                                </div>
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <button id='btn5' type="button" className="btn btn-outline-secondary" onClick={handleSwap} title="Swap From and To">
                                        <TfiExchangeVertical />
                                    </button>
                                </div>
                                <div className='mb-3 position-relative'>
                                    <label htmlFor="To" className='form-label'>To</label>
                                    <input
                                        type="text"
                                        name="To"
                                        id="To"
                                        className={`form-control ${formik.touched.To && formik.errors.To ? 'is-invalid' : ''}`}
                                        {...formik.getFieldProps('To')}
                                    />
                                    {formik.touched.To && formik.errors.To ? (
                                        <div className="invalid-feedback">{formik.errors.To}</div>
                                    ) : null}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Category" className="form-label">Category</label>
                                    <select
                                        name="Category"
                                        id="Category"
                                        className="form-select"
                                        {...formik.getFieldProps('Category')}
                                    >
                                        <option value="GENERAL">General</option>
                                        <option value="Ladies">Ladies</option>
                                        <option value="Sr. Citizen">Sr. Citizen</option>
                                        <option value="Person with Disability">Person with Disability</option>
                                    </select>
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
                                <div className='mb-3'>
                                    <label htmlFor="SeatTier" className='form-label'>Seat Tier</label>
                                    <select
                                        name="SeatTier"
                                        id="SeatTier"
                                        className="form-select"
                                        {...formik.getFieldProps('SeatTier')}
                                    >
                                        <option value="All Classes">All Classes</option>
                                        <option value="Sleeper">Sleeper</option>
                                        <option value="AC">3-AC</option>
                                        <option value="AC">2-AC</option>
                                        <option value="AC">1-AC</option>

                                    </select>
                                    <br/>
                                    <div id='div1'>
                                        <div>
                                            <input
                                                type="checkbox"
                                                name='PersonWithDisability'
                                                checked={formik.values.PersonWithDisability}
                                                onChange={formik.handleChange}
                                            />
                                            <label htmlFor="PersonWithDisability"> Person with Disability</label>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                name='FlexibleWithDate'
                                                checked={formik.values.FlexibleWithDate}
                                                onChange={formik.handleChange}
                                            />
                                            <label htmlFor="FlexibleWithDate"> Flexible with Date</label>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                name='TrainWithAvailableBirth'
                                                checked={formik.values.TrainWithAvailableBirth}
                                                onChange={formik.handleChange}
                                            />
                                            <label htmlFor="TrainWithAvailableBirth"> Train with Available Birth</label>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                name='RailwayPassConcession'
                                                checked={formik.values.RailwayPassConcession}
                                                onChange={formik.handleChange}
                                            />
                                            <label htmlFor="RailwayPassConcession"> Railway Pass Concession</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                       
                        <div className="text-center">
                            <button id='btn4' type="submit" className='btn-btn-primary' >Search</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
