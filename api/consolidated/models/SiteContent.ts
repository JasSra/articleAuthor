/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SiteContent = {
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
    type?: string | null;
    title?: string | null;
    description?: string | null;
    value?: any;
    properties?: Record<string, any> | null;
    classes?: string | null;
    children?: Array<string> | null;
    nested?: Array<SiteContent> | null;
    icon?: string | null;
    placeholder?: string | null;
};

