package com.__105.Banchan.admin.service;

import com.__105.Banchan.admin.dto.UserListDto;
import com.__105.Banchan.user.dto.UserResponseDto;
import com.__105.Banchan.user.enums.Role;
import org.springframework.security.core.AuthenticationException;

import java.util.List;

public interface AdminService {

    List<UserListDto> getUserList(String username);

    void approvalSignUp(String username) throws AuthenticationException;

    void revokeUser(String username) throws AuthenticationException;

    UserResponseDto getUserDetail(String username) throws AuthenticationException;

    void grantRole(String username, Role role) throws AuthenticationException;

    List<UserListDto> getApprovalUserList(String username);
}
