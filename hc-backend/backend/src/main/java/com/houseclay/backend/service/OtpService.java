package com.houseclay.backend.service;

import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpSession;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private static final int OTP_EXPIRY_MINUTES = 1;

    public void generateOtp(String phoneNo, HttpSession session) {
        String otp = "0000"; // Replace this with MSG91 API call.
        long expiryTime = System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(OTP_EXPIRY_MINUTES);

        OtpData otpData = new OtpData(otp, expiryTime);

        session.setAttribute("OTP_" + phoneNo, otpData); // Store OTP in session
    }

    public boolean validateOtp(String phoneNo, String otp, HttpSession session) {
        OtpData storedOtpData = (OtpData) session.getAttribute("OTP_" + phoneNo);

        if (storedOtpData == null || !storedOtpData.getOtp().equals(otp)) {
            return false;
        }

        if (System.currentTimeMillis() > storedOtpData.getExpiryTime()) {
            session.removeAttribute("OTP_" + phoneNo); // Expire OTP
            return false;
        }

        session.removeAttribute("OTP_" + phoneNo); // Remove OTP after successful validation
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
