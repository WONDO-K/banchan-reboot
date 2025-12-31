package com.__105.Banchan.admin.service.impl;

import com.__105.Banchan.admin.dto.UserListDto;
import com.__105.Banchan.admin.service.AdminService;
import com.__105.Banchan.common.exception.CustomException;
import com.__105.Banchan.common.exception.ErrorCode;

import com.__105.Banchan.user.dto.UserResponseDto;
import com.__105.Banchan.user.entity.User;
import com.__105.Banchan.user.entity.UserApartment;
import com.__105.Banchan.user.enums.Role;
import com.__105.Banchan.user.repository.UserAptRepository;
import com.__105.Banchan.user.repository.UserRepository;
import com.__105.Banchan.user.service.UserService;

import lombok.RequiredArgsConstructor;
import org.apache.catalina.security.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserService userService;

    private final UserRepository userRepository;
    private final UserAptRepository userAptRepository;
    private final Logger log = LoggerFactory.getLogger(SecurityUtil.class);

    @Override
    @Transactional(readOnly = true)
    public List<UserListDto> getUserList(String username) {

        User admin = userService.getMyInfo().toEntity();
        log.info("관리자 유저 리스트 조회");

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String aptCode = user.getUserApartments()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Not Found User's Apt"))
                .getApartment().getCode();

        List<User> users = userRepository.findAllUserSameApt(aptCode);

        return users.stream()
                .map(UserListDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public void approvalSignUp(String username) throws AuthenticationException {

        // requestDto에서 username을 꺼낼 수도 있지만 user가 없을 경우를 대비해 username으로 user를 찾아온 후에 userApt를 찾아옴
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        UserApartment userApt = userAptRepository.findByUser(user)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_APARTMENT_NOT_FOUND));

        userApt.setGranted(true);

        userAptRepository.save(userApt);

        log.info("승인 완료");
    }

    @Override
    public void revokeUser(String username) throws AuthenticationException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        userRepository.delete(user); // @OntoMany(mappedBy = "user")로 설정해놔서 user를 삭제하면 userApt도 같이 삭제됨
        log.info("삭제 완료");
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getUserDetail(String username) throws AuthenticationException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        log.info("유저 상세 정보 조회");
        return new UserResponseDto(user);
    }

    @Override
    public void grantRole(String username, Role role) throws AuthenticationException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // Role에 따라 분기 처리
        switch (role) {
            case ADMIN:
                // ADMIN 권한 부여 처리
                log.info("사용자 {}의 권한을 ADMIN으로 설정합니다.", username);
                user.setRole(Role.ADMIN);
                break;
            case BUILDING_ADMIN:
                // BUILDING_ADMIN 권한 부여 처리
                log.info("사용자 {}의 권한을 BUILDING_ADMIN으로 설정합니다.", username);
                user.setRole(Role.BUILDING_ADMIN);
                break;
            case USER:
                // USER 권한 부여 처리
                log.info("사용자 {}의 권한을 USER로 설정합니다.", username);
                user.setRole(Role.USER);
                break;
            default:
                // 예상치 못한 Role 값에 대한 예외 처리
                log.warn("유효하지 않은 권한 값이 제공되었습니다: {}", role);
                throw new CustomException(ErrorCode.INVALID_PARAMETER);
        }

        // 등록된 아파트에 대해서 권한 true 변경
        user.getUserApartments().stream()
                .findFirst()
                .orElseThrow(() -> new CustomException(ErrorCode.USER_APARTMENT_NOT_FOUND))
                .setIsGranted();

        // Role이 설정된 후 저장
        userRepository.save(user);
        log.info("권한 부여가 완료되었습니다.");
    }

    @Override
    public List<UserListDto> getApprovalUserList(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String aptCode = user.getUserApartments()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Not Found User's Apt"))
                .getApartment().getCode();

        List<User> users = userRepository.findUsersInGrantedApartment(aptCode);
        log.info("권환 미부여 회원 정보 조회");

        return users.stream()
                .map(UserListDto::from)
                .collect(Collectors.toList());
    }
}
