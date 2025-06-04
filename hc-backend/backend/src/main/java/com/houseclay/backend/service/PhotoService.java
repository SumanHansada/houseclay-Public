package com.houseclay.backend.service;

import com.houseclay.backend.entity.User;
import com.houseclay.backend.payload.PresignedURLRequest;
import com.houseclay.backend.payload.PresignedURLResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
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

    @Value("${aws.region}")
    private String region;

    @Value("${aws.accessKeyId}")
    private String accessKeyId;

    @Value("${aws.secretAccessKey}")
    private String secretAccessKey;

    public PresignedURLResponse getURLs(PresignedURLRequest request, String phoneNo) {
        Map<String, String> fileURLs = new HashMap<>();
        String propertyID = UUID.randomUUID().toString();
        for (Map.Entry<String, String> entry : request.getFileMap().entrySet()) {
            fileURLs.put(entry.getKey(), generatePresignedUrl(entry.getKey(), entry.getValue(), propertyID, phoneNo));
        }
        return new PresignedURLResponse(propertyID, fileURLs);
    }

    public String generatePresignedUrl(String filename, String contentType, String propertyID, String phoneNo) {
        S3Presigner presigner = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKeyId, secretAccessKey)
                        )
                )
                .build();

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(String.format("users/%s/properties/%s/photos/%s", phoneNo, propertyID, filename))
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
}
