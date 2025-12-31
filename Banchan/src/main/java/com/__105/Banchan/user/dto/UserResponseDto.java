package com.__105.Banchan.user.dto;

import com.__105.Banchan.user.entity.User;
import com.__105.Banchan.user.entity.UserApartment;

import com.__105.Banchan.user.enums.Role;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class UserResponseDto {

    private Long id;
    private String username;
    private String realname;
    private String email;
    private String phone;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String socialType;
    private String attributeKey;
    private List<UserApartmentResponseDto> userApartments;

    public UserResponseDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.realname = user.getRealname();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.role = user.getRole().name();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
        this.socialType = user.getSocialType();
        this.attributeKey = user.getAttributeKey();
        this.userApartments = user.getUserApartments().stream()
                .map(UserApartmentResponseDto::new)
                .collect(Collectors.toList());
    }

    // toEntity 메서드 추가 -> User 객체를 리턴해줌
    public User toEntity() {
        return User.builder()
                .id(this.id)
                .username(this.username)
                .realname(this.realname)
                .email(this.email)
                .phone(this.phone)
                .role(Role.valueOf(this.role)) // 문자열로 된 role을 Enum으로 변환
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .socialType(this.socialType)
                .attributeKey(this.attributeKey)
                .build();
    }

    @Getter
    public static class UserApartmentResponseDto {

        private Integer id;
        private String aptCode;
        private String aptName;
        private String buildingNo;
        private String unitNo;
        private boolean isGranted;

        public UserApartmentResponseDto(UserApartment userApartment) {
            this.id = userApartment.getId();
            this.aptCode = userApartment.getApartment().getCode();
            this.aptName = userApartment.getApartment().getApartmentName();
            this.buildingNo = userApartment.getBuildingNo();
            this.unitNo = userApartment.getUnitNo();
            this.isGranted = userApartment.isGranted();
        }
    }
}
