package com.__105.Banchan.conference.service;

import com.__105.Banchan.conference.dto.ConfDetailResponse;
import com.__105.Banchan.conference.dto.ConfInfoResponse;
import com.__105.Banchan.conference.dto.ConfRequest;
import com.__105.Banchan.conference.dto.ConfRoomResponse;
import com.__105.Banchan.conference.entity.ConfRoom;
import com.__105.Banchan.conference.exception.ConfErrorCode;
import com.__105.Banchan.conference.exception.ConfException;
import com.__105.Banchan.conference.repository.ConfRoomRepository;
import com.__105.Banchan.user.entity.Apartment;
import com.__105.Banchan.user.entity.User;
import com.__105.Banchan.user.entity.UserApartment;
import com.__105.Banchan.user.enums.Role;
import com.__105.Banchan.user.repository.UserRepository;
import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenViduService {

    private final ConfRoomRepository confRoomRepository;
    private final OpenVidu openVidu;
    private final UserRepository userRepository;

    public String createSession(Long id) throws OpenViduJavaClientException, OpenViduHttpException {

        SessionProperties properties = new SessionProperties.Builder().build();
        Session session = openVidu.createSession(properties);

        ConfRoom room = confRoomRepository.findById(id)
                .orElseThrow(() -> new ConfException(ConfErrorCode.CONFERENCE_NOT_FOUND));

        if (room.getSession() != null) throw new ConfException(ConfErrorCode.SESSION_ALREADY_EXISTS);

        room = room.toBuilder()
                .session(session.getSessionId())
                .isActive(true)
                .build();

        confRoomRepository.save(room);

        return session.getSessionId();
    }

    public String createToken(String sessionId) throws OpenViduJavaClientException, OpenViduHttpException {

        ConfRoom room = confRoomRepository.findBySession(sessionId)
                .orElseThrow(() -> new ConfException(ConfErrorCode.CONFERENCE_NOT_FOUND_BY_SESSION));

        Session session = openVidu.getActiveSessions().stream()
                .filter(s -> s.getSessionId().equals(sessionId))
                .findFirst()
                .orElseThrow(() -> new ConfException(ConfErrorCode.SESSION_NOT_FOUND));

        ConnectionProperties properties = new ConnectionProperties.Builder()
                .type(ConnectionType.WEBRTC)
                .build();

        return session.createConnection(properties).getToken();
    }

    // 작성의 아파트를 기준으로 회의 채널을 생성합니다.
    public void createRoom(ConfRequest request, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ConfException(ConfErrorCode.USER_NOT_FOUND));

        if (user.getRole() != Role.ADMIN) {
            throw new ConfException(ConfErrorCode.UNAUTHORIZED);
        }

        Apartment apt = user.getUserApartments()
                .stream()
                .findFirst()
                .orElseThrow(() -> new ConfException(ConfErrorCode.APT_NOT_FOUND))
                .getApartment();

        ConfRoom confRoom = ConfRoom.builder()
                .apt(apt)
                .roomName(request.getRoomName())
                .startDate(request.getStartDate())
                .startTime(request.getStartTime())
                .build();

        confRoomRepository.save(confRoom);
    }

    // 회의 목록 조회의 경우 주최자와 같은 아파트 코드를 기준으로 조회됩니다.
    public List<ConfRoomResponse> getRooms(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ConfException(ConfErrorCode.USER_NOT_FOUND));

        Apartment apt = user.getUserApartments()
                .stream()
                .findFirst()
                .orElseThrow(() -> new ConfException(ConfErrorCode.APT_NOT_FOUND))
                .getApartment();

        List<ConfRoom> confRooms = confRoomRepository.findAllByApt(apt);

        return confRooms.stream().map(confRoom -> {
            ConfRoomResponse confRoomResponse = new ConfRoomResponse();
            confRoomResponse.setId(confRoom.getId());
            confRoomResponse.setRoomName(confRoom.getRoomName());
            confRoomResponse.setSession(confRoom.getSession());
            confRoomResponse.setStartDate(confRoom.getStartDate());
            confRoomResponse.setStartTime(confRoom.getStartTime());
            confRoomResponse.setActive(confRoom.isActive());
            confRoomResponse.setSummaryComplete(confRoom.getSummury() != null);
            return confRoomResponse;
        }).collect(Collectors.toList());
    }

    public void deleteSession(String sessionId) throws OpenViduJavaClientException, OpenViduHttpException {

        ConfRoom room = confRoomRepository.findBySession(sessionId)
                .orElseThrow(() -> new ConfException(ConfErrorCode.CONFERENCE_NOT_FOUND));

        Session session = openVidu.getActiveSessions().stream()
                .filter(s -> s.getSessionId().equals(sessionId))
                .findFirst()
                .orElse(null);

        if (session != null) {
            try {
                session.close();
            } catch (OpenViduHttpException e) {
                // 세션이 이미 종료된 경우
                if (e.getStatus() == 404) log.error("Session not found on OpenVidu server: {}", sessionId);
                else {
                    throw e; // 다른 예외는 다시 던짐
                }
            }
        } else {
            log.error("Session is already inactive or not found: {}", sessionId);
        }

        room = room.toBuilder()
                .isActive(false)
                .build();

        confRoomRepository.save(room);
    }

    public void deleteRoom(Long roomId) {

        ConfRoom room = confRoomRepository.findById(roomId)
                .orElseThrow(() -> new ConfException(ConfErrorCode.CONFERENCE_NOT_FOUND));

        confRoomRepository.delete(room);
    }

    // 녹화 정보를 테이블에 저장합니다.
    public void saveRecord(String sessionId, String recordingId) {

        ConfRoom room = confRoomRepository.findBySession(sessionId)
                .orElseThrow(() -> new ConfException(ConfErrorCode.CONFERENCE_NOT_FOUND_BY_SESSION));

        room.saveRecordInfo(recordingId);

        confRoomRepository.save(room);
    }

    public void saveSummuryRecord(Long roomId, String text) {

        ConfRoom room = confRoomRepository.findById(roomId)
                .orElseThrow(() -> new ConfException(ConfErrorCode.CONFERENCE_NOT_FOUND));

        room.saveSummury(text);

        confRoomRepository.save(room);
    }

    public ConfDetailResponse getDetailRoom(Long roomId, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ConfException(ConfErrorCode.USER_NOT_FOUND));

        if (user.getRole() != Role.ADMIN) {
            throw new ConfException(ConfErrorCode.UNAUTHORIZED);
        }

        ConfRoom room = confRoomRepository.findById(roomId)
                .orElseThrow(() -> new ConfException(ConfErrorCode.CONFERENCE_NOT_FOUND));

        return ConfDetailResponse.builder()
                .id(room.getId())
                .roomName(room.getRoomName())
                .startDate(room.getStartDate())
                .startTime(room.getStartTime())
                .summary(room.getSummury())
                .build();
    }

    public ConfInfoResponse getRoomName(String sessionId) {

        ConfRoom room = confRoomRepository.findBySession(sessionId)
                .orElseThrow(() -> new ConfException(ConfErrorCode.CONFERENCE_NOT_FOUND_BY_SESSION));

        return ConfInfoResponse.builder()
                .id(room.getId())
                .roomName(room.getRoomName())
                .build();
    }
}
