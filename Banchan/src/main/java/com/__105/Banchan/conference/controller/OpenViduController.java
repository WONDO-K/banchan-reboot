package com.__105.Banchan.conference.controller;

import com.__105.Banchan.conference.dto.*;
import com.__105.Banchan.conference.exception.ConfErrorCode;
import com.__105.Banchan.conference.exception.ConfException;
import com.__105.Banchan.conference.service.OpenViduService;
import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/session")
@RequiredArgsConstructor
@Slf4j
public class OpenViduController {

    private final OpenVidu openVidu;
    private final OpenViduService openViduService;
    private final Map<String, Session> sessions = new HashMap<>();

    @PostMapping("/{roomId}")
    public ResponseEntity<?> createSession(@PathVariable Long roomId) {

        try {
            return ResponseEntity.ok().body(openViduService.createSession(roomId));
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new ConfException(ConfErrorCode.OPENVIDU_CLIENT_ERROR);
        }
    }

    // 세션 아이디로 받아서 토큰 발급
    @PostMapping("{sessionId}/token")
    public ResponseEntity<?> createToken(@PathVariable String sessionId) {

        try {
            return ResponseEntity.ok().body(openViduService.createToken(sessionId));
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new ConfException(ConfErrorCode.OPENVIDU_CLIENT_ERROR);
        }
    }

    // 방 생성
    // Request : roomName(String), startDate(String), startTime(String)
    @PostMapping("/createRoom")
    public ResponseEntity<?> createRoom(@RequestBody ConfRequest request,
                                        @AuthenticationPrincipal UserDetails userDetails) {

        openViduService.createRoom(request, userDetails.getUsername());
        return ResponseEntity.ok().body("successfully created room");
    }

    // 방 목록 조회
    // response : id(Long), roomName(String), 등등 있슴돠
    @GetMapping("/get/roomList")
    public ResponseEntity<?> getRoomList(@AuthenticationPrincipal UserDetails userDetails) {

        List<ConfRoomResponse> rooms = openViduService.getRooms(userDetails.getUsername());
        return ResponseEntity.ok().body(new DataResponse(rooms));
    }

    @DeleteMapping("/delete/{sessionId}")
    public ResponseEntity<?> deleteRoom(@PathVariable String sessionId) {

        try {
            openViduService.deleteSession(sessionId);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new ConfException(ConfErrorCode.INTERNAL_SERVER_ERROR);
        }

        return ResponseEntity.ok().body("successfully deleted room");
    }

    @DeleteMapping("/delete/room/{roomId}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long roomId) {

        openViduService.deleteRoom(roomId);
        return ResponseEntity.ok().body("successfully deleted room");
    }

    @PostMapping("/{sessionId}/startRecording")
    public ResponseEntity<?> startRecording(@PathVariable String sessionId) {
        try {
            // RecordingProperties 설정
            RecordingProperties properties = new RecordingProperties.Builder()
                    .name("recording_" + sessionId) // 녹화 파일의 이름
                    .outputMode(Recording.OutputMode.COMPOSED) // 합성된 출력 모드
                    .hasAudio(true) // 오디오 녹음 활성화
                    .hasVideo(false) // 비디오 녹화 비활성화
                    .build();

            // 녹화 시작
            Recording recording = openVidu.startRecording(sessionId, properties);
            return ResponseEntity.ok().body(recording);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            // e.printStackTrace();
            log.error("Failed to start recording : {}", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error starting recording: " + e.getMessage());
        }
    }


    @PostMapping("/{sessionId}/{recordingId}/stopRecording")
    public ResponseEntity<?> stopRecording(@PathVariable String recordingId,
                                           @PathVariable String sessionId) {
        try {
            // 녹화 중지
            Recording recording = openVidu.stopRecording(recordingId);
            openViduService.saveRecord(sessionId, recording.getId());
            return ResponseEntity.ok().body(recording);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new ConfException(ConfErrorCode.OPENVIDU_HTTP_ERROR);
        }
    }

    @GetMapping("/detail/{roomId}")
    public ResponseEntity<?> detail(@PathVariable Long roomId,
                                    @AuthenticationPrincipal UserDetails userDetails) {

        ConfDetailResponse response = openViduService.getDetailRoom(roomId, userDetails.getUsername());
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/get/roomName/{sessionId}")
    public ResponseEntity<?> getRoomName(@PathVariable String sessionId) {

        ConfInfoResponse roomInfo = openViduService.getRoomName(sessionId);
        return ResponseEntity.ok().body(roomInfo);
    }
}
