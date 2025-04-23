package com.railease.users.dto;

import com.railease.users.model.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private Role role;
}
