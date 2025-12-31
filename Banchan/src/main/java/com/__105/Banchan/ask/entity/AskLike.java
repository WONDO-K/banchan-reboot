package com.__105.Banchan.ask.entity;

import com.__105.Banchan.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "ask_like")
public class AskLike {

    @EmbeddedId
    private AskLikeId id;

    @ManyToOne
    @MapsId("ask")
    @JoinColumn(name = "ask_id", nullable = false)
    private Ask ask;

    @ManyToOne
    @MapsId("user")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
