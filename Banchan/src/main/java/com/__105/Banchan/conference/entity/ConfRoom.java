package com.__105.Banchan.conference.entity;

import com.__105.Banchan.user.entity.Apartment;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
@Table(name = "conf_room")
public class ConfRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "conf_room_id")
    private Long id;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "host_id", nullable = false)
//    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apt_code", nullable = false)
    private Apartment apt;

    @Column(name = "room_name", nullable = false)
    private String roomName;

    @Column(name = "start_date", nullable = false)
    private String startDate;

    @Column(name = "start_time", nullable = false)
    private String startTime;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "session")
    private String session;

    @Column(name = "recording_path")
    private String recordingPath;

    // 회의 활성화 시 발급된 세션을 저장하면서 1로 수정
    @Column(name = "is_active", columnDefinition = "TINYINT(1) default 0")
    private boolean isActive;

    // 회의 요약 내용을 저장합니다.
    @Column(name = "conf_summury", columnDefinition = "TEXT")
    private String summury;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public void saveRecordInfo(String recordingPath) {
        this.recordingPath = recordingPath;
    }

    public void saveSummury(String summury) {
        this.summury = summury;
    }
}

