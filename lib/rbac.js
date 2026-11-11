// permissions of each role — change permissions for the whole system in this one file
export const PERMISSIONS = {
  student: ["news:read"],
  staff: ["news:read", "news:create", "news:update"],
  admin: ["news:read", "news:create", "news:update", "news:delete", "user:manage"],
};

// check whether this role has the given permission
export function can(role, permission) {
  return PERMISSIONS[role]?.includes(permission) ?? false;
}