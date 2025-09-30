package com.houseclay.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import freemarker.template.Configuration;
import freemarker.template.Template;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;

import javax.activation.DataHandler;
import javax.mail.Message;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;
import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Properties;

@Service
public class EmailService {

    private final Configuration fm;
    private final SesClient ses;
    private final ObjectMapper om = new ObjectMapper();

    @Value("${ses.from}")
    private String from;

    public EmailService(SesClient ses, Configuration fm) {
        this.ses = ses;
        this.fm = fm;
    }

    public void sendEmail(
            String freemarkerTemplate,      // e.g., "welcome.ftl"
            Map<String, Object> model,      // placeholders for the template
            List<String> toAddresses,
            String subject
    ) {
        try {
            // 1) Render FreeMarker template
            Template tpl = fm.getTemplate(freemarkerTemplate);
            StringWriter writer = new StringWriter();
            tpl.process(model, writer);
            String htmlBody = writer.toString();

            // Optional plain text fallback
            String textBody = stripHtml(htmlBody);

            // 2) Build SES request
            SendEmailRequest req = SendEmailRequest.builder()
                    .source(from) // must be a verified sender
                    .destination(Destination.builder()
                            .toAddresses(toAddresses)
                            .build())
                    .message(software.amazon.awssdk.services.ses.model.Message.builder()
                            .subject(Content.builder()
                                    .data(subject)
                                    .charset("UTF-8")
                                    .build())
                            .body(Body.builder()
                                    .html(Content.builder()
                                            .data(htmlBody)
                                            .charset("UTF-8")
                                            .build())
                                    .text(Content.builder()
                                            .data(textBody)
                                            .charset("UTF-8")
                                            .build())
                                    .build())
                            .build())
                    .build();

            // 3) Send
            ses.sendEmail(req);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send FreeMarker-based email via SES", e);
        }
    }


    public void sendWithAttachment(
            String freemarkerTemplate,        // e.g., "invoice.ftl"
            Map<String, Object> model,        // placeholders for the template
            List<String> toAddresses,
            String subject,
            String attachmentFilename,
            byte[] attachmentBytes,
            String attachmentMimeType         // e.g., "application/pdf"
    ) {
        try {
            // 1) Render HTML body with FreeMarker
            Template tpl = fm.getTemplate(freemarkerTemplate);
            StringWriter sw = new StringWriter();
            tpl.process(model, sw);
            String html = sw.toString();

            // (Optional) plain-text fallback
            String text = stripHtml(html);

            // 2) Build MIME message
            Properties props = new Properties();
            Session session = Session.getInstance(props);
            MimeMessage mimeMessage = new MimeMessage(session);

            mimeMessage.setFrom(new InternetAddress(from));
            for (String to : toAddresses) {
                mimeMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
            }
            mimeMessage.setSubject(subject, StandardCharsets.UTF_8.name());

            // mixed -> (alternative -> text/html) + attachment
            MimeMultipart mixed = new MimeMultipart("mixed");
            mimeMessage.setContent(mixed);

            // Body part: alternative (text + html)
            MimeBodyPart bodyPart = new MimeBodyPart();
            MimeMultipart alternative = new MimeMultipart("alternative");

            // text
            MimeBodyPart textPart = new MimeBodyPart();
            textPart.setText(text, StandardCharsets.UTF_8.name());
            alternative.addBodyPart(textPart);

            // html
            MimeBodyPart htmlPart = new MimeBodyPart();
            htmlPart.setContent(html, "text/html; charset=UTF-8");
            alternative.addBodyPart(htmlPart);

            bodyPart.setContent(alternative);
            mixed.addBodyPart(bodyPart);

            // Attachment (optional)
            if (attachmentBytes != null && attachmentBytes.length > 0) {
                MimeBodyPart attachment = new MimeBodyPart();
                attachment.setFileName(attachmentFilename);
                attachment.setDataHandler(new DataHandler(new ByteArrayDataSource(attachmentBytes, attachmentMimeType)));
                mixed.addBodyPart(attachment);
            }

            // 3) Convert to raw bytes and send via SES (Raw)
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            mimeMessage.writeTo(baos);

            SendRawEmailRequest rawReq = SendRawEmailRequest.builder()
                    .source(from)
                    .destinations(toAddresses)
                    .rawMessage(RawMessage.builder()
                            .data(SdkBytes.fromByteArray(baos.toByteArray()))
                            .build())
                    .build();

            ses.sendRawEmail(rawReq);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email with attachment via SES Raw", e);
        }
    }

    private String stripHtml(String html) {
        return html.replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").trim();
    }
}
