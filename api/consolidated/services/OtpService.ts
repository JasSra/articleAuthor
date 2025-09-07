/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanOperationResult } from '../models/BooleanOperationResult';
import type { OtpConfigurationOperationResult } from '../models/OtpConfigurationOperationResult';
import type { OtpResponseOperationResult } from '../models/OtpResponseOperationResult';
import type { SendOtpRequest } from '../models/SendOtpRequest';
import type { ValidateOtpRequest } from '../models/ValidateOtpRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OtpService {

    /**
     * @param requestBody 
     * @returns OtpResponseOperationResult OK
     * @throws ApiError
     */
    public static postApiOtpSend(
requestBody?: SendOtpRequest,
): CancelablePromise<OtpResponseOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Otp/send',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                429: `Too Many Requests`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns OtpResponseOperationResult OK
     * @throws ApiError
     */
    public static postApiOtpValidate(
requestBody?: ValidateOtpRequest,
): CancelablePromise<OtpResponseOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Otp/validate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param sessionId 
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static deleteApiOtpRevoke(
sessionId: string,
): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/Otp/revoke/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @returns OtpConfigurationOperationResult OK
     * @throws ApiError
     */
    public static getApiOtpConfig(): CancelablePromise<OtpConfigurationOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Otp/config',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }

}
