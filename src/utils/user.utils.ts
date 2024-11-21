import { Roles } from '@prisma/client';

export function transformRoleToEnumRole(payload: any): Roles {
    if (!payload || typeof payload.role !== 'string') {
        return Roles.USER; // Default fallback
    }

    switch (payload.role) {
        case "ADMIN":
            return Roles.ADMIN;
        case "PETUGAS_SUPER":
            return Roles.PETUGAS_SUPER;
        case "PETUGAS":
            return Roles.PETUGAS;
        case "USER":
            return Roles.USER;
        default:
            return Roles.USER;
    }
}