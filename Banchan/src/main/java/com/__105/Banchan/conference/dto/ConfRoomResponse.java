package com.__105.Banchan.conference.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConfRoomResponse {

    private Long id;
    private String roomName;
    private String startDate;
    private String startTime;
    private String session;
    private LocalDateTime createdAt;
    private boolean isActive;
    // 요약본이 생성이 되었는지 유무
    private boolean isSummaryComplete;
}
