package com.__105.Banchan.user.repository;

import com.__105.Banchan.user.entity.Apartment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AptRepository extends JpaRepository<Apartment, String> {

    Optional<Apartment> findByCode(String code);
}
