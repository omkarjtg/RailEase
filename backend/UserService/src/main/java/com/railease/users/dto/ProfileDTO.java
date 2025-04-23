package com.railease.users.dto;

import com.railease.users.model.Role;
import com.railease.users.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDTO {
    private Long id;
    private String username;
    private String email;
    private Role roles;
    private LocalDate joinedAt;

    public ProfileDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.roles = user.getRole();
        this.joinedAt = user.getJoinedAt();
    }

}