/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanOperationResult } from '../models/BooleanOperationResult';
import type { ExternalRegistrationRequest } from '../models/ExternalRegistrationRequest';
import type { MfaStatusResponseOperationResult } from '../models/MfaStatusResponseOperationResult';
import type { PasskeyRegistrationResponseOperationResult } from '../models/PasskeyRegistrationResponseOperationResult';
import type { PasskeyVerificationRequest } from '../models/PasskeyVerificationRequest';
import type { PasskeyVerificationResponseOperationResult } from '../models/PasskeyVerificationResponseOperationResult';
import type { TotpDisableRequest } from '../models/TotpDisableRequest';
import type { TotpRegistrationResponseOperationResult } from '../models/TotpRegistrationResponseOperationResult';
import type { TotpVerificationRequest } from '../models/TotpVerificationRequest';
import type { TotpVerificationResponseOperationResult } from '../models/TotpVerificationResponseOperationResult';
import type { UpdatePasswordRequest } from '../models/UpdatePasswordRequest';
import type { UserResponseOperationResult } from '../models/UserResponseOperationResult';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * @param requestBody 
     * @returns UserResponseOperationResult OK
     * @throws ApiError
     */
    public static signUp(
requestBody?: ExternalRegistrationRequest,
): CancelablePromise<UserResponseOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/register/external',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiUserProfile(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/profile',
        });
    }

    /**
     * @returns UserResponseOperationResult OK
     * @throws ApiError
     */
    public static getMyDetails(): CancelablePromise<UserResponseOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/myself',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static updateUserPassword(
requestBody?: UpdatePasswordRequest,
): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/password/update',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns TotpRegistrationResponseOperationResult OK
     * @throws ApiError
     */
    public static registerTotp(): CancelablePromise<TotpRegistrationResponseOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/totp/register',
        });
    }

    /**
     * @param requestBody 
     * @returns TotpVerificationResponseOperationResult OK
     * @throws ApiError
     */
    public static verifyTotp(
requestBody?: TotpVerificationRequest,
): CancelablePromise<TotpVerificationResponseOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/totp/verify',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static disableTotp(
requestBody?: TotpDisableRequest,
): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/totp/disable',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns PasskeyRegistrationResponseOperationResult OK
     * @throws ApiError
     */
    public static registerPasskey(): CancelablePromise<PasskeyRegistrationResponseOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/passkey/register',
        });
    }

    /**
     * @param requestBody 
     * @returns PasskeyVerificationResponseOperationResult OK
     * @throws ApiError
     */
    public static verifyPasskey(
requestBody?: PasskeyVerificationRequest,
): CancelablePromise<PasskeyVerificationResponseOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/passkey/verify',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns MfaStatusResponseOperationResult OK
     * @throws ApiError
     */
    public static getMfaStatus(): CancelablePromise<MfaStatusResponseOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/mfa/status',
        });
    }

}
