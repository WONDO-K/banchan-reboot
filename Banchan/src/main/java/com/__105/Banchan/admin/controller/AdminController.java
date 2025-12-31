package com.__105.Banchan.admin.controller;

import com.__105.Banchan.admin.service.AdminService;
import com.__105.Banchan.user.enums.Role;
import com.__105.Banchan.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;
    private final Logger log = LoggerFactory.getLogger(getClass());

    @GetMapping("/users/list")
    @Operation(summary = "유저 리스트 조회", description = "유저 리스트 조회")
    public ResponseEntity<?> getUserList() {
        String currentUserRole = userService.getMyInfo().getRole();
        log.info("Current user's role: " + currentUserRole);

        if (!currentUserRole.equals(Role.ADMIN.toString())) {
            log.warn("권한이 없습니다.");
            return ResponseEntity.badRequest().body("권한이 없습니다.");
        }
        String username = userService.getMyInfo().getUsername();
        return ResponseEntity.ok().body(adminService.getUserList(username));
    }

    @PostMapping("users/approval/{username}")
    @Operation(summary = "회원가입 승인", description = "회원가입 승인")
    public ResponseEntity<?> approvalSignUp(@PathVariable String username) {
        String currentUserRole = userService.getMyInfo().getRole();
        if (!currentUserRole.equals(Role.ADMIN.toString())) {
            log.warn("권한이 없습니다.");
            return ResponseEntity.badRequest().body("권한이 없습니다.");
        }
        adminService.approvalSignUp(username);
        return ResponseEntity.ok().body("승인 완료");
    }

    @GetMapping("/users/approval")
    @Operation(summary = "회원가입 대기 인원 목록", description = "회원가입 대기 인원 목록을 조회합니다.")
    public ResponseEntity<?> getApprovalUserList() {
        String currentUserRole = userService.getMyInfo().getRole();
        if (!currentUserRole.equals(Role.ADMIN.toString())) {
            log.warn("권한이 없습니다.");
            return ResponseEntity.badRequest().body("권한이 없습니다.");
        }
        String username = userService.getMyInfo().getUsername();
        return ResponseEntity.ok().body(adminService.getApprovalUserList(username));
    }

    @DeleteMapping("/users/revoke/{username}")
    @Operation(summary = "회원 삭제", description = "회원 삭제")
    public ResponseEntity<?> revokeUser(@PathVariable String username) {
        String currentUserRole = userService.getMyInfo().getRole();
        if (!currentUserRole.equals(Role.ADMIN.toString())) {
            log.warn("권한이 없습니다.");
            return ResponseEntity.badRequest().body("권한이 없습니다.");
        }
        adminService.revokeUser(username);
        return ResponseEntity.ok().body("삭제 완료");
    }

    @GetMapping("/users/detail/{username}")
    @Operation(summary = "유저 상세 정보 조회", description = "유저 상세 정보 조회")
    public ResponseEntity<?> getUserDetail(@PathVariable String username) {
        String currentUserRole = userService.getMyInfo().getRole();
        if (!currentUserRole.equals(Role.ADMIN.toString())) {
            log.warn("권한이 없습니다.");
            return ResponseEntity.badRequest().body("권한이 없습니다.");
        }
        return ResponseEntity.ok().body(adminService.getUserDetail(username));
    }

    @PostMapping("/users/grant/{username}")
    @Operation(summary = "권한 부여", description = "권한 부여")
    public ResponseEntity<?> grantRole(@PathVariable String username, @RequestParam Role newRole) {
        String currentUserRole = userService.getMyInfo().getRole();
        if (!currentUserRole.equals(Role.ADMIN.toString())) {
            log.warn("권한이 없습니다.");
            return ResponseEntity.badRequest().body("권한이 없습니다.");
        }

        adminService.grantRole(username, newRole);
        return ResponseEntity.ok().body("권한 부여 완료");
    }
}