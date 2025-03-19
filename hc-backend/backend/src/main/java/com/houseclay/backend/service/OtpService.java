package com.houseclay.backend.service;

import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpSession;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private static final int OTP_EXPIRY_MINUTES = 10;

    private static final Map<String, OtpData> otpMap = new HashMap<>();

    public void generateOtp(String phoneNo) {
        String otp = "0000"; // Replace this with MSG91 API call.
        long expiryTime = System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(OTP_EXPIRY_MINUTES);

        OtpData otpData = new OtpData(otp, expiryTime);

        otpMap.put("OTP_" + phoneNo, otpData); // Store OTP in session
    }

    public boolean validateOtp(String phoneNo, String otp) {
        OtpData storedOtpData = (OtpData) otpMap.get("OTP_" + phoneNo);

        if (storedOtpData == null || !storedOtpData.getOtp().equals(otp)) {
            return false;
        }

        if (System.currentTimeMillis() > storedOtpData.getExpiryTime()) {
            otpMap.remove("OTP_" + phoneNo); // Expire OTP
            return false;
        }

        otpMap.remove("OTP_" + phoneNo); // Remove OTP after successful validation
        return true;
    }

    private static class OtpData {
        private final String otp;
        private final long expiryTime;

        public OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public long getExpiryTime() {
            return expiryTime;
        }
    }
}
