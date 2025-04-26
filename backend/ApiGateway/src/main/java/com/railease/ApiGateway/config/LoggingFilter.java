package com.railease.ApiGateway.config;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class LoggingFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        System.out.println(">>> INCOMING REQUEST: " + exchange.getRequest().getMethod() + " " + exchange.getRequest().getURI());
        return chain.filter(exchange)
                .doOnSuccess(aVoid -> {
                    System.out.println(">>> RESPONSE STATUS: " + exchange.getResponse().getStatusCode());
                });
    }

    @Override
    public int getOrder() {
        return -1; // High priority
    }
}
