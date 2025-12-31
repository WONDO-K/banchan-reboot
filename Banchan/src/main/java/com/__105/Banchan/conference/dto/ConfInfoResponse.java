package com.__105.Banchan.conference.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ConfInfoResponse {

    private Long id;
    private String roomName;
}
