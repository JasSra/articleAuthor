/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApproveOrganizationDto } from '../models/ApproveOrganizationDto';
import type { BaseCrmEntityOperationResult } from '../models/BaseCrmEntityOperationResult';
import type { BooleanListOperationResult } from '../models/BooleanListOperationResult';
import type { BooleanOperationResult } from '../models/BooleanOperationResult';
import type { CreateOrganizationWithAttestationDto } from '../models/CreateOrganizationWithAttestationDto';
import type { OrganizationOperationResult } from '../models/OrganizationOperationResult';
import type { ReferenceLookupSearchResultOperationResult } from '../models/ReferenceLookupSearchResultOperationResult';
import type { RejectOrganizationDto } from '../models/RejectOrganizationDto';
import type { StringSearchResultOperationResult } from '../models/StringSearchResultOperationResult';
import type { StringStringDictionaryListOperationResult } from '../models/StringStringDictionaryListOperationResult';
import type { StringStringListDictionaryOperationResult } from '../models/StringStringListDictionaryOperationResult';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OrganizationService {

    /**
     * @param requestBody 
     * @returns OrganizationOperationResult Created
     * @throws ApiError
     */
    public static postApiAdevaOrganizationCreateWithAttestation(
requestBody?: CreateOrganizationWithAttestationDto,
): CancelablePromise<OrganizationOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/adeva/Organization/create-with-attestation',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @returns BaseCrmEntityOperationResult OK
     * @throws ApiError
     */
    public static getApiAdevaOrganizationMyOrganization(): CancelablePromise<BaseCrmEntityOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adeva/Organization/my-organization',
            errors: {
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns OrganizationOperationResult OK
     * @throws ApiError
     */
    public static postApiAdevaOrganizationApprove(
requestBody?: ApproveOrganizationDto,
): CancelablePromise<OrganizationOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/adeva/Organization/approve',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns OrganizationOperationResult OK
     * @throws ApiError
     */
    public static postApiAdevaOrganizationReject(
requestBody?: RejectOrganizationDto,
): CancelablePromise<OrganizationOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/adeva/Organization/reject',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @param page 
     * @param size 
     * @returns StringSearchResultOperationResult OK
     * @throws ApiError
     */
    public static getApiAdevaOrganizationAll(
page: number = 1,
size: number = 100,
): CancelablePromise<StringSearchResultOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adeva/Organization/all',
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @param id 
     * @returns OrganizationOperationResult OK
     * @throws ApiError
     */
    public static getApiAdevaOrganization(
id: string,
): CancelablePromise<OrganizationOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adeva/Organization/{id}',
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
    public static deleteApiAdevaOrganization(
id: string,
): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/adeva/Organization/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @param id 
     * @param from 
     * @param to 
     * @param count 
     * @param isAscending 
     * @returns StringStringDictionaryListOperationResult OK
     * @throws ApiError
     */
    public static getApiAdevaOrganizationAudit(
id: string,
from?: string,
to?: string,
count: number = 1000,
isAscending: boolean = true,
): CancelablePromise<StringStringDictionaryListOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adeva/Organization/audit/{id}',
            path: {
                'id': id,
            },
            query: {
                'from': from,
                'to': to,
                'count': count,
                'isAscending': isAscending,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @param id 
     * @returns BaseCrmEntityOperationResult OK
     * @throws ApiError
     */
    public static getApiAdevaOrganizationRaw(
id: string,
): CancelablePromise<BaseCrmEntityOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adeva/Organization/raw/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @param id 
     * @param requestBody 
     * @returns BaseCrmEntityOperationResult OK
     * @throws ApiError
     */
    public static putApiAdevaOrganizationUpdate(
id: string,
requestBody?: Record<string, any>,
): CancelablePromise<BaseCrmEntityOperationResult> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/adeva/Organization/update/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns BooleanListOperationResult OK
     * @throws ApiError
     */
    public static deleteApiAdevaOrganizationRemoveAll(): CancelablePromise<BooleanListOperationResult> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/adeva/Organization/remove/all',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns BaseCrmEntityOperationResult Created
     * @throws ApiError
     */
    public static postApiAdevaOrganizationCreate(
requestBody?: Record<string, any>,
): CancelablePromise<BaseCrmEntityOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/adeva/Organization/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @param page 
     * @param size 
     * @returns ReferenceLookupSearchResultOperationResult OK
     * @throws ApiError
     */
    public static getApiAdevaOrganizationDisplay(
page: number = 1,
size: number = 100,
): CancelablePromise<ReferenceLookupSearchResultOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adeva/Organization/display',
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @param id 
     * @returns StringStringListDictionaryOperationResult OK
     * @throws ApiError
     */
    public static getApiAdevaOrganizationNextstates(
id: string,
): CancelablePromise<StringStringListDictionaryOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adeva/Organization/nextstates/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @param id 
     * @param fieldId 
     * @param newState 
     * @returns void 
     * @throws ApiError
     */
    public static postApiAdevaOrganizationMovetostateFieldNewstate(
id: string,
fieldId: string,
newState: string,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/adeva/Organization/movetostate/{id}/field/{fieldId}/newstate/{newState}',
            path: {
                'id': id,
                'fieldId': fieldId,
                'newState': newState,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param fieldId 
     * @param prefix 
     * @returns string OK
     * @throws ApiError
     */
    public static getApiAdevaOrganizationSuggestionsField(
fieldId: string,
prefix?: string,
): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adeva/Organization/suggestions/field/{fieldId}',
            path: {
                'fieldId': fieldId,
            },
            query: {
                'prefix': prefix,
            },
        });
    }

}
