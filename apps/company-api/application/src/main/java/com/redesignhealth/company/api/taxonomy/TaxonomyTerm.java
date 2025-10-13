package com.redesignhealth.company.api.taxonomy;

import com.redesignhealth.company.api.entity.ref.TaxonomyRef;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TaxonomyTerm {

  /** The lowest TaxonomyTerm#level */
  public static final int LEAF_NODE_LEVEL = 3;

  /** An ID for a Taxonomy Term. Used when referenced in a database table. */
  private TaxonomyRef value;

  /** User-friendly name */
  private String displayName;

  /** A TaxonomyTerm is a part of a hierarchy of TaxonomyTerms */
  private TaxonomyTerm parent;

  /**
   * Taxonomy terms are referenced by their level I, II, III, ... The lower the level the more
   * general the taxonomy. The higher the level the more specific the taxonomy.
   */
  private int level;

  public static TaxonomyTerm of(
      TaxonomyRef value, String displayName, TaxonomyTerm parent, int level) {
    return new TaxonomyTerm(value, displayName, parent, level);
  }

  /**
   * @return a list of ancestor TaxonomyTerms up to the root (includes self)
   */
  public List<TaxonomyTerm> getHierarchy() {
    Deque<TaxonomyTerm> terms = new ArrayDeque<>();
    var currTerm = this;
    do {
      terms.push(currTerm);
      currTerm = currTerm.parent;
    } while (currTerm != null);
    return new ArrayList<>(terms);
  }
}
