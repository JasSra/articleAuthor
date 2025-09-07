/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SuggestedFormConfiguration } from './SuggestedFormConfiguration';
import type { SuggestedFormSection } from './SuggestedFormSection';

export type FormFieldSuggestionResponse = {
    sections?: Array<SuggestedFormSection> | null;
    formConfiguration?: SuggestedFormConfiguration;
    confidenceScore?: number;
    reasoning?: string | null;
    usabilityRecommendations?: Array<string> | null;
};
