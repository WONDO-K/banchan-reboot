package com.__105.Banchan.conference.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "conf_participant")
public class ConfParticipant {

    @EmbeddedId
    private ConfParticipantId confParticipantId;

    @MapsId(value = "roomId")
    @ManyToOne
    @JoinColumn(name = "room_id")
    private ConfRoom confRoom;

//    @MapsId(value = "userId")
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private User user;
}
