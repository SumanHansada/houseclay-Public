package com.houseclay.backend.service;

import com.houseclay.backend.payload.PresignedURLRequest;
import com.houseclay.backend.payload.PresignedURLResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.*;

import java.net.URL;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PhotoService {

    @Value("${aws.s3.bucketName}")
    private String bucketName;

    private final static int EXPIRATION_TIME = 60; // 60 minutes for better caching

    private final S3Presigner presigner;

    public PhotoService(S3Presigner presigner) {
        this.presigner = presigner;
    }

    public PresignedURLResponse getURLs(PresignedURLRequest request) {
        Map<String, String> fileURLs = new HashMap<>();
        String propertyID = request.getPropertyID();
        for (Map.Entry<String, String> entry : request.getFileMap().entrySet()) {
            fileURLs.put(entry.getKey(), generatePresignedUrl(entry.getKey(), entry.getValue(), propertyID));
        }
        return new PresignedURLResponse(fileURLs);
    }

    public PresignedURLResponse getDeleteURLs(PresignedURLRequest request) {
        Map<String, String> fileURLs = new HashMap<>();
        String propertyID = request.getPropertyID();
        for (Map.Entry<String, String> entry : request.getFileMap().entrySet()) {
            fileURLs.put(entry.getKey(), generateDeletePresignedUrl(entry.getKey(), entry.getValue(), propertyID));
        }
        return new PresignedURLResponse(fileURLs);
    }

    public String generatePresignedUrl(String filename, String contentType, String propertyID) {

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(String.format("properties/%s/photos/%s", propertyID, filename))
                .contentType(contentType)
                .cacheControl("public, max-age=86400, must-revalidate")
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .putObjectRequest(objectRequest)
                .signatureDuration(Duration.ofMinutes(EXPIRATION_TIME))
                .build();

        PresignedPutObjectRequest presignedRequest = presigner.presignPutObject(presignRequest);

        URL url = presignedRequest.url();

        // Close the presigner to release resources
        presigner.close();

        return url.toString();
    }

    public String getObjectPresignedUrl(String objectKey) {
        if(objectKey == null || objectKey.isEmpty()) {
            return "";
        }
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .responseCacheControl("public, max-age=3600, must-revalidate") // 1 hour cache
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .getObjectRequest(getObjectRequest)
                .signatureDuration(Duration.ofMinutes(EXPIRATION_TIME))
                .build();

        URL presignedUrl = presigner.presignGetObject(presignRequest).url();
        return presignedUrl.toString();
    }

    public String generateDeletePresignedUrl(String filename, String contentType, String propertyID) {
        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(String.format("properties/%s/photos/%s", propertyID, filename))
                .build();

        DeleteObjectPresignRequest presignRequest = DeleteObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(EXPIRATION_TIME))
                .deleteObjectRequest(deleteRequest)
                .build();

        PresignedDeleteObjectRequest presignedRequest = presigner.presignDeleteObject(presignRequest);

        URL url = presignedRequest.url();
        presigner.close();

        return url.toString();
    }

}
