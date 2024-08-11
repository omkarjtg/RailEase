package com.userservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.userservice.entity.User;
import com.userservice.repository.UserRepository;

@RestController
@RequestMapping("/user")
public class UserContoller {
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private UserRepository userRepository;
	
	
	@PostMapping("/add")
	public String addUser(@RequestBody User usr) {
		System.out.println("heelo");
		usr.setPassword(passwordEncoder.encode(usr.getPassword()));
		userRepository.save(usr);
		return "Added";
	}
	
	@GetMapping
	public User getUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		User usrInDb = userRepository.findByUsername(authentication.getName());
		return usrInDb;
	}

}
