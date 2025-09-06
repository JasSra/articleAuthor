/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type MfaStatusResponse = {
    userId?: string | null;
    totpEnabled?: boolean;
    passkeyEnabled?: boolean;
    hasRecoveryCodes?: boolean;
    mfaMethods?: Array<string> | null;
    recoveryCodesRemaining?: number;
};

