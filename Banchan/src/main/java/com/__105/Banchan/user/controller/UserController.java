package com.__105.Banchan.user.controller;

import com.__105.Banchan.user.dto.*;
import com.__105.Banchan.user.entity.User;
import com.__105.Banchan.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@Tag(name = "UserController", description = "유저 관련 API")
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @GetMapping("/myinfo")
    @Operation(summary = "내 정보 조회", description = "현재 로그인된 사용자의 정보를 반환합니다.")
    public ResponseEntity<UserResponseDto> getMyInfo() {
        UserResponseDto userDto = userService.getMyInfo();
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/setmyinfo")
    @Operation(summary = "내 정보 초기 설정", description = "초기 가입시 입력한 정보를 반영합니다.")
    public ResponseEntity<User> setMyInfo(@RequestBody SignupRequestDto signupRequestDto) {
        // 로그인된 사용자를 가져옴
        User currentUser = userService.getMyInfo().toEntity();
        User updatedUser = userService.setMyInfo(currentUser, signupRequestDto);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/check/phone")
    @Operation(summary = "전화번호 중복 확인", description = "전화번호 중복 확인")
    public ResponseEntity<Boolean> checkPhone(@RequestParam String phone) {
        return ResponseEntity.ok().body(userService.checkPhone(phone));
    }

    @PostMapping("/setmyapt")
    @Operation(summary = "아파트 정보 초기 설정", description = "아파트 초기 설정")
    public ResponseEntity<UserResponseDto> setUserApt(@RequestBody UserAptRequestDto requestDto) {
        // 로그인된 사용자를 가져옴
        User currentUser = userService.getMyInfo().toEntity();
        UserResponseDto userResponseDto = userService.setUserApt(currentUser, requestDto);
        return ResponseEntity.ok(userResponseDto);
    }

    @PutMapping("/update/userInfo")
    @Operation(summary = "회원 정보 수정", description = "회원 정보 수정")
    public ResponseEntity<?> updateUserInfo(@RequestBody UserUpdateRequest request,
                                            @AuthenticationPrincipal UserDetails userDetails) {

        userService.updateUserInfo(userDetails.getUsername(), request);

        return ResponseEntity.ok().body("update successful");
    }
}
