package com.__105.Banchan.conference.repository;

import com.__105.Banchan.conference.entity.ConfRoom;
import com.__105.Banchan.user.entity.Apartment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConfRoomRepository extends JpaRepository<ConfRoom, Long> {

    Optional<ConfRoom> findBySession(String sessionId);

    List<ConfRoom> findAllByApt(Apartment apt);
}
