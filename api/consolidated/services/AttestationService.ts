/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanOperationResult } from '../models/BooleanOperationResult';
import type { SignWithPayloadRequest } from '../models/SignWithPayloadRequest';
import type { StringOperationResult } from '../models/StringOperationResult';
import type { VerifyRequest } from '../models/VerifyRequest';
import type { VerifyWithPayloadRequest } from '../models/VerifyWithPayloadRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AttestationService {

    /**
     * @param requestBody
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static postApiAttestationVerify(
        requestBody?: VerifyRequest,
    ): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Attestation/verify',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static postApiAttestationVerifyWithPayload(
        requestBody?: VerifyWithPayloadRequest,
    ): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Attestation/verify-with-payload',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns StringOperationResult OK
     * @throws ApiError
     */
    public static postApiAttestationSignWithPayload(
        requestBody?: SignWithPayloadRequest,
    ): CancelablePromise<StringOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Attestation/sign-with-payload',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
