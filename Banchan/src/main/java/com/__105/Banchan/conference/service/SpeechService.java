package com.__105.Banchan.conference.service;

import com.__105.Banchan.conference.AudioConvertor;
import com.__105.Banchan.conference.entity.ConfRoom;
import com.__105.Banchan.conference.exception.ConfErrorCode;
import com.__105.Banchan.conference.exception.ConfException;
import com.__105.Banchan.conference.repository.ConfRoomRepository;
import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sound.sampled.*;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SpeechService {

    private final SpeechClient speechClient;
    private final ConfRoomRepository confRoomRepository;

    @Value("${file.record.path}")
    private String openviduUrl;

    private static final int CHUNK_SIZE_IN_SECONDS = 60; // 1분 단위로 분할

    @Transactional
    public String summaryConf(Long roomId) {

        ConfRoom room = confRoomRepository.findById(roomId)
                .orElseThrow(() -> new ConfException(ConfErrorCode.CONFERENCE_NOT_FOUND));

        // convert to wav
        File audioFile = convertFile(room.getRecordingPath());

        // 오디오 파일을 1분 단위로 분할합니다.
        List<byte[]> audioChunks = splitAudioFile(audioFile);

        StringBuilder transcription = new StringBuilder();

        for (byte[] audioChunk : audioChunks) {
            // 인식할 음성 데이터를 설정합니다.
            RecognitionAudio audio = RecognitionAudio.newBuilder()
                    .setContent(ByteString.copyFrom(audioChunk))
                    .build();

            // 인식 구성 설정 (여기서는 한국어로 설정)
            RecognitionConfig config = RecognitionConfig.newBuilder()
                    .setEncoding(RecognitionConfig.AudioEncoding.LINEAR16)
                    .setLanguageCode("ko-KR")
                    .setSampleRateHertz(16000)
                    .setAudioChannelCount(1) // 오디오 채널 수 설정
                    .build();

            // 음성 인식 수행
            RecognizeResponse response = speechClient.recognize(config, audio);

            // 응답 결과에서 텍스트 추출
            response.getResultsList().forEach(result ->
                    transcription.append(result.getAlternativesList().get(0).getTranscript())
                            .append("\n")
            );
        }

        // 인식된 텍스트를 txt 파일로 저장하는 코드입니당!!
        String transcriptionText = transcription.toString();
        saveTranscriptionToFile(transcriptionText, room.getRecordingPath());

        // 인식된 텍스트 반환
        return transcriptionText;
    }

    private File convertFile(String recordInfo) {
        try {
            // AudioConvertor 인스턴스 생성
            AudioConvertor audioConvertor = new AudioConvertor();
            return audioConvertor.convertFile(recordInfo)
                    .orElseThrow(() -> new RuntimeException("Audio file not found"));

        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ConfException(ConfErrorCode.FAIL_CONVERT_FILE);
        }
    }

    private void saveTranscriptionToFile(String transcriptionText, String rpath) {

        try {
            String recordingPath = openviduUrl + rpath;
            String fileName = rpath + ".txt";
            Path path = Paths.get(recordingPath, fileName);
            Files.write(path, transcriptionText.getBytes());
            System.out.println("Transcription saved to file: " + path.toString());
        } catch (IOException e) {
            log.error(e.getMessage());
            throw new ConfException(ConfErrorCode.FAIL_SAVE_TEXTFILE);
        }
    }

    private List<byte[]> splitAudioFile(File audioFile) {

        List<byte[]> audioChunks = new ArrayList<>();

        try (AudioInputStream audioStream = AudioSystem.getAudioInputStream(audioFile)) {
            AudioFormat format = audioStream.getFormat();
            int bytesPerSecond = (int) (format.getFrameRate() * format.getFrameSize());
            int chunkSize = bytesPerSecond * CHUNK_SIZE_IN_SECONDS;

            byte[] buffer = new byte[chunkSize];
            int bytesRead;

            while ((bytesRead = audioStream.read(buffer)) != -1) {
                if (bytesRead < chunkSize) {
                    // 마지막 청크의 크기가 chunkSize보다 작을 수 있음
                    byte[] lastChunk = new byte[bytesRead];
                    System.arraycopy(buffer, 0, lastChunk, 0, bytesRead);
                    audioChunks.add(lastChunk);
                } else {
                    audioChunks.add(buffer.clone());
                }
            }
        } catch (UnsupportedAudioFileException | IOException e) {
            log.error(e.getMessage());
            throw new ConfException(ConfErrorCode.FAIL_SPLIT_AUDIO);
        }

        return audioChunks;
    }
}