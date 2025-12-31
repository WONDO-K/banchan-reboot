package com.__105.Banchan.auth.dto.security;

import com.__105.Banchan.user.enums.Role;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@Builder
public class SecurityUserDto implements UserDetails {
    private Long id;          // User 도메인의 id와 일치
    private String email;
    private String username;
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // ROLE_ 접두사를 붙여서 권한 생성
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return ""; // 비밀번호가 필요한 경우, 해당 정보를 반환하도록 구현
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // 계정이 만료되지 않았음을 반환
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 계정이 잠겨있지 않음을 반환
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 자격 증명이 만료되지 않았음을 반환
    }

    @Override
    public boolean isEnabled() {
        return true; // 계정이 활성화되어 있음을 반환
    }
}
