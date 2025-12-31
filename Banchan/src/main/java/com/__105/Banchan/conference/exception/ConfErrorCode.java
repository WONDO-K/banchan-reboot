package com.__105.Banchan.conference.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ConfErrorCode {

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found"),
    CONFERENCE_NOT_FOUND(HttpStatus.NOT_FOUND, "Conference not found"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Unauthorized: only administrators can do this"),
    APT_NOT_FOUND(HttpStatus.NOT_FOUND, "Apt not found"),
    FAIL_CONVERT_FILE(HttpStatus.BAD_REQUEST, "Fail to convert file"),
    FAIL_SAVE_TEXTFILE(HttpStatus.BAD_REQUEST, "Fail to save textfile"),
    FAIL_SPLIT_AUDIO(HttpStatus.BAD_REQUEST, "Fail to split audio"),
    SESSION_ALREADY_EXISTS(HttpStatus.CONFLICT, "Session already exists"),
    SESSION_NOT_FOUND(HttpStatus.CONFLICT, "Session not found"),
    CONFERENCE_NOT_FOUND_BY_SESSION(HttpStatus.NOT_FOUND, "Conference not found by session"),
    FAIL_CONVERT_WAV(HttpStatus.BAD_REQUEST, "Fail to convert wav"),

    // OpenVidu EXCEPTION
    OPENVIDU_CLIENT_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "OpenVidu Client Error"),
    OPENVIDU_HTTP_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "OpenVidu HTTP Error"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error");

    private final HttpStatus httpStatus;
    private final String message;
    }
