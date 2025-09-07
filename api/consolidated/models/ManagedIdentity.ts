/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EnterpriseIdentity } from './EnterpriseIdentity';
import type { MFAMethod } from './MFAMethod';
import type { TotpDto } from './TotpDto';

export type ManagedIdentity = {
    id?: string | null;
    definitionId?: string | null;
    ownerId?: string | null;
    attributes?: Record<string, any> | null;
    isDeleted?: boolean;
    createdAt?: number | null;
    updatedAt?: number | null;
    version?: number;
    tags?: Array<string> | null;
    embedding?: Array<number> | null;
    status?: string | null;
    relatedEntities?: Record<string, Array<string>> | null;
    state?: Record<string, string> | null;
    type?: ManagedIdentity.type;
    identities?: Record<string, EnterpriseIdentity> | null;
    contactId?: string | null;
    externalSubjectId?: string | null;
    meta: Record<string, string> | null;
    mfaMethods?: Array<MFAMethod> | null;
    lastLoginAt?: string | null;
    loginAttempts?: number;
    isLocked?: boolean;
    hashedPassword: string | null;
    hash: string | null;
    apiKeyIds?: Array<string> | null;
    groupIds?: Array<string> | null;
    messages?: Array<string> | null;
    totpDto?: TotpDto;
    debtorIds?: Array<string> | null;
    organizationIds?: Array<string> | null;
    documentIds?: Array<string> | null;
    authenticationType?: string | null;
    isAuthenticated?: boolean;
    name?: string | null;
};

export namespace ManagedIdentity {

    export enum type {
        USER = 'User',
        SERVICE_ACCOUNT = 'ServiceAccount',
        SYSTEM_ACCOUNT = 'SystemAccount',
        GROUP = 'Group',
        DEVICE = 'Device',
        BOT = 'Bot',
        EXTERNAL_USER = 'ExternalUser',
        ANONYMOUS = 'Anonymous',
        APICLIENT = 'APIClient',
        DELEGATED_USER = 'DelegatedUser',
        IDENTITY_PROVIDER = 'IdentityProvider',
    }


}
