/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type MFAMethod = {
    type?: MFAMethod.type;
    identifier?: string | null;
    isVerified?: boolean;
    verifiedAt?: string | null;
    lastUsedAt?: string | null;
    metadata?: Record<string, any> | null;
};

export namespace MFAMethod {

    export enum type {
        NONE = 'None',
        SMS = 'SMS',
        EMAIL = 'Email',
        AUTHENTICATOR_APP = 'AuthenticatorApp',
        FIDO2 = 'FIDO2',
        HARDWARE_KEY = 'HardwareKey',
        PASSKEY = 'Passkey',
    }


}
