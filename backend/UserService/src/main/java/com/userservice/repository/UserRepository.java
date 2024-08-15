package com.userservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.userservice.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	
	User findByUsername(String uname);

}
