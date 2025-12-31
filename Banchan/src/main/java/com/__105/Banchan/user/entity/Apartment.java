package com.__105.Banchan.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "apt")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Apartment {

    @Id
    @Column(name = "apt_code", nullable = false, length = 50)
    private String code;

    @Column(name = "apartment_name", nullable = false, length = 255)
    private String apartmentName;

    @Column(name = "addr", nullable = false, length = 255)
    private String addr;

    @Column(name = "total_units")
    private Integer totalUnits;


}