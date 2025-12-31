package com.__105.Banchan.vote.Entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
@Embeddable
public class VoteParticipantId implements Serializable {

    @EqualsAndHashCode.Include
    private Long vote;

    @EqualsAndHashCode.Include
    private Long user;
}
