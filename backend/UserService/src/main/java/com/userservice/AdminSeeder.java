package com.userservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.userservice.entity.User;
import com.userservice.repository.UserRepository;

@Component
public class AdminSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    //seeds a temporary admin account 
    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin") == null) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(new BCryptPasswordEncoder().encode("password"));
            admin.setAdmin(true);
            userRepository.save(admin);
            System.out.println("Admin user seeded.");
        }
    }
}
