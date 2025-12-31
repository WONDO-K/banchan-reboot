package com.__105.Banchan.conference.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfParticipantId {

    @EqualsAndHashCode.Include
    private Long roomId;

//    @EqualsAndHashCode.Include
//    private String userId;
}
