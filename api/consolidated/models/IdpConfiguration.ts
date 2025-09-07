/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IdpConfiguration = {
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
    isAzureAdB2C?: boolean;
    isEnabled?: boolean;
    name?: string | null;
    issuer?: string | null;
    audience?: string | null;
    metaDataEndpoint?: string | null;
    signingKey?: string | null;
    tokenExpiryMinutes?: number;
    scopes?: Array<string> | null;
    supportsExternalLogout?: boolean;
    idTokenInLogout?: boolean;
    roleMappings?: Record<string, string> | null;
    accessibleAreas?: Record<string, Array<string>> | null;
};
