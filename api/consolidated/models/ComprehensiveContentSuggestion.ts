/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContentSuggestionGroup } from './ContentSuggestionGroup';

export type ComprehensiveContentSuggestion = {
    success?: boolean;
    contentSuggestions?: Array<ContentSuggestionGroup> | null;
    totalSuggestions?: number;
    overallConfidence?: number;
    errorMessage?: string | null;
};
