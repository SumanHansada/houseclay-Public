package com.houseclay.backend.utils;

public class Constants {

    public static final String TOKEN_KEY = "token";

    public static final String ADMIN_TOKEN_KEY = "admin-token";

    public static final String BUNDLE_DATA = """
        [
          {
           "id": "BASIC_BLUE_BUNDLE",
           "title": "Basic",
           "subTitle": "Blue Bundle",
           "connects": 10,
           "originalPrice": 990,
           "discountedPrice": 891,
           "discount": "10% Off",
           "validity": "60 Days",
           "borderColor": "border-blue-400",
           "backgroundColor": "bg-blue-400",
           "selected": false,
           "background": "blue-bundle"
          },
          {
           "id": "PREMIUM_GOLD_BUNDLE",
           "title": "Premium",
           "subTitle": "Gold Bundle",
           "connects": 30,
           "originalPrice": 2970,
           "discountedPrice": 2524,
           "discount": "15% Off",
           "validity": "60 Days",
           "borderColor": "border-yellow-400",
           "backgroundColor": "bg-yellow-400",
           "selected": false,
           "recommended": true,
           "background": "gold-bundle"
          },
          {
           "id": "ELITE_PURPLE_BUNDLE",
           "title": "Elite",
           "subTitle": "Purple Bundle",
           "connects": 50,
           "originalPrice": 4950,
           "discountedPrice": 3960,
           "discount": "20% Off",
           "validity": "60 Days",
           "borderColor": "border-purple-400",
           "backgroundColor": "bg-purple-400",
           "selected": false,
           "background": "purple-bundle"
          },
          {
           "id": "CUSTOM_CONNECTS",
           "title": "Custom",
           "subTitle": "Purple Bundle",
           "originalPrice": 199,
           "discountedPrice": 99,
           "discount": "50% Off",
           "validity": "60 Days",
           "borderColor": "border-purple-400",
           "backgroundColor": "bg-purple-400",
           "selected": false,
           "background": "purple-bundle"
          }
        ]
        """;
}
