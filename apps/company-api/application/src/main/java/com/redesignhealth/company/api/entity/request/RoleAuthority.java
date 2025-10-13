package com.redesignhealth.company.api.entity.request;

public enum RoleAuthority {
  ROLE_SUPER_ADMIN(5, "Super Admin"),
  ROLE_RH_ADMIN(4, "Admin"),
  ROLE_RH_USER(3, "RH User"),
  ROLE_OP_CO_USER(2, "Company User"),
  ROLE_OP_CO_CONTRACTOR(1, "Company Contractor");

  private int inheritanceOrder;
  private final String displayName;

  RoleAuthority(int inheritanceOrder, String displayName) {
    this.inheritanceOrder = inheritanceOrder;
    this.displayName = displayName;
  }

  public boolean hasPermissionsOf(RoleAuthority roleAuthority) {
    return this.inheritanceOrder >= roleAuthority.inheritanceOrder;
  }

  public String getDisplayName() {
    return this.displayName;
  }

  public int getInheritanceOrder() {
    return inheritanceOrder;
  }
}
