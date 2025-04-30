package com.railease.payment.dto;

import com.railease.payment.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {              //feign
    private Long id;
    private String email;
    private String name;
    private Role role;
}
