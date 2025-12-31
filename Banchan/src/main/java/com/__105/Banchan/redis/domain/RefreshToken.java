package com.__105.Banchan.redis.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.io.Serializable;

@Getter
@AllArgsConstructor
/*
* Hash Collection을 명시하는 어노테이션
* RedisHash의 key는 value인 jwtToken과 @Id가 붙은 id 필드의 값을 합성하여 사용
* */
@RedisHash(value = "jwtToken", timeToLive = 24 * 60 * 60) // 24시간,
public class RefreshToken implements Serializable { // RefreshToken 객체의 직렬화와 역직렬화가 지원되도록 마커 인터페이스인 Serializable 인터페이스를 구현

    @Id // Spring Data Redis에서 제공하는 Id
    private String id;

    @Indexed // @Indexed 애너테이션을 사용하면 JPA를 사용하듯이 findByAccessToken과 같은 요청 가능, RefreshToken을 찾을때 AccessToken 기반으로 찾을 것
    private String accessToken;

    private String refreshToken;

    public void updateAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

}
