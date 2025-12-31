package com.__105.Banchan.user.dto;

import com.__105.Banchan.user.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserDto {

    private Long id;
    private String username;
    private String realname;
    private String email;
    private String phone;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String socialType;
    private String attributeKey;

    // 엔티티 클래스를 DTO로 변환하는 편리한 생성자
    public UserDto(com.__105.Banchan.user.entity.User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.realname = user.getRealname();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.role = user.getRole();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
        this.socialType = user.getSocialType();
        this.attributeKey = user.getAttributeKey();
    }
}
