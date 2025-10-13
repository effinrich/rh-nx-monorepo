package com.redesignhealth.company.api.task;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.redesignhealth.company.api.entity.vendor.Vendor;
import com.redesignhealth.company.api.repository.TaskRepository;
import com.redesignhealth.company.api.repository.VendorRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class UpdateApiIdInVendorTaskTests {
  @Mock VendorRepository vendorRepository;
  @Mock TaskRepository taskRepository;
  UpdateApiIdInVendorTask task;

  @Test
  public void testRun_There_Are_ApiId_Nulls() {
    var vendor = Vendor.of(null);
    when(vendorRepository.findByApiIdIsNull()).thenReturn(List.of(vendor));
    task = new UpdateApiIdInVendorTask(taskRepository, vendorRepository);
    task.run();
    assertNotNull(vendor.getApiId());
    verify(vendorRepository, times(1)).save(eq(vendor));
  }

  @Test
  public void testRun_There_Are_Not_ApiId_Nulls() {
    when(vendorRepository.findByApiIdIsNull()).thenReturn(List.of());
    task = new UpdateApiIdInVendorTask(taskRepository, vendorRepository);
    task.run();
    verify(vendorRepository, never()).save(any());
  }
}
