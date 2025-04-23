package com.railease.notification.service;

import com.railease.notification.dto.NotificationRequest;
import com.railease.notification.exception.EmailSendingException;
import com.railease.notification.exception.InvalidNotificationTypeException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;


@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    public void sendNotification(NotificationRequest request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(request.getTo());
            helper.setSubject(resolveSubject(request.getType()));

            Context context = new Context();
            context.setVariables(request.getData());

            String htmlContent = templateEngine.process(resolveTemplate(request.getType()), context);
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new EmailSendingException("Failed to send email to " + request.getTo(), e);
        }
    }

    private String resolveTemplate(String type) {
        return switch (type) {
            case "BOOKING_CONFIRMATION" -> "booking-success";
            case "BOOKING_CANCELLATION" -> "booking-cancel";
            case "PASSWORD_RESET" -> "password-reset";
            default -> throw new InvalidNotificationTypeException("Unknown notification type: " + type);
        };
    }

    private String resolveSubject(String type) {
        return switch (type) {
            case "BOOKING_CONFIRMATION" -> "Your Booking is Confirmed!";
            case "BOOKING_CANCELLATION" -> "Your Booking has been Cancelled";
            case "PASSWORD_RESET" -> "Reset Your RailEase Password";
            default -> "RailEase Notification";
        };
    }
}