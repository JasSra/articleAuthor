/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DebtNotificationSuggestionRequest = {
    debtStage: string;
    debtAmount?: number | null;
    daysOverdue?: number | null;
    communicationHistory?: string | null;
    customerProfile?: string | null;
    organizationPreferences?: string | null;
    targetAudience?: string | null;
    communicationChannel?: string | null;
};
