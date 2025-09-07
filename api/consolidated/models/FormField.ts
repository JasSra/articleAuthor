/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FieldOption } from './FieldOption';

export type FormField = {
    tooltip?: string | null;
    id?: string | null;
    name?: string | null;
    description?: string | null;
    label?: string | null;
    fieldType?: string | null;
    isRequired?: boolean;
    placeholder?: string | null;
    icon?: string | null;
    options?: Array<FieldOption> | null;
    optionsType?: string | null;
    validationMessage?: string | null;
    isVisible?: boolean;
    pattern?: string | null;
    metadata?: Record<string, any> | null;
    row?: number;
    column?: number;
    uniqueKey?: string | null;
};
