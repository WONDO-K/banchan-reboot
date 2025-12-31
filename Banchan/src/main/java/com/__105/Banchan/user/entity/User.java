package com.__105.Banchan.user.entity;

import com.__105.Banchan.user.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @Column(name = "realname", length = 50)
    private String realname;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "role", nullable = false)
    @Enumerated(value = EnumType.STRING)
    private Role role;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "social_type")
    private String socialType;

    @Column(name = "attribute_key")
    private String attributeKey;

    // User를 지우면 UserApartments도 지워지게끔 설정
    @JsonIgnore
    @Builder.Default // 빌더 패턴 사용시 필드 초기화 값 유지, 없으면 빈 Set으로 초기화
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserApartment> userApartments = new HashSet<>();

    public void changePhone(String phone) {
        this.phone = phone;
    }

    public void changeRealname(String realname) {
        this.realname = realname;
    }
}



