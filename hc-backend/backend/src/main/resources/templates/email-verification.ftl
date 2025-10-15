<#-- /email-verification.ftl -->
<#-- Expected data model:
  subject: string
  userFirstName: string (optional)
  verifyRedirect: string (absolute)  // if not provided, falls back to baseUrl
  siteName: string ("Houseclay")
  footerAddress: string (optional)
  baseUrl: string (optional, defaults to https://houseclay.com)
-->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject?html}</title>

  <!-- Webfonts (fallbacks included in CSS) -->
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&family=Public+Sans:wght@600;700&display=swap" rel="stylesheet">

  <style>
    /* Client resets */
    body, table, td, a { 
      text-size-adjust:100%; 
      -webkit-text-size-adjust:100%; 
    }
    table, td { 
      border-collapse:collapse !important; 
    }
    img { 
      border:0; 
      outline:none; 
      text-decoration:none; 
      display:block; 
      line-height:1; 
    }
    a { 
      text-decoration:none; 
    }
    body { 
      margin:0; 
      padding:0; 
      width:100% !important; 
      background:#f6f7fb; 
    }

    /* Layout */
    .wrapper   { 
      width:100%; 
      background:#f6f7fb; 
      padding:24px 0; 
    }
    .outer     { 
      padding-left:0; 
      padding-right:0; 
    }

    .brand-outer { 
      width:100%; 
      max-width:900px; 
      text-align:center; 
    }
    .brand-outer img { 
      height:36px; 
      width:auto; 
      max-width:180px; 
      margin:0 auto; 
    }

    .container { 
      width:100%; 
      max-width:900px; 
      background:#ffffff; 
      border:0; 
      border-radius:20px; 
      box-shadow:0 4px 6px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04); }
    .inner     { 
      padding:24px 100px; 
    }

    /* Sections */
    .hero { 
      text-align:center; 
      padding:8px 0 0 0; 
    }
    .hero img { 
      width:282px; 
      height:282px; 
      max-width:100%; 
      margin:0 auto; 
    }

    /* Typography */
    .heading-xl { 
      font-family:"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
      font-weight:700; 
      color:#111827; 
      margin:16px 0 4px 0; 
      line-height:1.3; 
    }

    .p          { 
      font-family:"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
      font-weight:400; 
      color:#374151; 
      margin:12px 0 2px 0; 
      line-height:1.6; 
    }
    .h4         { 
      font-family:"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
      font-weight:600; 
      color:#111827; 
      margin:24px 0 4px 0; 
    }

    /* Button */
    .main-button { 
      padding: 10px 18px;
      background-color: #ef4444;
      color: #ffffff !important;
      border: 0;
      border-radius: 6px;
      font-family:"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
      font-weight:600;
      text-align: center;
      display: inline-block;
      line-height: 1.2;
    }

    /* Footer */
    .footer { 
      text-align:left; 
      padding:0 24px 24px 24px; 
    }
    .muted  { 
      color:#6b7280; 
      font-size:12px; 
      line-height:1.6;
      font-family:"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif; 
    }

    /* --- Breakpoints (only these three) --- */
    /* Mobile: <768px (base) */
    .heading-xl { font-size:22px; }
    .p          { font-size:14px; }
    .hero img   { width:220px; height:220px; }
    .inner      { padding:20px; }

    @media only screen and (max-width:767px) {
      .outer { padding-left:16px !important; padding-right:16px !important; }
    }

    /* Tablet: 768px–1023px */
    @media only screen and (min-width:768px) and (max-width:1023px) {
      .heading-xl { font-size:24px; }
      .p          { font-size:15px; }
      .hero img   { width:260px; height:260px; }
      .inner      { padding:24px 60px; }
      .outer { padding-left:24px !important; padding-right:24px !important; }
    }

    /* Desktop: ≥1024px */
    @media only screen and (min-width:1024px) {
      .heading-xl { font-size:28px; }
      .p          { font-size:16px; }
      .hero img   { width:282px; height:282px; }
      .inner      { padding:24px 100px; }
      .outer { padding-left:0 !important; padding-right:0 !important; }
    }
  </style>
</head>
<body>
  <center class="wrapper">
    <table role="presentation" width="100%" bgcolor="#f6f7fb">
      <tr>
        <!-- GUTTERS live here to avoid horizontal scroll in clients -->
        <td align="center" valign="top" class="outer">

          <!-- Brand OUTSIDE the card -->
          <table role="presentation" class="brand-outer" width="100%" style="max-width:900px; margin:0 auto;">
            <tr>
              <td align="center" style="padding:16px 0;">
                <a href="${(baseUrl!'')?html}">
                  <img src="https://houseclay-email-img.s3.ap-south-1.amazonaws.com/houseclay-logo.png" alt="${(siteName!'Houseclay')?html} logo">
                </a>
              </td>
            </tr>
          </table>

          <!-- Card container -->
          <table role="presentation" class="container" width="100%" style="max-width:900px; margin:0 auto;">
            <!-- Hero -->
            <tr>
              <td class="hero">
                <img src="https://houseclay-email-img.s3.ap-south-1.amazonaws.com/email-verification.png" alt="Verification illustration">
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td class="inner">

                <div class="heading-xl">Verify your email address to get started</div>

                  <p class="p">
                  <#if userFirstName?? && (userFirstName?length > 0)>
                    Hi ${userFirstName?html},
                  <#else>
                    Hi,
                  </#if>
                </p>

                <p class="p">To activate your account and enjoy full access to Houseclay, please verify your email address. This helps us keep your account secure and ensures you never miss property updates.</p>

                <div class="h4">Get 1 free connect after email verification.</div>

                <!-- Bulletproof CTA button -->
                <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 12px 0;">
                  <tr>
                    <td align="center">
                      <!--[if mso]>
                      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${(verifyRedirect!(baseUrl!'https://houseclay.com'))?html}" style="height:40px;v-text-anchor:middle;width:200px;" arcsize="10%" stroke="f" fillcolor="#ef4444">
                        <w:anchorlock/>
                        <center style="color:#ffffff;font-family:Public Sans, Arial, sans-serif;font-size:16px;font-weight:600;">Verify Email</center>
                      </v:roundrect>
                      <![endif]-->
                      <!--[if !mso]><!-->
                      <a href="${(verifyRedirect!(baseUrl!'https://houseclay.com'))?html}"
                         target="_blank" rel="noopener"
                         class="main-button"
                         style="padding:10px 18px;background-color:#ef4444;color:#ffffff !important;border-radius:6px;display:inline-block;font-weight:600;font-family:'Public Sans', Arial, sans-serif;font-size:16px;">
                        Verify Email
                      </a>
                      <!--<![endif]-->
                    </td>
                  </tr>
                </table>

                <p class="p" style="margin:0 0 28px 0;">
                  If you didn't create this account, please ignore this email.
                </p>

                <p class="p" style="margin-bottom:8px;">
                  Best regards,<br>
                  ${(siteName!'Houseclay')?html} Team
                </p>

                <!-- Optional footer
                <div class="footer">
                  <p class="muted">${(footerAddress!'')}</p>
                </div> -->
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </center>
</body>
</html>
