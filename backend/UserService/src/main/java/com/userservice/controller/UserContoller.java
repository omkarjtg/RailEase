package com.userservice.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.userservice.entity.Role;
import com.userservice.entity.User;
import com.userservice.repository.UserRepository;
import com.userservice.utils.JwtProvider;

@RestController
@RequestMapping("/users")
public class UserContoller {

	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private JwtProvider jwtProvider;

	@PostMapping("/add")
	public ResponseEntity<String> addUser(@RequestBody User usr) {
		List<Role> roles = new ArrayList<>();
		roles.add(new Role("ROLE_USER"));
		if (usr.getIsAdmin()) {
			roles.add(new Role("ROLE_ADMIN"));
		}
		usr.setPassword(passwordEncoder.encode(usr.getPassword()));
		usr.setRoles(roles);
		userRepository.save(usr);

		// Generate JWT token
		String jwtToken = jwtProvider.createToken(usr.getUsername());

		return ResponseEntity.ok(jwtToken);
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody User loginRequest) {
	    User usrInDb = userRepository.findByUsername(loginRequest.getUsername());

	    if (usrInDb != null && passwordEncoder.matches(loginRequest.getPassword(), usrInDb.getPassword())) {
	        String jwtToken = jwtProvider.createToken(usrInDb.getUsername());
	        
	        Map<String, Object> response = new HashMap<>();
	        response.put("token", jwtToken);
	        response.put("username", usrInDb.getUsername());
	        response.put("isAdmin", usrInDb.getIsAdmin());  
	        
	        return ResponseEntity.ok().body(response);
	    } else {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
	    }
	}

	@GetMapping
	public ResponseEntity<?> getUser(@RequestHeader("Authorization") String token) {
		if (token != null && jwtProvider.validateToken(token)) {
			String username = jwtProvider.getUsernameFromToken(token);
			User usrInDb = userRepository.findByUsername(username);
			return ResponseEntity.ok(usrInDb);
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token");
		}
	}

//	@GetMapping("/validate")
//	public ResponseEntity<UserDetails> validateToken() {
//		SecurityContextHolder.getContext().
////		return new ResponseEntity<UserDetails>();
//	}

}
