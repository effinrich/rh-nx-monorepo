package com.redesignhealth.company.api.entity.library;

import com.redesignhealth.company.api.entity.converter.LibraryRefConverter;
import com.redesignhealth.company.api.entity.ref.LibraryRef;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

/** Container/Namespace for {@link LibraryContent} */
@Entity
public class Library {

  @Id @GeneratedValue private Long id;

  @Column(unique = true)
  @Convert(converter = LibraryRefConverter.class)
  @Getter
  private LibraryRef apiId;

  @Getter @Setter private String displayName;

  public static Library from(LibraryRef apiId) {
    var library = new Library();
    library.apiId = apiId;
    return library;
  }
}
