package com.trainservice.config;

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
        // Check if the train table is already populated
        String countQuery = "SELECT COUNT(*) FROM train";
        Integer count = jdbcTemplate.queryForObject(countQuery, Integer.class);

        // Only seed data if the table is empty
        if (count == null || count == 0) {
            String trainsSql = "INSERT INTO train (name, number, source, destination, total_coach, seat_per_coach, price, schedule, departure_time, arrival_time) VALUES " +
                "('Rajdhani Express', '12345', 'Delhi', 'Mumbai', 20, 80, '1500', '2024-10-01', '18:00:00', '08:00:00'), " +
                "('Shatabdi Express', '23456', 'Delhi', 'Chennai', 15, 70, '1800', '2024-10-01', '06:00:00', '22:00:00'), " +
                "('Duronto Express', '34567', 'Kolkata', 'Bangalore', 18, 60, '2000', '2024-10-01', '14:00:00', '05:00:00'), " +
                "('Nanded Express', '45678', 'Hyderabad', 'Mumbai', 22, 90, '1300', '2024-10-01', '11:00:00', '05:00:00'), " +
                "('Superfast Express', '56789', 'Ahmedabad', 'Delhi', 16, 65, '1600', '2024-10-01', '17:00:00', '08:00:00'), " +
                "('Jan Shatabdi', '67890', 'Jaipur', 'Delhi', 14, 60, '1200', '2024-10-01', '07:00:00', '12:00:00'), " +
                "('Jansadharan Express', '78901', 'Pune', 'Delhi', 24, 100, '1400', '2024-10-01', '15:00:00', '09:00:00'), " +
                "('Maharashtra Express', '89012', 'Nagpur', 'Mumbai', 20, 85, '1700', '2024-10-01', '20:00:00', '06:00:00'), " +
                "('Gaya Express', '90123', 'Patna', 'Kolkata', 18, 75, '1300', '2024-10-01', '10:00:00', '17:00:00'), " +
                "('Andaman Express', '01234', 'Chennai', 'Coimbatore', 16, 70, '1400', '2024-10-01', '09:00:00', '15:00:00'), " +
                "('Shiv Ganga Express', '12346', 'Varanasi', 'Delhi', 18, 60, '1600', '2024-10-01', '12:00:00', '06:00:00'), " +
                "('Chennai Express', '23457', 'Chennai', 'Delhi', 22, 85, '1900', '2024-10-01', '22:00:00', '10:00:00'), " +
                "('Kashi Vishwanath Express', '34568', 'Varanasi', 'Mumbai', 20, 75, '1500', '2024-10-01', '15:00:00', '08:00:00'), " +
                "('Bhopal Express', '45679', 'Bhopal', 'Delhi', 15, 65, '1200', '2024-10-01', '06:00:00', '15:00:00'), " +
                "('Mumbai Mail', '56780', 'Mumbai', 'Delhi', 20, 80, '1400', '2024-10-01', '20:00:00', '08:00:00'), " +
                "('Rajdhani Express', '67891', 'Delhi', 'Chennai', 20, 80, '1600', '2024-10-01', '18:00:00', '08:00:00'), " +
                "('North East Express', '78912', 'Delhi', 'Guwahati', 18, 70, '1800', '2024-10-01', '12:00:00', '05:00:00'), " +
                "('Satyagrah Express', '89023', 'Patna', 'Delhi', 16, 65, '1400', '2024-10-01', '16:00:00', '09:00:00'), " +
                "('Saraswati Express', '90124', 'Delhi', 'Amritsar', 22, 85, '1700', '2024-10-01', '20:00:00', '06:00:00'), " +
                "('Tiruchendur Express', '01235', 'Tiruchendur', 'Chennai', 18, 60, '1300', '2024-10-01', '14:00:00', '19:00:00'), " +
                "('Puri Express', '12347', 'Puri', 'Bhubaneswar', 16, 70, '1100', '2024-10-01', '10:00:00', '13:00:00');";

            jdbcTemplate.update(trainsSql);
            System.out.println("Trains seeded into the database.");
        } else {
            System.out.println("Trains already exist in the database. Skipping seeding.");
        }
    }
}
