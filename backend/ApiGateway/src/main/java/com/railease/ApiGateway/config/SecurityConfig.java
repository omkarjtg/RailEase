package com.railease.ApiGateway.config;


import com.railease.ApiGateway.utils.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import reactor.core.publisher.Mono;

import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(
            ServerHttpSecurity http,
            ServerSecurityContextRepository securityContextRepository
    ) {
        http
                .csrf(csrf -> csrf.disable())
                .securityContextRepository(securityContextRepository)
                .authorizeExchange(exchanges -> exchanges
                        // UserService
                        .pathMatchers("/api/auth/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/auth/profile").authenticated()
                        // NotificationService
                        .pathMatchers(HttpMethod.POST, "/api/notify").permitAll()
                        // PaymentService
                        .pathMatchers(HttpMethod.GET, "/api/payment").authenticated()
                        .pathMatchers(HttpMethod.POST, "/api/payment").authenticated()
                        // FeedbackService
                        .pathMatchers(HttpMethod.POST, "/api/feedback").authenticated()
                        .pathMatchers(HttpMethod.GET, "/api/feedback/my").authenticated()
                        .pathMatchers(HttpMethod.GET, "/api/feedback/all").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/feedback/**").authenticated()
                        .pathMatchers(HttpMethod.DELETE, "/api/feedback/**").authenticated()
                        // BookingService
                        .pathMatchers(HttpMethod.POST, "/api/booking").authenticated()
                        .pathMatchers(HttpMethod.GET, "/api/booking/**").authenticated()
                        .pathMatchers(HttpMethod.GET, "/api/booking/my").authenticated()
                        .pathMatchers(HttpMethod.GET, "/api/booking/all").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/booking/**").authenticated()
                        // TrainService
                        .pathMatchers(HttpMethod.GET, "/api/trains/**").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/trains/**").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/trains/**").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/trains/**").hasRole("ADMIN")
                        // LocationService
                        .pathMatchers(HttpMethod.GET, "/api/locations/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/debug/**").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/locations/**").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/locations/**").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/locations/**").hasRole("ADMIN")
                        // Other
                        .pathMatchers("/favicon.ico").permitAll()
                        .pathMatchers("/api/public/**").permitAll()
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow preflight requests
                        .anyExchange().authenticated()
                )
                .logout(logout -> logout.disable());
        return http.build();
    }

    @Bean
    public ServerSecurityContextRepository securityContextRepository(ReactiveAuthenticationManager authenticationManager) {
        return new JwtServerSecurityContextRepository(authenticationManager);
    }

    @Bean
    public ReactiveAuthenticationManager authenticationManager(JwtUtil jwtUtil) {
        return authentication -> {
            String token = authentication.getCredentials().toString();
            try {
                if (jwtUtil.validateToken(token)) {
                    String username = jwtUtil.getUsernameFromToken(token);
                    String role = jwtUtil.getRoleFromToken(token);
                    List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
                    System.out.println("AuthenticationManager: Set authorities: " + authorities);
                    return Mono.just(new UsernamePasswordAuthenticationToken(username, token, authorities));
                }
                System.out.println("AuthenticationManager: Token validation failed");
                return Mono.empty();
            } catch (Exception e) {
                System.err.println("AuthenticationManager error: " + e.getMessage());
                return Mono.empty();
            }
        };
    }
}