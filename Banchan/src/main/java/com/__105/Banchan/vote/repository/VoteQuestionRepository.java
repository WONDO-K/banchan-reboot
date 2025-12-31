package com.__105.Banchan.vote.repository;

import com.__105.Banchan.vote.Entity.VoteQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VoteQuestionRepository extends JpaRepository<VoteQuestion, Long> {

    List<VoteQuestion> findByVoteId(Long voteId);
}
