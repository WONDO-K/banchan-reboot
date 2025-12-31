package com.__105.Banchan.ask.repository;

import com.__105.Banchan.ask.entity.Ask;
import com.__105.Banchan.ask.entity.AskImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AskImageRepository extends JpaRepository<AskImage, Long> {
    List<AskImage> findAllByAsk(Ask ask);
}
