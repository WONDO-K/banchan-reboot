package com.__105.Banchan.admin.dto;

import com.__105.Banchan.user.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@Schema(name = "UserListDto", description = "유저 리스트")
public class UserListDto {

    @Schema(description = "사용자 PK", example = "1")
    private Long id;

    @Schema(description = "사용자 이메일", example = "user@example.com")
    private String email;

    @Schema(description = "사용자 ID", example = "user")
    private String username;

    @Schema(description = "사용자 전화번호", example = "010-1234-5678")
    private String phone;

    @Schema(description = "사용자 소셜 타입", example = "KAKAO")
    private String socialType;

    @Schema(description = "사용자 이름", example = "홍길동")
    private String name;

    @Schema(description = "사용자 역할", example = "ADMIN")
    private String role;

    @Schema(description = "사용자 생성일자", example = "2023-07-29T12:34:56")
    private LocalDateTime createdAt;

    @Schema(description = "사용자 수정일자", example = "2023-07-30T12:34:56")
    private LocalDateTime updatedAt;

    public static UserListDto from(User user) {
        return UserListDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .phone(user.getPhone())
                .socialType(user.getSocialType())
                .name(user.getRealname())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}