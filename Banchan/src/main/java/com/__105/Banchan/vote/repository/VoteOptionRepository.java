package com.__105.Banchan.vote.repository;

import com.__105.Banchan.vote.Entity.VoteOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VoteOptionRepository extends JpaRepository<VoteOption, Long> {

    List<VoteOption> findByVoteQuestionId(Long questionId);
}
