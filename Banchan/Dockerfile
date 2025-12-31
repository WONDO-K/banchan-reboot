# 베이스 이미지 설정 (OpenJDK 17)
FROM openjdk:17-jdk-slim

# 빌드 타임 변수 설정
ARG APP_HOME=/app
ARG APP_JAR=Banchan-0.0.1-SNAPSHOT.jar
ARG APP_TARGET=build/libs

WORKDIR $APP_HOME

# Gradle 설치
RUN apt-get update && apt-get install -y wget unzip dos2unix \
    && wget https://services.gradle.org/distributions/gradle-7.3.3-bin.zip \
    && unzip gradle-7.3.3-bin.zip -d /opt \
    && rm gradle-7.3.3-bin.zip \
    && ln -s /opt/gradle-7.3.3/bin/gradle /usr/bin/gradle

# Gradle과 프로젝트 관련 파일들을 복사
COPY build.gradle settings.gradle gradle /app/
COPY gradlew /app/gradlew
COPY gradlew.bat /app/gradlew.bat
COPY gradle/wrapper /app/gradle/wrapper
COPY src /app/src

# gradlew에 실행 권한 추가 및 dos2unix 변환
RUN chmod +x /app/gradlew && dos2unix /app/gradlew

# Gradle을 사용하여 애플리케이션 빌드
RUN ./gradlew build

# 애플리케이션 실행 명령어 설정
CMD ["java", "-jar", "build/libs/Banchan-0.0.1-SNAPSHOT.jar"]