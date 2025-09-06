/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type OtpResponse = {
    sessionId?: string | null;
    success?: boolean;
    message?: string | null;
    expiresInSeconds?: number | null;
    attemptsRemaining?: number | null;
    cooldownSeconds?: number | null;
    metadata?: Record<string, any> | null;
    attestation?: string | null;
};

