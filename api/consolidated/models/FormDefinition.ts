/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FormSectionDefinition } from './FormSectionDefinition';

export type FormDefinition = {
    id?: string | null;
    formColor?: string | null;
    footnote?: string | null;
    poweredBy?: string | null;
    privacyPolicyLink?: string | null;
    termsOfServiceLink?: string | null;
    disclaimer?: string | null;
    companyLogoIcon?: string | null;
    contactEmail?: string | null;
    isCaptchaEnabled?: boolean;
    eventsToRaiseOnSubmit?: Array<string> | null;
    title?: string | null;
    submitButtonLabel?: string | null;
    postSubmissionText?: string | null;
    postSubmissionImage?: string | null;
    postSubmissionIcon?: string | null;
    description?: string | null;
    version?: number;
    sections?: Array<FormSectionDefinition> | null;
    layout?: string | null;
};
