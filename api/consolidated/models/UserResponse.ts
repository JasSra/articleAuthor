/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserRoleResponse } from './UserRoleResponse';

export type UserResponse = {
    profileId?: string | null;
    id?: string | null;
    name?: string | null;
    roles?: Array<UserRoleResponse> | null;
    email?: string | null;
    displayName?: string | null;
    givenName?: string | null;
    lastName?: string | null;
    meta?: Record<string, string> | null;
};
