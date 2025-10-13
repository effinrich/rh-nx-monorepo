package com.redesignhealth.company.api.scaffolding;

import com.redesignhealth.company.api.entity.request.RoleAuthority;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import org.springframework.security.test.context.support.WithSecurityContext;

/**
 * Helper for attaching authenticated Redesign Health users to Spring Security tests. Similar to
 * {@link org.springframework.security.test.context.support.WithMockUser} but more details.
 *
 * @see WithRedesignUserSecurityContextFactory
 */
@Retention(RetentionPolicy.RUNTIME)
@WithSecurityContext(factory = WithRedesignUserSecurityContextFactory.class)
public @interface WithRedesignUser {
  String email() default "";

  RoleAuthority role() default RoleAuthority.ROLE_OP_CO_CONTRACTOR;

  String picture() default "";

  String[] memberOf() default {};
}
