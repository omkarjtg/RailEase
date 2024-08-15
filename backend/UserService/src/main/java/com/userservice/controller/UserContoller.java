package com.userservice.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
	public User addUser(@RequestBody User usr) {
		List<Role> roles = new ArrayList<>();
		roles.add(new Role("ROLE_USER"));
		if(usr.getIsAdmin())
			roles.add(new Role("ROLE_ADMIN"));
		usr.setPassword(passwordEncoder.encode(usr.getPassword()));
		usr.setRoles(roles);
		userRepository.save(usr);
//		String jwt = jwtProvider.createToken(usr.getUsername());
		return usr;
	}
	
	@GetMapping
	public User getUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		User usrInDb = userRepository.findByUsername(authentication.getName());
		return usrInDb;
	}
//	@GetMapping("/validate")
//	public ResponseEntity<UserDetails> validateToken() {
//		SecurityContextHolder.getContext().
////		return new ResponseEntity<UserDetails>();
//	}
	

}
