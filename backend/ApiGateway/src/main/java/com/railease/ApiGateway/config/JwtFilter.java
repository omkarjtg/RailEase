package com.railease.ApiGateway.config;

import com.railease.ApiGateway.utils.JwtUtil;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class JwtFilter extends AbstractGatewayFilterFactory<JwtFilter.Config> {

    @Autowired
    private JwtUtil jwtUtil;

    private static final List<PathMethod> PUBLIC_ENDPOINTS = List.of(
            new PathMethod("/api/auth/**", null),
            new PathMethod("/api/locations", "GET"),
            new PathMethod("/api/public/**", null),
            new PathMethod("/favicon.ico", null)
    );

    public JwtFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getPath().toString();
            String method = request.getMethod().name();

            if (isPublicEndpoint(path, method)) {
                return chain.filter(exchange);
            }

            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String token = authHeader.substring(7);
            try {
                String username = jwtUtil.getUsernameFromToken(token);
                String role = jwtUtil.getRoleFromToken(token);
                Long userId = jwtUtil.getUserIdFromToken(token);
                String email = jwtUtil.getEmailFromToken(token);

                exchange.getRequest().mutate()
                        .header("X-Username", username)
                        .header("X-Role", role)
                        .header("X-UserId", String.valueOf(userId))
                        .header("X-Email", email)
                        .build();
            } catch (JwtException e) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            return chain.filter(exchange);
        };
    }

    private static class PathMethod {
        private final String path;
        private final String method;

        PathMethod(String path, String method) {
            this.path = path;
            this.method = method;
        }

        boolean matches(String requestPath, String requestMethod) {
            boolean pathMatches = requestPath.matches(
                    path.replace("**", ".*").replace("*", "[^/]*")
            );
            boolean methodMatches = method == null || method.equals(requestMethod);
            return pathMatches && methodMatches;
        }
    }

    private boolean isPublicEndpoint(String path, String method) {
        return PUBLIC_ENDPOINTS.stream().anyMatch(pm -> pm.matches(path, method));
    }

    public static class Config {}
}