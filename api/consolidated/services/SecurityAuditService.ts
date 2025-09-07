/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EndpointAuditEntry } from '../models/EndpointAuditEntry';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SecurityAuditService {

    /**
     * @param ignore 
     * @param methods 
     * @returns EndpointAuditEntry OK
     * @throws ApiError
     */
    public static getApiSecurityAuditUnsecured(
ignore?: string,
methods?: string,
): CancelablePromise<Array<EndpointAuditEntry>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/security/audit/unsecured',
            query: {
                'ignore': ignore,
                'methods': methods,
            },
        });
    }

    /**
     * @param ignore 
     * @returns EndpointAuditEntry OK
     * @throws ApiError
     */
    public static getApiSecurityAuditAll(
ignore?: string,
): CancelablePromise<Array<EndpointAuditEntry>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/security/audit/all',
            query: {
                'ignore': ignore,
            },
        });
    }

}
