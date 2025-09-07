/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ConstraintComponent } from './ConstraintComponent';

export type FieldDefinition = {
    display?: string | null;
    name?: string | null;
    type?: string | null;
    editor?: string | null;
    id?: string | null;
    isCompound?: boolean;
    isRequired?: boolean;
    defaultValue?: string | null;
    description?: string | null;
    tooltip?: string | null;
    placeholder?: string | null;
    pattern?: string | null;
    isReadOnly?: boolean;
    isUnique?: boolean;
    isSearchable?: boolean;
    isSortable?: boolean;
    isFilterable?: boolean;
    isKey?: boolean;
    isEncrypted?: boolean;
    isNoStem?: boolean;
    isCaseSensitive?: boolean;
    color?: string | null;
    icon?: string | null;
    category?: string | null;
    weightage?: number | null;
    supportsSuggestion?: boolean;
    constraints?: Array<ConstraintComponent> | null;
    components?: Array<ConstraintComponent> | null;
    isPhonetic?: boolean;
};
