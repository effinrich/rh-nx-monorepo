package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.dto.BuyerAndSellerChattingDto;
import com.redesignhealth.company.api.entity.CompanyIpMarketplace;
import com.redesignhealth.company.api.entity.IpMarketplaceTrack;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceTrackRef;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface IpMarketplaceTrackRepository
    extends JpaRepository<IpMarketplaceTrack, Long>, RefRepository {
  Optional<IpMarketplaceTrack> findByApiId(IpMarketplaceTrackRef apiId);

  List<IpMarketplaceTrack> findByApiIdIsNull();

  @Query(
      "SELECT new com.redesignhealth.company.api.dto.BuyerAndSellerChattingDto(ipmt.buyer, ipms.seller, ipmt.roomId, "
          + "ipmt.ipMarketplace.name) "
          + "from IpMarketplaceTrack ipmt inner join IpMarketplaceSeller ipms  on ipmt.ipMarketplace = ipms.ipMarketplace "
          + "where ipmt.roomId IS NOT NULL")
  List<BuyerAndSellerChattingDto> getBuyerAndSellerChatting();

  List<IpMarketplaceTrack> findByBuyerCompanyIpMarketplaceAndBuyer(
      CompanyIpMarketplace companyIpMarketplace, Person buyer);
}
