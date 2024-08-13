package com.userservice.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.userservice.security.CustomUserDetailService;

@Configuration
@EnableWebSecurity
public class SecurityConfig  {
	
	@Autowired
	private CustomUserDetailService customUserDetailService;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF protection
            .authorizeHttpRequests(authz -> authz
            		.requestMatchers("/user/add").permitAll()
            		.requestMatchers("/test").hasRole("ADMIN")
                .anyRequest().authenticated() // All requests require authentication
            )
            .httpBasic(httpBasic -> httpBasic // Enable HTTP Basic Authentication
                    .realmName("myrealm") // Set the realm name (customize as needed)
                ); // Enable HTTP Basic Authentication

        return http.build();
    }

    @Bean
    AuthenticationManager authManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Using BCrypt for hashing passwords
    }

}
