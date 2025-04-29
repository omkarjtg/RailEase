package com.railease.booking.entity;

import lombok.Getter;

@Getter
public enum SeatTier {
    TIER1_AC(1.5),
    TIER2_SLEEPER(1.2),
    TIER3_GENERAL(0.8);

    private final double priceMultiplier;

    SeatTier(double priceMultiplier) {
        this.priceMultiplier = priceMultiplier;
    }

}