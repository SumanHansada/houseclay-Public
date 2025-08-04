package com.houseclay.backend.service;

import com.houseclay.backend.entity.*;
import com.razorpay.Utils;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.repository.ConnectTransactionRepository;
import com.houseclay.backend.repository.ExternalPaymentsRepository;
import com.houseclay.backend.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import jakarta.annotation.PostConstruct;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConnectTransactionRepository connectTransactionRepository;

    @Autowired
    private ExternalPaymentsRepository externalPaymentsRepository;

    private RazorpayClient razorpayClient;

    @Value("${razorpay.key_id}")
    private String keyId;

    @Value("${razorpay.key_secret}")
    private String razorpaySecret;

    private static final int CONNECT_RATE = 50;

    @PostConstruct
    public void init() throws Exception {
        this.razorpayClient = new RazorpayClient(keyId, razorpaySecret);
    }

    public JSONObject createOrder(User user, int amount) throws Exception {
        Optional<User> userOpt = userRepository.findById(user.getPhoneNo());
        if (userOpt.isEmpty()) {
            throw new APIException("Invalid token", HttpStatus.BAD_REQUEST);
        }
        user = userOpt.get();

        // Creating razor pay object
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "received_100");

        Order order = razorpayClient.orders.create(orderRequest);
        String orderID = (String) order.toJson().get("id");

        // Saving order in external payment entity.
        ExternalPayments externalPayments = new ExternalPayments();
        externalPayments.setAmount(amount);
        externalPayments.setPaymentId(orderID);
        externalPayments.setAmount(amount);
        externalPayments.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        externalPayments.setStatus(ExternalPaymentStatus.IN_PROGRESS);
        externalPayments.setUser(user);
        externalPaymentsRepository.save(externalPayments);

        return order.toJson();
    }

    private boolean verifySignature(String orderId, String paymentId, String signature) throws Exception {

        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", orderId);
        options.put("razorpay_payment_id", paymentId);
        options.put("razorpay_signature", signature);

        return  Utils.verifyPaymentSignature(options, razorpaySecret);
//        String payload = orderId + "|" + paymentId;
//        Mac mac = Mac.getInstance("HmacSHA256");
//        SecretKeySpec secretKeySpec = new SecretKeySpec(razorpaySecret.getBytes(), "HmacSHA256");
//        mac.init(secretKeySpec);
//        byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
//        String generatedSignature = new String(Base64.getEncoder().encode(hash));
//        return generatedSignature.equals(signature);
    }

    @Transactional
    public ResponseEntity<String> verifyPayment(
            String paymentId,
            String orderId,
            String signature,
            User user
    ) {
        try {
            if (!verifySignature(orderId, paymentId, signature)) {
                return ResponseEntity.badRequest().body("Invalid signature. Payment verification failed.");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Signature verification error: " + e.getMessage());
        }

        Optional<ExternalPayments> optionalExternalPayments = externalPaymentsRepository.findById(orderId);
        if (optionalExternalPayments.isEmpty()) {
            return ResponseEntity.badRequest().body("Order not found");
        }

        ExternalPayments payment =  optionalExternalPayments.get();

        if (user.getPhoneNo().equals(payment.getUser().getPhoneNo())) {
            return ResponseEntity.badRequest().body("User not found");
        }

        user = payment.getUser();

        payment.setSignature(signature);
        payment.setRazorPaymentId(paymentId);
        payment.setStatus(ExternalPaymentStatus.COMPLETED);
        payment.setCompletedAt(new Timestamp(System.currentTimeMillis()));

        int connectQuantity = (int)payment.getAmount()/CONNECT_RATE;

        for (int i = 0; i < connectQuantity; i++) {

            ConnectEvent connectEvent = new ConnectEvent();
            connectEvent.setEventType(ConnectEventType.CREATED);
            connectEvent.setActorType(ActorType.USER);
            connectEvent.setActorId(user.getPhoneNo());

            Connect connect = new Connect();
            connect.setSourceType(ConnectSourceType.EXTERNAL_PAYMENT);
            connect.setSourceId(payment.getPaymentId());
            connect.setUser(user);
            connect.setStatus(ConnectStatus.ACTIVE);
            connect.getEvents().add(connectEvent);

            user.getConnects().add(connect);
        }
        user.setConnectBal(user.getConnectBal() + connectQuantity);
        userRepository.save(user);


        return ResponseEntity.ok("Payment verified and balance updated");
    }
}


