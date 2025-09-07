/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NotificationTemplate } from './NotificationTemplate';

export type DebtNotificationSuggestionResponse = {
    primaryTemplate?: NotificationTemplate;
    alternativeTemplates?: Array<NotificationTemplate> | null;
    suggestedSubjects?: Array<string> | null;
    confidenceScore?: number;
    reasoning?: string | null;
    recommendedTiming?: string | null;
    followUpSuggestions?: Array<string> | null;
};
