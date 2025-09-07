/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FieldChoice } from './FieldChoice';

export type SuggestedFormField = {
    name?: string | null;
    label?: string | null;
    fieldType?: string | null;
    placeholder?: string | null;
    icon?: string | null;
    isRequired?: boolean;
    isVisible?: boolean;
    tooltip?: string | null;
    validationMessage?: string | null;
    metadata?: Record<string, any> | null;
    options?: Array<FieldChoice> | null;
    confidenceScore?: number;
    reasoning?: string | null;
};
