/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanOperationResult } from '../models/BooleanOperationResult';
import type { IdpConfigurationListOperationResult } from '../models/IdpConfigurationListOperationResult';
import type { IdpConfigurationOperationResult } from '../models/IdpConfigurationOperationResult';
import type { RegisterIdpRequest } from '../models/RegisterIdpRequest';
import type { ValidateIdpRequest } from '../models/ValidateIdpRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class IdentityProviderService {

    /**
     * @param requestBody 
     * @returns IdpConfigurationOperationResult OK
     * @throws ApiError
     */
    public static postApiIdentityValidate(
requestBody?: ValidateIdpRequest,
): CancelablePromise<IdpConfigurationOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/identity/validate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id 
     * @returns IdpConfigurationOperationResult OK
     * @throws ApiError
     */
    public static postApiIdentityValidate1(
id: string,
): CancelablePromise<IdpConfigurationOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/identity/validate/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns IdpConfigurationOperationResult OK
     * @throws ApiError
     */
    public static postApiIdentityRegister(
requestBody?: RegisterIdpRequest,
): CancelablePromise<IdpConfigurationOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/identity/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id 
     * @returns IdpConfigurationOperationResult OK
     * @throws ApiError
     */
    public static postApiIdentityDefault(
id: string,
): CancelablePromise<IdpConfigurationOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/identity/default/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns IdpConfigurationOperationResult OK
     * @throws ApiError
     */
    public static getApiIdentityDefault(): CancelablePromise<IdpConfigurationOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/identity/default',
            errors: {
                400: `Bad Request`,
            },
        });
    }

    /**
     * @returns IdpConfigurationListOperationResult OK
     * @throws ApiError
     */
    public static getApiIdentityAll(): CancelablePromise<IdpConfigurationListOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/identity/all',
        });
    }

    /**
     * @param id 
     * @returns IdpConfigurationOperationResult OK
     * @throws ApiError
     */
    public static getApiIdentity(
id: string,
): CancelablePromise<IdpConfigurationOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/identity/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id 
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static deleteApiIdentity(
id: string,
): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/identity/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id 
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static postApiIdentityEnable(
id: string,
): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/identity/enable/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id 
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static postApiIdentityDisable(
id: string,
): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/identity/disable/{id}',
            path: {
                'id': id,
            },
        });
    }

}
