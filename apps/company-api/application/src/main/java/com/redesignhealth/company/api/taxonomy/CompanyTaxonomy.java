package com.redesignhealth.company.api.taxonomy;

import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.ref.TaxonomyRef;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Represents the taxonomy here:
 * https://docs.google.com/spreadsheets/d/1Oh8KYjXldPYpVyuib2AkyGWUk2RpzO9-pdjYGC96PLQ/edit#gid=544382891
 */
@ConfigurationProperties("company-taxonomy")
@Getter
public class CompanyTaxonomy {

  /** Flat representation of each term */
  Map<TaxonomyRef, TaxonomyTerm> terms;

  /**
   * Taxonomy terms are referenced as 1, 2, 3. We'll use the same system in our code to avoid
   * confusion.
   */
  private static final int INITIAL_TAXONOMY_LEVEL = 1;

  public CompanyTaxonomy(List<YamlTaxonomy> taxonomy) {
    terms =
        flattenYamlHierarchy(taxonomy, null).stream()
            .collect(Collectors.toMap(TaxonomyTerm::getValue, Function.identity()));
  }

  /** Recursively flatten tree into a list of terms with references to their parents */
  private List<TaxonomyTerm> flattenYamlHierarchy(
      List<YamlTaxonomy> children, TaxonomyTerm grandparent) {
    if (children == null) {
      return List.of();
    }

    var level = grandparent == null ? INITIAL_TAXONOMY_LEVEL : grandparent.getLevel() + 1;

    List<TaxonomyTerm> terms = new ArrayList<>();
    for (var entry : children) {
      var parent = TaxonomyTerm.of(TaxonomyRef.of(entry.id), entry.name, grandparent, level);
      terms.add(parent);
      terms.addAll(flattenYamlHierarchy(entry.children, parent));
    }
    return terms;
  }

  public void setTaxonomyTerms(Company company) {
    if (this.getTerms().containsKey(company.getTaxonomyId())) {
      company.setTaxonomyTerms(this.getTerms().get(company.getTaxonomyId()).getHierarchy());
    }
  }

  @AllArgsConstructor
  public static class YamlTaxonomy {
    private String id;
    private String name;
    private List<YamlTaxonomy> children;
  }
}
