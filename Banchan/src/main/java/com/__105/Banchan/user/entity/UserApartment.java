package com.__105.Banchan.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_apt")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserApartment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_apt_id", nullable = false)
    private Integer id;

    @JsonIgnore // 순환 참조 방지를 위해 추가
    @ManyToOne(targetEntity = User.class, fetch = FetchType.LAZY) // FetchType.LAZY: 지연로딩 (필요할 때 로딩)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    @ManyToOne(targetEntity = Apartment.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "apt_code", referencedColumnName = "apt_code", nullable = false)
    private Apartment apartment;

    @Column(name = "building_no", nullable = false, length = 50)
    private String buildingNo;

    @Column(name = "unit_no", nullable = false, length = 50)
    private String unitNo;

    @Column(name = "is_granted", nullable = false)
    private boolean isGranted;

    public void setIsGranted() {
        this.isGranted = true;
    }
}
