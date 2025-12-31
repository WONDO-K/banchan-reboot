package com.__105.Banchan.ask.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class AskLikeId {

    @EqualsAndHashCode.Include
    private Long ask;

    @EqualsAndHashCode.Include
    private Long user;
}
