/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ManagedGroup = {
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
    name?: string | null;
    description?: string | null;
    userIds?: Array<string> | null;
    permissions?: Record<string, 'None' | 'Read' | 'Query' | 'Create' | 'Write' | 'Delete' | 'Execute' | 'Share' | 'Manage' | 'Admin'> | null;
};
