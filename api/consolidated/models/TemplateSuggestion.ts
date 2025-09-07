/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TemplateContent } from './TemplateContent';

export type TemplateSuggestion = {
    success?: boolean;
    confidence?: number;
    suggestedTemplates?: Array<TemplateContent> | null;
    errorMessage?: string | null;
};
