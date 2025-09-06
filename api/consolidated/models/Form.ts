/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FormSection } from './FormSection';

export type Form = {
    id?: string | null;
    definitionId?: string | null;
    ownerId?: string | null;
    attributes?: Record<string, any> | null;
    isDeleted?: boolean;
    createdAt?: number | null;
    updatedAt?: number | null;
    version?: number;
    tags?: Array<string> | null;
    embedding?: Array<number> | null;
    status?: string | null;
    relatedEntities?: Record<string, Array<string>> | null;
    state?: Record<string, string> | null;
    slug?: string | null;
    formColor?: string | null;
    footnote?: string | null;
    poweredBy?: string | null;
    privacyPolicyLink?: string | null;
    termsOfServiceLink?: string | null;
    disclaimer?: string | null;
    companyLogoIcon?: string | null;
    contactEmail?: string | null;
    isCaptchaEnabled?: boolean | null;
    eventsToRaiseOnSubmit?: Array<string> | null;
    queuesToSubmit?: Array<string> | null;
    title?: string | null;
    submitButtonLabel?: string | null;
    postSubmissionText?: string | null;
    postSubmissionImage?: string | null;
    postSubmissionIcon?: string | null;
    description?: string | null;
    formImageUrl?: string | null;
    enableClear?: boolean;
    enableAutosave?: boolean;
    sections?: Array<FormSection> | null;
    layout?: string | null;
    formImagePosition?: string | null;
    formEntries?: Array<string> | null;
};

