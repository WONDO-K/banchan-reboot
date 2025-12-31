package com.__105.Banchan.vote.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum VoteErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found"),
    VOTE_NOT_FOUND(HttpStatus.NOT_FOUND, "Vote not found"),
    APT_NOT_FOUND(HttpStatus.NOT_FOUND, "Apt not found"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "can only register admin"),
    QUESTION_NOT_FOUND(HttpStatus.NOT_FOUND, "Invalid question ID"),
    OPTION_NOT_FOUND(HttpStatus.NOT_FOUND, "Invalid option ID"),
    VOTE_ALREADY_EXISTS(HttpStatus.CONFLICT, "Vote already exists");

    private final HttpStatus status;
    private final String message;
    }
