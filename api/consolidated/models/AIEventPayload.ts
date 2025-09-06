/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AIEventPayload = {
    timestamp?: number | null;
    eventType?: string | null;
    pageName?: string | null;
    userRole?: string | null;
    sessionId?: string | null;
    deviceType?: string | null;
    userAgent?: string | null;
    screenResolution?: string | null;
    referrer?: string | null;
    formType?: string | null;
    buttonType?: string | null;
    buttonId?: string | null;
    section?: string | null;
    amount?: number | null;
    duration?: number | null;
    clickCount?: number | null;
    scrollDepth?: number | null;
    errorMessage?: string | null;
    errorCode?: string | null;
    metadata?: Record<string, any> | null;
    recentActions?: Array<string> | null;
    serverProcessedAt?: number | null;
};

