package com.houseclay.backend.service;

import com.houseclay.backend.payload.PresignedURLRequest;
import com.houseclay.backend.payload.PresignedURLResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URL;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PhotoService {

    @Value("${aws.s3.bucketName}")
    private String bucketName;

    private final static int EXPIRATION_TIME = 1;

    private final S3Presigner presigner;

    public PhotoService(S3Presigner presigner) {
        this.presigner = presigner;
    }

    public PresignedURLResponse getURLs(PresignedURLRequest request) {
        Map<String, String> fileURLs = new HashMap<>();
        String propertyID = UUID.randomUUID().toString();
        for (Map.Entry<String, String> entry : request.getFileMap().entrySet()) {
            fileURLs.put(entry.getKey(), generatePresignedUrl(entry.getKey(), entry.getValue(), propertyID));
        }
        return new PresignedURLResponse(propertyID, fileURLs);
    }

    public String generatePresignedUrl(String filename, String contentType, String propertyID) {

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(String.format("properties/%s/photos/%s", propertyID, filename))
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .putObjectRequest(objectRequest)
                .signatureDuration(Duration.ofMinutes(10))
                .build();

        PresignedPutObjectRequest presignedRequest = presigner.presignPutObject(presignRequest);

        URL url = presignedRequest.url();

        // Close the presigner to release resources
        presigner.close();

        return url.toString();
    }

    public String getObjectPresignedUrl(String objectKey) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .getObjectRequest(getObjectRequest)
                .signatureDuration(Duration.ofMinutes(EXPIRATION_TIME))
                .build();

        URL presignedUrl = presigner.presignGetObject(presignRequest).url();
        return presignedUrl.toString();
    }
}
