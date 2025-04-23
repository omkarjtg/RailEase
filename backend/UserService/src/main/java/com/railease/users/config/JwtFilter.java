package com.railease.users.config;

import com.railease.users.model.UserPrincipal;
import com.railease.users.utils.JwtUtil;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String token = extractToken(request);

        if (token == null) {
            logger.debug("No valid JWT found in Authorization header or token cookie.");
            chain.doFilter(request, response);
            return;
        }

        try {
            String email = jwtUtil.extractEmail(token);
            if (email == null) {
                logger.warn("No email found in JWT.");
                chain.doFilter(request, response);
                return;
            }

            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                if (!(userDetails instanceof UserPrincipal userPrincipal)) {
                    logger.error("UserDetails is not an instance of UserPrincipal.");
                    chain.doFilter(request, response);
                    return;
                }

                if (jwtUtil.validateToken(token, (UserDetails) userPrincipal.getUser())) {
                    List<SimpleGrantedAuthority> authorities = jwtUtil.extractRoles(token).stream()
                            .map(SimpleGrantedAuthority::new)
                            .toList();

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userPrincipal, null, authorities);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.debug("Authentication set for user: {}", email);
                } else {
                    logger.warn("Invalid or expired JWT for user: {}", email);
                }
            }
        } catch (JwtException e) {
            logger.error("JWT processing error: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error in JWT filter: {}", e.getMessage());
        }

        chain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        // Check Authorization header first
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            logger.debug("JWT found in Auth header");
            return authHeader.substring(7);
        }


        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    logger.debug("JWT found in token cookie.");
                    return cookie.getValue();
                }
            }
        }

        return null;
    }
}