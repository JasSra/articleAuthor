/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressOperationResult } from '../models/AddressOperationResult';
import type { BaseCrmEntityOperationResult } from '../models/BaseCrmEntityOperationResult';
import type { BooleanListOperationResult } from '../models/BooleanListOperationResult';
import type { BooleanOperationResult } from '../models/BooleanOperationResult';
import type { ReferenceLookupSearchResultOperationResult } from '../models/ReferenceLookupSearchResultOperationResult';
import type { StringSearchResultOperationResult } from '../models/StringSearchResultOperationResult';
import type { StringStringDictionaryListOperationResult } from '../models/StringStringDictionaryListOperationResult';
import type { StringStringListDictionaryOperationResult } from '../models/StringStringListDictionaryOperationResult';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AddressService {

    /**
     * @param page 
     * @param size 
     * @returns StringSearchResultOperationResult OK
     * @throws ApiError
     */
    public static getApiAdevaAddressAll(
page: number = 1,
size: number = 100,
): CancelablePromise<StringSearchResultOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adeva/Address/all',
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
     * @returns AddressOperationResult OK
     * @throws ApiError
     */
    public static getApiAdevaAddress(
id: string,
): CancelablePromise<AddressOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adeva/Address/{id}',
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
    public static deleteApiAdevaAddress(
id: string,
): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/adeva/Address/{id}',
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
    public static getApiAdevaAddressAudit(
id: string,
from?: string,
to?: string,
count: number = 1000,
isAscending: boolean = true,
): CancelablePromise<StringStringDictionaryListOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adeva/Address/audit/{id}',
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
    public static getApiAdevaAddressRaw(
id: string,
): CancelablePromise<BaseCrmEntityOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adeva/Address/raw/{id}',
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
    public static putApiAdevaAddressUpdate(
id: string,
requestBody?: Record<string, any>,
): CancelablePromise<BaseCrmEntityOperationResult> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/adeva/Address/update/{id}',
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
    public static deleteApiAdevaAddressRemoveAll(): CancelablePromise<BooleanListOperationResult> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/adeva/Address/remove/all',
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
    public static postApiAdevaAddressCreate(
requestBody?: Record<string, any>,
): CancelablePromise<BaseCrmEntityOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/adeva/Address/create',
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
    public static getApiAdevaAddressDisplay(
page: number = 1,
size: number = 100,
): CancelablePromise<ReferenceLookupSearchResultOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adeva/Address/display',
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
    public static getApiAdevaAddressNextstates(
id: string,
): CancelablePromise<StringStringListDictionaryOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adeva/Address/nextstates/{id}',
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
    public static postApiAdevaAddressMovetostateFieldNewstate(
id: string,
fieldId: string,
newState: string,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/adeva/Address/movetostate/{id}/field/{fieldId}/newstate/{newState}',
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
    public static getApiAdevaAddressSuggestionsField(
fieldId: string,
prefix?: string,
): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/adeva/Address/suggestions/field/{fieldId}',
            path: {
                'fieldId': fieldId,
            },
            query: {
                'prefix': prefix,
            },
        });
    }

}
