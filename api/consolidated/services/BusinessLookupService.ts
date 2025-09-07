/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BusinessLookupResult } from '../models/BusinessLookupResult';
import type { NameSearchRequest } from '../models/NameSearchRequest';
import type { NameSimpleProtocolRequest } from '../models/NameSimpleProtocolRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BusinessLookupService {

    /**
     * @param abn 
     * @returns BusinessLookupResult OK
     * @throws ApiError
     */
    public static getApiBusinessLookupSearchAbn(
abn: string,
): CancelablePromise<BusinessLookupResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/BusinessLookup/search/abn/{abn}',
            path: {
                'abn': abn,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param acn 
     * @returns BusinessLookupResult OK
     * @throws ApiError
     */
    public static getApiBusinessLookupSearchAcn(
acn: string,
): CancelablePromise<BusinessLookupResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/BusinessLookup/search/acn/{acn}',
            path: {
                'acn': acn,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param asic 
     * @returns BusinessLookupResult OK
     * @throws ApiError
     */
    public static getApiBusinessLookupSearchAsic(
asic: string,
): CancelablePromise<BusinessLookupResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/BusinessLookup/search/asic/{asic}',
            path: {
                'asic': asic,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns BusinessLookupResult OK
     * @throws ApiError
     */
    public static postApiBusinessLookupSearchNameSimple(
requestBody?: NameSimpleProtocolRequest,
): CancelablePromise<BusinessLookupResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/BusinessLookup/search/name/simple',
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
     * @param requestBody 
     * @returns BusinessLookupResult OK
     * @throws ApiError
     */
    public static postApiBusinessLookupSearchNameAdvanced(
requestBody?: NameSearchRequest,
): CancelablePromise<BusinessLookupResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/BusinessLookup/search/name/advanced',
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
     * @param identifier 
     * @returns BusinessLookupResult OK
     * @throws ApiError
     */
    public static getApiBusinessLookupDetails(
identifier: string,
): CancelablePromise<BusinessLookupResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/BusinessLookup/details/{identifier}',
            path: {
                'identifier': identifier,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param identifier 
     * @returns boolean OK
     * @throws ApiError
     */
    public static getApiBusinessLookupIsactive(
identifier: string,
): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/BusinessLookup/isactive/{identifier}',
            path: {
                'identifier': identifier,
            },
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @returns boolean OK
     * @throws ApiError
     */
    public static getApiBusinessLookupHealth(): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/BusinessLookup/health',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

}
