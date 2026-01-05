package com.__105.Banchan.ask.repository;


import com.__105.Banchan.ask.entity.Ask;
import com.__105.Banchan.ask.entity.AskLike;
import com.__105.Banchan.ask.entity.AskLikeId;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AskLikeRepository extends JpaRepository<AskLike, AskLikeId> {

    List<AskLike> findAllByAsk(Ask ask);

    @Query("select count(al) from AskLike al where al.ask.id = :askId")
    int countByAskId(@Param("askId") Long askId);

    @Query("SELECT al.ask.id, COUNT(al) FROM AskLike al WHERE al.ask.id IN :askIds GROUP BY al.ask.id")
    List<Object[]> countLikesByAskIds(@Param("askIds") List<Long> askIds);

}

