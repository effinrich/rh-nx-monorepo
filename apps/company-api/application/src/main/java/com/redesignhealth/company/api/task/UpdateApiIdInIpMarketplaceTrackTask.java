package com.redesignhealth.company.api.task;

import com.redesignhealth.company.api.entity.IpMarketplaceTrack;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceTrackRef;
import com.redesignhealth.company.api.repository.IpMarketplaceTrackRepository;
import com.redesignhealth.company.api.repository.TaskRepository;
import com.redesignhealth.company.api.service.helper.RefGenerator;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class UpdateApiIdInIpMarketplaceTrackTask extends TaskDefinition
    implements CommandLineRunner {
  private final IpMarketplaceTrackRepository ipMarketplaceTrackRepository;

  public UpdateApiIdInIpMarketplaceTrackTask(
      TaskRepository taskRepository, IpMarketplaceTrackRepository ipMarketplaceTrackRepository) {
    super(taskRepository);
    this.ipMarketplaceTrackRepository = ipMarketplaceTrackRepository;
  }

  @Override
  public void run(String... args) {
    runTask(shouldRunTask());
  }

  @Override
  public void runTaskInternal() {
    var ipMarketplaceTracks = ipMarketplaceTrackRepository.findByApiIdIsNull();
    for (IpMarketplaceTrack ipMarketplaceTrack : ipMarketplaceTracks) {
      ipMarketplaceTrack.setApiId(
          RefGenerator.of(ipMarketplaceTrackRepository, IpMarketplaceTrackRef.class));
      ipMarketplaceTrackRepository.save(ipMarketplaceTrack);
    }
  }
}
