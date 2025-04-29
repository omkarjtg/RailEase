package com.railease.feedback.config;

import com.railease.feedback.dto.UserDTO;
import com.railease.feedback.entity.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    @Value("${JWT_SECRET}")
    private String SECRET_KEY;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String token = extractToken(request);
        if (token == null) {
            logger.warn("No JWT token found in request: {}", request.getRequestURI());
            chain.doFilter(request, response);
            return;
        }

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY.getBytes(StandardCharsets.UTF_8))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Extract role for security context
            String role = claims.get("role", String.class);
            List<String> roles = role != null ? List.of(role) : List.of();
            List<SimpleGrantedAuthority> authorities = roles.stream()
                    .map(r -> new SimpleGrantedAuthority(r.startsWith("ROLE_") ? r : "ROLE_" + r))
                    .collect(Collectors.toList());

            // Set security context for @PreAuthorize
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    claims.getSubject(), null, authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);

            // Create and set UserDTO for controller
            UserDTO userDTO = new UserDTO();
            Long userId = claims.get("userId", Long.class);
            if (userId == null) {
                logger.error("No 'userId' claim found in JWT token for request: {}", request.getRequestURI());
                chain.doFilter(request, response);
                return;
            }
            userDTO.setId(userId);
            userDTO.setUsername(claims.getSubject());
            userDTO.setRole(roles.contains("ROLE_ADMIN") ? Role.ADMIN : Role.USER);
            request.setAttribute("user", userDTO);

            logger.info("Authenticated user: {}, Roles: {}, UserDTO: [id={}, role={}], URI: {}",
                    claims.getSubject(), authorities, userDTO.getId(), userDTO.getRole(), request.getRequestURI());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token expired for request: {}: {}", request.getRequestURI(), e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (SignatureException | MalformedJwtException | UnsupportedJwtException e) {
            logger.error("Invalid JWT token for request: {}: {}", request.getRequestURI(), e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (Exception e) {
            logger.error("Unexpected error processing JWT token for request: {}: {}", request.getRequestURI(), e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        chain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}