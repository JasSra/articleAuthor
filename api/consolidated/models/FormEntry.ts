/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EpochTime } from './EpochTime';
import type { FormFileEntry } from './FormFileEntry';

export type FormEntry = {
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
    formId?: string | null;
    captchaToken?: string | null;
    formVersion?: number;
    traceId?: string | null;
    submittedAt?: EpochTime;
    data?: Record<string, any> | null;
    metaData?: Record<string, any> | null;
    files?: Array<FormFileEntry> | null;
};

