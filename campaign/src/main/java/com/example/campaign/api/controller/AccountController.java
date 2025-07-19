package com.example.campaign.api.controller;

import com.example.campaign.service.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final AccountService svc;

    public AccountController(AccountService svc) {
        this.svc = svc;
    }

    @GetMapping("/balance")
    public Map<String, BigDecimal> balance() {
        return Map.of("balance", svc.getBalance());
    }

    @PostMapping("/deduct")
    public Map<String, BigDecimal> deduct(@RequestParam BigDecimal amount) {
        BigDecimal newBal = svc.deduct(amount);
        return Map.of("balance", newBal);
    }

    @PostMapping("/deposit")
    public Map<String, BigDecimal> deposit(@RequestParam BigDecimal amount) {
        BigDecimal newBal = svc.deposit(amount);
        return Map.of("balance", newBal);
    }
}