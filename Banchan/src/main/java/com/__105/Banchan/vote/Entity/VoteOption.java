package com.__105.Banchan.vote.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vote_option")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class VoteOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vote_option_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private VoteQuestion voteQuestion;

    @Column(name = "option_text", nullable = false)
    private String optionText;
}
