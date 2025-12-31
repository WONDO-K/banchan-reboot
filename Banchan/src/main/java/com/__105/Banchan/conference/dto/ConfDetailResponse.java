package com.__105.Banchan.conference.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ConfDetailResponse {

    private Long id;
    private String roomName;
    private String startDate;
    private String startTime;
    private String summary;
}
