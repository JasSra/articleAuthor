/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AISuggestion } from './AISuggestion';

export type TrackEventResponse = {
    success?: boolean;
    suggestions?: Array<AISuggestion> | null;
    correlationId?: string | null;
    message?: string | null;
    metadata?: Record<string, any> | null;
};
