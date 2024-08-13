package com.userservice.utils;

import java.sql.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtProvider {
	
	private String SECRET_KEY = "TaK+HaV^uvCHEFsEVfypW#7g9^k*Z8$V";
	
	private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }
	
	public String createToken(String subject) {
	 return Jwts.builder()	
			 .setSubject(subject)
			 .setIssuedAt(new Date(System.currentTimeMillis()))
			 .setExpiration(new Date(System.currentTimeMillis()+ 1000*60*5))
			 .signWith(getSigningKey())
			 .compact();
	}
	
	
//	public boolean validateJwtToken(String token) {
//	    try {
//	        // Create a JwtParser instance using the builder
//	        JwtParser parser = Jwts.parserBuilder()
//	            .setSigningKey(SECRET_KEY)
//	            .build();
//	        
//	        // Parse the token and validate its signature
//	        Claims claims = parser.parseClaimsJws(token).getBody();
//	        
//	        return true;
//	    } catch (JwtException e) {
//	        return false;
//	    }
//	}
	
	

}
