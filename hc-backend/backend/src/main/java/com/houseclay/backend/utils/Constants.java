package com.houseclay.backend.utils;

public class Constants {

    public static final String TOKEN_KEY = "token";

    public static final String ADMIN_TOKEN_KEY = "admin-token";

    public static final java.util.List<String> EMAIL_DOMAIN_DENYLIST = java.util.List.of(
            // --- GLOBAL GIANTS ---
            "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.in", "yahoo.in", "yahoo.co.uk",
            "hotmail.com", "hotmail.co.in", "hotmail.co.uk", "outlook.com", "outlook.in", "live.com",
            "msn.com", "aol.com", "icloud.com", "me.com", "mac.com",
            // --- INDIA SPECIFIC ---
            "rediffmail.com", "rediff.com", "sify.com", "indiatimes.com", "zapak.com", "in.com",
            "bsnl.in", "mtnl.net.in",
            // --- BUSINESS SUITES (Public Domains) ---
            "zoho.com", "zoho.in", "yandex.com", "protonmail.com", "proton.me", "pm.me",
            "tutanota.com", "tutanota.de", "gmx.com", "gmx.us", "mail.com", "inbox.com",
            "fastmail.com", "fastmail.fm",
            // --- DISPOSABLE / TEMP MAIL ---
            "mailinator.com", "yopmail.com", "temp-mail.org", "tempmail.com",
            "10minutemail.com", "guerrillamail.com", "sharklasers.com",
            "throwawaymail.com", "getairmail.com"
    );

    public static final java.util.List<String> DISPOSABLE_DOMAIN_LIST = java.util.List.of(
            "mailinator.com", "yopmail.com", "temp-mail.org", "tempmail.com",
            "10minutemail.com", "guerrillamail.com", "sharklasers.com",
            "throwawaymail.com", "getairmail.com"
    );
}
