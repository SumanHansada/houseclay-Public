package com.houseclay.backend.service;

// @Service
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;

import javax.mail.*;
import javax.mail.internet.*;
import javax.activation.DataHandler;

import freemarker.template.Configuration;
import freemarker.template.Template;

import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class EmailService {

//    private final Configuration fm;
//    private final SesClient ses;
//    private final ObjectMapper om = new ObjectMapper();
//
//    @Value("${ses.from}")
//    private String from;
//
//    public EmailService(SesClient ses, Configuration fm) {
//        this.ses = ses;
//        this.fm = fm;
//    }
//
//    /**
//     * PATH A: Send using an SES stored template (no attachments).
//     * Templates live in SES (CreateEmailTemplate), placeholders like {{firstName}}.
//     */
//    public void sendUsingSesTemplate(
//            String sesTemplateName,
//            Map<String, Object> model,
//            List<String> toAddresses,
//            String subjectOverride // optional; pass null to use template's subject
//    ) {
//        try {
//            String templateDataJson = om.writeValueAsString(model);
//
//            TemplateMetadata meta = null;
//            // subjectOverride is optional: SES will use template's subject if null
//            EmailContent content = EmailContent.builder()
//                    .template(Template.builder()
//                            .templateName(sesTemplateName)
//                            .templateData(templateDataJson)
//                            .build())
//                    .build();
//
//            SendEmailRequest.Builder req = SendEmailRequest.builder()
//                    .fromEmailAddress(from)
//                    .destination(Destination.builder().toAddresses(toAddresses).build())
//                    .content(content);
//
//            if (subjectOverride != null && !subjectOverride.isBlank()) {
//                // If you want to override: use "Simple" or "Raw". SES Template path doesn't support overriding subject directly.
//                // Workaround: include subject in your template definition or switch to Simple.
//                // For clarity, we leave as-is. You can remove subjectOverride or move subject to SES template.
//            }
//
//            ses.sendEmail(req.build());
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to send templated email via SES Template", e);
//        }
//    }
//
//    /**
//     * PATH B: Send email WITH attachment via Raw MIME.
//     * Body is rendered from a FreeMarker template on the server, so we can still use placeholders.
//     */
//    public void sendWithAttachment(
//            String freemarkerTemplate,        // e.g., "invoice.ftl"
//            Map<String, Object> model,        // placeholders for the template
//            List<String> toAddresses,
//            String subject,
//            String attachmentFilename,
//            byte[] attachmentBytes,
//            String attachmentMimeType         // e.g., "application/pdf"
//    ) {
//        try {
//            // 1) Render HTML body with FreeMarker
//            Template tpl = fm.getTemplate(freemarkerTemplate);
//            StringWriter sw = new StringWriter();
//            tpl.process(model, sw);
//            String html = sw.toString();
//
//            // (Optional) also build a plain text fallback
//            String text = stripHtml(html);
//
//            // 2) Build MIME message
//            Properties props = new Properties();
//            Session session = Session.getInstance(props);
//            MimeMessage message = new MimeMessage(session);
//
//            message.setFrom(new InternetAddress(from));
//            for (String to : toAddresses) {
//                message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
//            }
//            message.setSubject(subject, StandardCharsets.UTF_8.name());
//
//            // mixed -> (alternative -> text/html) + attachment
//            MimeMultipart mixed = new MimeMultipart("mixed");
//            message.setContent(mixed);
//
//            // Body part: alternative (text + html)
//            MimeBodyPart bodyPart = new MimeBodyPart();
//            MimeMultipart alternative = new MimeMultipart("alternative");
//
//            // text
//            MimeBodyPart textPart = new MimeBodyPart();
//            textPart.setText(text, StandardCharsets.UTF_8.name());
//            alternative.addBodyPart(textPart);
//
//            // html
//            MimeBodyPart htmlPart = new MimeBodyPart();
//            htmlPart.setContent(html, "text/html; charset=UTF-8");
//            alternative.addBodyPart(htmlPart);
//
//            bodyPart.setContent(alternative);
//            mixed.addBodyPart(bodyPart);
//
//            // Attachment
//            if (attachmentBytes != null && attachmentBytes.length > 0) {
//                MimeBodyPart attachment = new MimeBodyPart();
//                attachment.setFileName(attachmentFilename);
//                attachment.setDataHandler(new DataHandler(new ByteArrayDataSource(attachmentBytes, attachmentMimeType)));
//                mixed.addBodyPart(attachment);
//            }
//
//            // 3) Convert to raw bytes and send via SES (Raw)
//            ByteArrayOutputStream baos = new ByteArrayOutputStream();
//            message.writeTo(baos);
//            byte[] rawBytes = baos.toByteArray();
//
//            SendEmailRequest req = SendEmailRequest.builder()
//                    .fromEmailAddress(from)
//                    .destination(Destination.builder().toAddresses(toAddresses).build())
//                    .content(EmailContent.builder()
//                            .raw(RawMessage.builder()
//                                    .data(SdkBytes.fromByteArray(rawBytes))
//                                    .build())
//                            .build())
//                    .build();
//
//            ses.sendEmail(req);
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to send email with attachment via SES Raw", e);
//        }
//    }
//
//    private String stripHtml(String html) {
//        return html.replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").trim();
//    }
}

