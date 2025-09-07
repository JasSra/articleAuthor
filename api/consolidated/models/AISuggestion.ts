/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AISuggestionAction } from './AISuggestionAction';

export type AISuggestion = {
    id: string;
    type: string;
    target?: string | null;
    message: string;
    action?: AISuggestionAction;
    priority?: string | null;
    duration?: number;
    confidence?: number;
    conditions?: Record<string, any> | null;
    createdAt?: string;
};
