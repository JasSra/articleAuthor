/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ComprehensiveContentRequest = {
    purpose: string;
    audience?: string | null;
    businessContext?: string | null;
    tone?: string | null;
    includeTemplates?: boolean;
    templateType?: string | null;
    availableVariables?: Array<string> | null;
    includeNotifications?: boolean;
    baseNotificationTemplate?: string | null;
    notificationVariationCount?: number | null;
};
