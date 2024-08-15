import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className="container">
            <h1>About Us</h1>
            <p>Welcome to Rail Ease, your go-to solution for seamless train ticket booking! At Rail Ease, we are dedicated to providing a user-friendly platform that simplifies the process of booking train tickets, ensuring you have a smooth and stress-free journey.</p>
            
            <h2>Who We Are</h2>
            <p>Rail Ease is a cutting-edge train ticket booking system developed with the traveler in mind. We understand the challenges and frustrations of booking train tickets, and we aim to make the process as effortless as possible.</p>
            
            <h2>Our Vision</h2>
            <p>We aim to revolutionize the way people book train tickets by offering a platform that is fast, reliable, and easy to use. Our goal is to make train travel accessible and convenient for everyone.</p>
            
            <h2>What We Offer</h2>
            <ul className="features-list">
                <li>Easy Booking Process</li>
                <li>Real-time Updates</li>
                <li>Secure Payments</li>
                <li>24/7 Support</li>
            </ul>

            <h2>Why Choose Rail Ease?</h2>
            <p>At Rail Ease, we are committed to providing an exceptional user experience. Our platform is designed to be intuitive and user-friendly, allowing you to book your tickets quickly and easily. We also offer a range of features to enhance your booking experience, including real-time updates, secure payments, and 24/7 customer support.</p>

            <footer>
                &copy; 2024 Rail Ease. All rights reserved.
            </footer>
        </div>
    );
};

export default AboutUs;