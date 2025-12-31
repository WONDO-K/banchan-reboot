package com.__105.Banchan.user.service;

import com.__105.Banchan.user.dto.*;
import com.__105.Banchan.user.entity.User;

public interface UserService {
    UserResponseDto getMyInfo();

    boolean checkPhone(String phone);

    User  setMyInfo(User user, SignupRequestDto signupRequestDto);

    UserResponseDto setUserApt(User user, UserAptRequestDto requestDto);

    void updateUserInfo(String username, UserUpdateRequest request);
}
