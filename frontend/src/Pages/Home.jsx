import React from 'react';
import '../styles/Home.css'; // Make sure this path matches your file structure

const HomePage = () => {
    return (
        <div className="home-container">
            <section className="hero-banner">
                <h1>Welcome to RailEase</h1>
                <p>Your one-stop solution for hassle-free train bookings.</p>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2>Our Features</h2>
                    <div className="row">
                        <div className="col-md-4 feature-item">
                            <h3>Real-Time Updates</h3>
                            <p>Get real-time information on train schedules and delays.</p>
                        </div>
                        <div className="col-md-4 feature-item">
                            <h3>Easy Booking</h3>
                            <p>Book your train tickets quickly and effortlessly.</p>
                        </div>
                        <div className="col-md-4 feature-item">
                            <h3>24/7 Support</h3>
                            <p>We're here to help you anytime, anywhere.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section
            <section className="testimonials">
                <div className="container">
                    <h2>What Our Users Say</h2>
                    <div className="testimonial-row">
                        <div className="testimonial-item">
                            <blockquote>
                                <p>"RailEase’s real-time updates were a game-changer. I was always informed about my train’s arrival time, which made my travel stress-free."</p>
                                <footer>— Akshat Mehta</footer>
                            </blockquote>
                        </div>
                        <div className="testimonial-item">
                            <blockquote>
                                <p>"The punctuality alerts provided by RailEase were fantastic. I never had to worry about train delays, thanks to their accurate information."</p>
                                <footer>— Omkar Kumbhar</footer>
                            </blockquote>
                        </div>
                        <div className="testimonial-item">
                            <blockquote>
                                <p>"With RailEase, I always felt in control of my journey. Their real-time notifications ensured that I was never caught off guard by schedule changes."</p>
                                <footer>— Nitin Bhakar</footer>
                            </blockquote>
                        </div>
                        <div className="testimonial-item">
                            <blockquote>
                                <p>"RailEase’s accurate tracking made my trips much smoother. I appreciated knowing exactly when my train would arrive, every time."</p>
                                <footer>— Anish Sonje</footer>
                            </blockquote>
                        </div>
                        <div className="testimonial-item">
                            <blockquote>
                                <p>"Thanks to RailEase, I had a worry-free travel experience. Their real-time updates kept me informed and on schedule throughout my journey."</p>
                                <footer>— Sushant Kumar</footer>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Call to Action */}
            <section className="cta">
                <h2>Ready to Book Your Train?</h2>
                <a href="/trains" className="btn btn-md btn-dark">Book Now</a>
            </section>
        </div>
    );
};

export default HomePage;