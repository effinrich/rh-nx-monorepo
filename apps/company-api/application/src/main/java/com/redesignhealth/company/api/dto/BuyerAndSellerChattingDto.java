package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.entity.Person;

public record BuyerAndSellerChattingDto(
    Person buyer, Person seller, String roomId, String ipMarketplaceName) {}
