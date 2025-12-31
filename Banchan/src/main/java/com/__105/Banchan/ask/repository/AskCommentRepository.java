package com.__105.Banchan.ask.repository;

import com.__105.Banchan.ask.entity.Ask;
import com.__105.Banchan.ask.entity.AskComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AskCommentRepository extends JpaRepository<AskComment, Long> {

    List<AskComment> findAllByAsk(Ask ask);
}
