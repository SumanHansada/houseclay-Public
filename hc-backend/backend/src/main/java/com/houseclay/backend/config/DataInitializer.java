package com.houseclay.backend.config;

import com.houseclay.backend.entity.*;
import com.houseclay.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initTestData(AdminRepository adminRepo,
                                   UserRepository userRepo,
                                   PropertyRepository propertyRepo,
                                   UserLoginRepository userLoginRepo,
                                   AdminLoginRepository adminLoginRepo,
                                   ReportPropertyRepository reportRepo,
                                   LeadRepository leadRepo,
                                   ExternalPaymentsRepository paymentRepo,
                                   ConnectTransactionRepository connectRepo,
                                   PropertyActionRepository propertyActionRepo) {
        return args -> {

            // ✅ Admin
            Admin admin = new Admin();
            admin.setUsername("admin1");
            admin.setPassword("admin123");
            admin.setName("Test Admin");
            adminRepo.save(admin);

            // ✅ AdminLogin
            AdminLogin adminLogin = new AdminLogin(admin, "token-admin-1");
            adminLoginRepo.save(adminLogin);

            // ✅ Users
            User user = new User("9999999999", "Test User", "user@example.com");
            user.setConnectBal(10);
            user.setBlacklisted(false);
            user.setDeleted(false);
            user.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            userRepo.save(user);

            User blacklistedUser = new User("8888888888", "Blacklisted User", "blacklisted@example.com");
            blacklistedUser.setConnectBal(0);
            blacklistedUser.setBlacklisted(true);
            blacklistedUser.setDeleted(false);
            blacklistedUser.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            blacklistedUser.setBlacklistedAt(new Timestamp(System.currentTimeMillis()));
            blacklistedUser.setAdmin(admin);
            blacklistedUser.setBlacklistedAt(new Timestamp(System.currentTimeMillis()));
            userRepo.save(blacklistedUser);

            // ✅ UserLogins
            userLoginRepo.save(new UserLogin("token-user-999", user));
            userLoginRepo.save(new UserLogin("token-user-888", blacklistedUser));

            // ✅ Properties
            SaleProperty sale = new SaleProperty();
            populateBaseProperty(sale, "SALE001", "Sale Property", user, admin);
            sale.setOwnershipType("Freehold");
            sale.setPriceNegotiable(true);
            sale.setUnderLoan(false);
            sale.setPrice(8500000.0);
            sale.setBathrooms(2);
            sale.setBalcony(1);
            sale.setKhataCertificate("Available");
            sale.setSaleDeed(true);
            sale.setPropertyTax(true);
            propertyRepo.save(sale);

            RentProperty rent = new RentProperty();
            populateBaseProperty(rent, "RENT001", "Rent Property", user, admin);
            rent.setRent(18000.0);
            rent.setDeposit(50000.0);
            rent.setMaintenanceCharges(1000.0);
            rent.setRentNegotiable(true);
            rent.setPreferredTenant("Working Professional");
            rent.setPetsAllowed(true);
            rent.setNonVegAllowed(false);
            propertyRepo.save(rent);

            FlatmateProperty flatmate = new FlatmateProperty();
            populateBaseProperty(flatmate, "FLAT001", "Flatmate Property", user, admin);
            flatmate.setRent(6000.0);
            flatmate.setMaintenanceCharges(500.0);
            flatmate.setDepositCharges(1000.0);
            flatmate.setTenantType("Female");
            flatmate.setAttachedBathroom(true);
            flatmate.setAttachedBalcony(true);
            flatmate.setSmokingPreference("No smoking");
            flatmate.setDrinkingPreference("Occasional");
            propertyRepo.save(flatmate);

            // ✅ ReportProperty
            ReportProperty report = new ReportProperty();
            report.setProperty(sale);
            report.setUser(user);
            report.setReportType(ReportType.BROKER);
            report.setReportTime(new Timestamp(System.currentTimeMillis()));
            reportRepo.save(report);

            // ✅ Leads
            Lead lead1 = new Lead();
            lead1.setLeadCategory(LeadCategory.PROPERTY_LISTING);
            lead1.setUser(user);
            lead1.setStatus(LeadStatus.NEW);
            lead1.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            leadRepo.save(lead1);

            Lead lead2 = new Lead();
            lead2.setLeadCategory(LeadCategory.SEARCH_SUPPORT);
            lead2.setUser(user);
            lead2.setStatus(LeadStatus.FOLLOW_UP);
            lead2.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            leadRepo.save(lead2);

            // ✅ External Payments
            Timestamp now = new Timestamp(System.currentTimeMillis());

            ExternalPayments payment1 = new ExternalPayments();
            payment1.setPaymentId("PAY001");
            payment1.setAmount(100.0);
            payment1.setStatus(ExternalPaymentStatus.IN_PROGRESS);
            payment1.setSignature("sig001");
            payment1.setRazorPaymentId("rzp_001");
            payment1.setCreatedAt(now);
            payment1.setUser(user);
            paymentRepo.save(payment1);

            ExternalPayments payment2 = new ExternalPayments();
            payment2.setPaymentId("PAY002");
            payment2.setAmount(200.0);
            payment2.setStatus(ExternalPaymentStatus.COMPLETED);
            payment2.setSignature("sig002");
            payment2.setRazorPaymentId("rzp_002");
            payment2.setCreatedAt(now);
            payment2.setCompletedAt(new Timestamp(now.getTime() + 60000));
            payment2.setUser(user);
            paymentRepo.save(payment2);

            ExternalPayments payment3 = new ExternalPayments();
            payment3.setPaymentId("PAY003");
            payment3.setAmount(300.0);
            payment3.setStatus(ExternalPaymentStatus.FAILED);
            payment3.setSignature("sig003");
            payment3.setRazorPaymentId("rzp_003");
            payment3.setCreatedAt(now);
            payment3.setUser(user);
            paymentRepo.save(payment3);

            // ✅ Connect Transactions
            ConnectTransaction ct1 = new ConnectTransaction();
            Optional<Property> optionalProperty = propertyRepo.findById(rent.getPropertyID());
            if (optionalProperty.isPresent()) {
                rent = (RentProperty) optionalProperty.get();
            }
            ct1.setTransactionId("TXN001");
            ct1.setConnectQuantity(5);
            ct1.setTransactionTime(now);
            ct1.setUser(user);
            ct1.setProperty(rent);
            ct1.setExternalPayments(payment2);
            payment2.setConnectTransaction(ct1);
            rent.setConnectTransaction(ct1);
            propertyRepo.save(rent);

            ConnectTransaction ct2 = new ConnectTransaction();
            ct2.setTransactionId("TXN002");
            ct2.setConnectQuantity(3);
            ct2.setTransactionTime(new Timestamp(now.getTime() + 60000));
            ct2.setUser(user);
            ct2.setExternalPayments(payment1);
            payment1.setConnectTransaction(ct2);
            connectRepo.save(ct2);

            ConnectTransaction ct3 = new ConnectTransaction();
            ct3.setTransactionId("TXN003");
            ct3.setConnectQuantity(10);
            ct3.setTransactionTime(new Timestamp(now.getTime() + 120000));
            ct3.setUser(user);
            connectRepo.save(ct3);

            // Save payments after transactions to retain linkage
            paymentRepo.saveAll(List.of(payment1, payment2, payment3));

            PropertyAction propertyAction1 = new PropertyAction();
            propertyAction1.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            propertyAction1.setProperty(sale);
            propertyAction1.setUser(user);
            propertyAction1.setUserActionType(UserActionType.SHORTLIST);
            propertyActionRepo.save(propertyAction1);

            PropertyAction propertyAction2 = new PropertyAction();
            propertyAction2.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            propertyAction2.setProperty(rent);
            propertyAction2.setUser(user);
            propertyAction2.setUserActionType(UserActionType.VIEW);
            propertyActionRepo.save(propertyAction2);

            PropertyAction propertyAction3 = new PropertyAction();
            propertyAction3.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            propertyAction3.setProperty(flatmate);
            propertyAction3.setUser(user);
            propertyAction3.setUserActionType(UserActionType.CONTACT);
            propertyActionRepo.save(propertyAction3);

            System.out.println("✅ All test data inserted successfully.");
        };
    }

    private void populateBaseProperty(Property property, String id, String title, User user, Admin admin) {
        property.setPropertyID(id);
        property.setTitle(title);
        property.setCity("Bangalore");
        property.setLocationOrSocietyName("Test Layout");
        property.setBuiltUpArea(1100.0);
        property.setBhkType("2 BHK");
        property.setFloor(2);
        property.setTotalFloors(5);
        property.setFloorType("Vitrified Tiles");
        property.setDescription("Auto-generated for testing.");
        property.setLatitude(12.9716);
        property.setLongitude(77.5946);
        property.setFurnishing("Furnished");
        property.setPropertyAge("0-1 year");
        property.setWaterSupply("Borewell");
        property.setPowerBackup("Partial");
        property.setParking(true);
        property.setAvailableFrom(new Timestamp(System.currentTimeMillis()));
        property.setPropertyState(PropertyState.ACTIVE);
        property.setImages(List.of("image1.jpg", "image2.jpg"));
        property.setAmenities(List.of("Lift", "Power Backup"));
        property.setPreferredTenants(List.of("Family", "Bachelors"));
        property.setOwner(user);
    }
}
