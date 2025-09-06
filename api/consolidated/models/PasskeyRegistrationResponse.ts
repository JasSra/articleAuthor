/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AuthenticatorSelectionCriteria } from './AuthenticatorSelectionCriteria';
import type { PublicKeyCredentialParameter } from './PublicKeyCredentialParameter';

export type PasskeyRegistrationResponse = {
    challenge?: string | null;
    userId?: string | null;
    userDisplayName?: string | null;
    rpId?: string | null;
    rpName?: string | null;
    instructions?: string | null;
    timeoutMs?: number;
    pubKeyCredParams?: Array<PublicKeyCredentialParameter> | null;
    authenticatorSelection?: AuthenticatorSelectionCriteria;
};

