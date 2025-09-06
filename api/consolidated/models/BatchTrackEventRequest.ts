/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AIEventRequest } from './AIEventRequest';

export type BatchTrackEventRequest = {
    batchId?: string | null;
    events: Array<AIEventRequest>;
    metadata?: Record<string, any> | null;
};

