package com.__105.Banchan.user.repository;

import com.__105.Banchan.user.entity.User;
import com.__105.Banchan.user.entity.UserApartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserAptRepository extends JpaRepository<UserApartment, Integer> {

    Optional<UserApartment> findByUser(User user);

    @Query("select count(ua) from UserApartment ua " +
            "where ua.apartment.code = :aptCode")
    int countByApartmentCode(@Param("aptCode") String aptCode);
}
