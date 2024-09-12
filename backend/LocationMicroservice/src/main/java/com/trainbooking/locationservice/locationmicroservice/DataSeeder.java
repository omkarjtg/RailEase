package com.trainbooking.locationservice.locationmicroservice;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        String locationsSql = "INSERT INTO location (city, state, country, postal_code) VALUES " +
            "('Mumbai', 'Maharashtra', 'India', '400001'), " +
            "('Delhi', 'Delhi', 'India', '110001'), " +
            "('Kolkata', 'West Bengal', 'India', '700001'), " +
            "('Chennai', 'Tamil Nadu', 'India', '600001'), " +
            "('Bangalore', 'Karnataka', 'India', '560001'), " +
            "('Hyderabad', 'Telangana', 'India', '500001'), " +
            "('Ahmedabad', 'Gujarat', 'India', '380001'), " +
            "('Pune', 'Maharashtra', 'India', '411001'), " +
            "('Jaipur', 'Rajasthan', 'India', '302001'), " +
            "('Agra', 'Uttar Pradesh', 'India', '282001'), " +
            "('Varanasi', 'Uttar Pradesh', 'India', '221001'), " +
            "('Amritsar', 'Punjab', 'India', '143001'), " +
            "('Bhopal', 'Madhya Pradesh', 'India', '462001'), " +
            "('Coimbatore', 'Tamil Nadu', 'India', '641001'), " +
            "('Guwahati', 'Assam', 'India', '781001'), " +
            "('Bhubaneswar', 'Odisha', 'India', '751001'), " +
            "('Patna', 'Bihar', 'India', '800001'), " +
            "('Nagpur', 'Maharashtra', 'India', '440001'), " +
            "('Tiruchendur', 'Tamil Nadu', 'India', '628215'), " +
            "('Puri', 'Odisha', 'India', '752001');";

        jdbcTemplate.update(locationsSql);
    }
}
