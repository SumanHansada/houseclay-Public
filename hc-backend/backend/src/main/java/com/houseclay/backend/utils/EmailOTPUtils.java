package com.houseclay.backend.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

@Component
public class EmailOTPUtils {

    private static byte[] SIGN_KEY;
    private static byte[] OTP_KEY;
    private static final SecureRandom RAND = new SecureRandom();
    private static final Base64.Encoder B64U_ENC = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder B64U_DEC = Base64.getUrlDecoder();
    public static final String TOKEN_MAP_KEY = "token";
    public static final String OTP_MAP_KEY = "otp";
    private static final int OTP_EXPIRY_TIME = 600;

    public EmailOTPUtils(
            @Value("${otp.sign-key}") String signKeyEncoded,
            @Value("${otp.hash-key}") String hashKeyEncoded
    ) {
        // Decode Base64 → raw bytes (no .getBytes()!)
        SIGN_KEY = Base64.getDecoder().decode(signKeyEncoded);
        OTP_KEY = Base64.getDecoder().decode(hashKeyEncoded);
    }

    public static Map<String, String> generateOTP(String email) throws Exception {
        int otpInt = 1000 + RAND.nextInt(9000);
        String otp = String.valueOf(otpInt);

        long exp = Instant.now().getEpochSecond() + OTP_EXPIRY_TIME;
        String nonce = randomId();
        String otpHash = b64u(hmac(OTP_KEY, otp));

        String payload = email + "|" + exp + "|" + nonce + "|" + otpHash;
        String sig = b64u(hmac(SIGN_KEY, payload));

        String token =  B64U_ENC.encodeToString((email + "|" + exp + "|" + nonce + "|" + otpHash + "|" + sig)
                .getBytes(StandardCharsets.UTF_8));

        return Map.of(TOKEN_MAP_KEY, token, OTP_MAP_KEY, otp);
    }

    public static boolean verifyOTP(String token, String userOtp) throws Exception {
        String decoded = new String(B64U_DEC.decode(token), StandardCharsets.UTF_8);
        String[] parts = decoded.split("\\|");
        if (parts.length != 5) return false;

        String email = parts[0];
        long exp = Long.parseLong(parts[1]);
        String nonce = parts[2];
        String otpHash = parts[3];
        String sig = parts[4];

        if (Instant.now().getEpochSecond() > exp) return false;

        String payload = email + "|" + exp + "|" + nonce + "|" + otpHash;
        String expectedSig = b64u(hmac(SIGN_KEY, payload));
        if (!constantTimeEq(sig, expectedSig)) return false;

        String userOtpHash = b64u(hmac(OTP_KEY, userOtp));
        return constantTimeEq(userOtpHash, otpHash);
    }

    private static String randomId() {
        byte[] b = new byte[12];
        RAND.nextBytes(b);
        return b64u(b);
    }
    private static String b64u(byte[] b) { return B64U_ENC.encodeToString(b); }
    private static byte[] hmac(byte[] key, String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(key, "HmacSHA256"));
        return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
    }
    private static boolean constantTimeEq(String a, String b) {
        if (a.length() != b.length()) return false;
        int r = 0;
        for (int i = 0; i < a.length(); i++) r |= a.charAt(i) ^ b.charAt(i);
        return r == 0;
    }
    private static String mask(String email) {
        int at = email.indexOf('@');
        if (at <= 1) return "***" + email.substring(at);
        return email.charAt(0) + "***" + email.substring(at);
    }
}
