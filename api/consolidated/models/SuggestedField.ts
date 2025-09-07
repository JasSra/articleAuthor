/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FieldChoice } from './FieldChoice';

export type SuggestedField = {
    name?: string | null;
    type?: string | null;
    description?: string | null;
    defaultValue?: any;
    isRequired?: boolean;
    isSearchable?: boolean;
    isFilterable?: boolean;
    isSortable?: boolean;
    isUnique?: boolean;
    icon?: string | null;
    tooltip?: string | null;
    placeholder?: string | null;
    pattern?: string | null;
    metadata?: Record<string, any> | null;
    choices?: Array<FieldChoice> | null;
    confidenceScore?: number;
    reasoning?: string | null;
};
