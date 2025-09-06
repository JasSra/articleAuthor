/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseCrmEntityOperationResult } from '../models/BaseCrmEntityOperationResult';
import type { BooleanListOperationResult } from '../models/BooleanListOperationResult';
import type { BooleanOperationResult } from '../models/BooleanOperationResult';
import type { MapperItem } from '../models/MapperItem';
import type { QueryRequest } from '../models/QueryRequest';
import type { QueryResponseOperationResult } from '../models/QueryResponseOperationResult';
import type { ReferenceLookupSearchResultOperationResult } from '../models/ReferenceLookupSearchResultOperationResult';
import type { StringListOperationResult } from '../models/StringListOperationResult';
import type { StringObjectDictionaryListOperationResult } from '../models/StringObjectDictionaryListOperationResult';
import type { StringOperationResult } from '../models/StringOperationResult';
import type { StringSearchResultOperationResult } from '../models/StringSearchResultOperationResult';
import type { StringStringDictionaryListOperationResult } from '../models/StringStringDictionaryListOperationResult';
import type { StringStringListDictionaryOperationResult } from '../models/StringStringListDictionaryOperationResult';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DataService {

    /**
     * @param id
     * @returns BaseCrmEntityOperationResult OK
     * @throws ApiError
     */
    public static getById(
        id: string,
    ): CancelablePromise<BaseCrmEntityOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Data/by/{id}',
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
     * @param module
     * @param entityName
     * @param page
     * @param size
     * @returns StringSearchResultOperationResult OK
     * @throws ApiError
     */
    public static getAllEntities(
        module: string,
        entityName: string,
        page: number = 1,
        size: number = 100,
    ): CancelablePromise<StringSearchResultOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Data/all/{module}/entity/{entityName}/page/{page}/size/{size}',
            path: {
                'module': module,
                'entityName': entityName,
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
     * @param definitionId
     * @param page
     * @param size
     * @returns StringSearchResultOperationResult OK
     * @throws ApiError
     */
    public static getAllEntitiesById(
        definitionId: string,
        page: number = 1,
        size: number = 100,
    ): CancelablePromise<StringSearchResultOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Data/all/{definitionId}/page/{page}/size/{size}',
            path: {
                'definitionId': definitionId,
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
     * @param relationName
     * @param id
     * @param toId
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static addChildToRelations(
        relationName: string,
        id: string,
        toId: string,
    ): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Data/add/from/{id}/relation/{relationName}/to/{toId}',
            path: {
                'relationName': relationName,
                'id': id,
                'toId': toId,
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
     * @param relationName
     * @param id
     * @param toId
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static removeChildFromRelation(
        relationName: string,
        id: string,
        toId: string,
    ): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Data/remove/{id}/relation/{relationName}/to/{toId}',
            path: {
                'relationName': relationName,
                'id': id,
                'toId': toId,
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
     * @param relationName
     * @param id
     * @returns StringListOperationResult OK
     * @throws ApiError
     */
    public static getRelationalValue(
        relationName: string,
        id: string,
    ): CancelablePromise<StringListOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Data/relational/{id}/relation/{relationName}',
            path: {
                'relationName': relationName,
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
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static deleteEntity(
        id: string,
    ): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/Data/remove/{id}',
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
     * @param module
     * @param entityName
     * @returns BooleanListOperationResult OK
     * @throws ApiError
     */
    public static deleteAllEntities(
        module: string,
        entityName: string,
    ): CancelablePromise<BooleanListOperationResult> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/Data/remove/{module}/entity/{entityName}/all',
            path: {
                'module': module,
                'entityName': entityName,
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
     * @param module
     * @param entityName
     * @param requestBody
     * @returns any Created
     * @throws ApiError
     */
    public static createEntity(
        module: string,
        entityName: string,
        requestBody?: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Data/create/{module}/entity/{entityName}',
            path: {
                'module': module,
                'entityName': entityName,
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
     * @param module
     * @param entityName
     * @param skipAudit
     * @param skipUserAudit
     * @param skipSuggestions
     * @param skipRelations
     * @param skipJobs
     * @param skipVectors
     * @param skipUniqueChecks
     * @returns StringObjectDictionaryListOperationResult Created
     * @throws ApiError
     */
    public static bulkImportEntities(
        module: string,
        entityName: string,
        skipAudit: boolean = false,
        skipUserAudit: boolean = false,
        skipSuggestions: boolean = false,
        skipRelations: boolean = false,
        skipJobs: boolean = false,
        skipVectors: boolean = false,
        skipUniqueChecks: boolean = false,
    ): CancelablePromise<StringObjectDictionaryListOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Data/import/{module}/entity/{entityName}',
            path: {
                'module': module,
                'entityName': entityName,
            },
            query: {
                'skipAudit': skipAudit,
                'skipUserAudit': skipUserAudit,
                'skipSuggestions': skipSuggestions,
                'skipRelations': skipRelations,
                'skipJobs': skipJobs,
                'skipVectors': skipVectors,
                'skipUniqueChecks': skipUniqueChecks,
            },
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns BaseCrmEntityOperationResult OK
     * @throws ApiError
     */
    public static updateEntity(
        id: string,
        requestBody?: Record<string, any>,
    ): CancelablePromise<BaseCrmEntityOperationResult> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/Data/update/{id}',
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
     * @param id
     * @param attributeName
     * @param requestBody
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static patchEntityAttribute(
        id: string,
        attributeName: string,
        requestBody?: any,
    ): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/Data/patch/{id}/attribute/{attributeName}',
            path: {
                'id': id,
                'attributeName': attributeName,
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
     * @param id
     * @param attributeName
     * @param amount
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static incrementEntityAttribute(
        id: string,
        attributeName: string,
        amount: number = 1,
    ): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Data/increment/{id}/attribute/{attributeName}',
            path: {
                'id': id,
                'attributeName': attributeName,
            },
            query: {
                'amount': amount,
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
     * @param attributeName
     * @param requestBody
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static jsonArrayAppendEntityAttribute(
        id: string,
        attributeName: string,
        requestBody?: any,
    ): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Data/jsonarray/append/{id}/attribute/{attributeName}',
            path: {
                'id': id,
                'attributeName': attributeName,
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
     * @param id
     * @param attributeName
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static jsonArrayClearEntityAttribute(
        id: string,
        attributeName: string,
    ): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Data/jsonarray/clear/{id}/attribute/{attributeName}',
            path: {
                'id': id,
                'attributeName': attributeName,
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
     * @param requestBody
     * @returns QueryResponseOperationResult OK
     * @throws ApiError
     */
    public static postApiDataQuery(
        requestBody?: QueryRequest,
    ): CancelablePromise<QueryResponseOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Data/query',
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
     * @param module
     * @param entityName
     * @param page
     * @param size
     * @returns ReferenceLookupSearchResultOperationResult OK
     * @throws ApiError
     */
    public static getAllDisplay(
        module: string,
        entityName: string,
        page: number = 1,
        size: number = 100,
    ): CancelablePromise<ReferenceLookupSearchResultOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Data/display/{module}/entity/{entityName}/page/{page}/size/{size}',
            path: {
                'module': module,
                'entityName': entityName,
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
    public static getNextStates(
        id: string,
    ): CancelablePromise<StringStringListDictionaryOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Data/nextstates/{id}',
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
    public static moveToState(
        id: string,
        fieldId: string,
        newState: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Data/movetostate/{id}/field/{fieldId}/newstate/{newState}',
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
     * @param id
     * @param from
     * @param to
     * @param count
     * @param isAscending
     * @returns StringStringDictionaryListOperationResult OK
     * @throws ApiError
     */
    public static getAuditEvents(
        id: string,
        from?: string,
        to?: string,
        count: number = 1000,
        isAscending: boolean = true,
    ): CancelablePromise<StringStringDictionaryListOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Data/audit/{id}',
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
     * @param module
     * @param entityName
     * @param fieldId
     * @param prefix
     * @returns string OK
     * @throws ApiError
     */
    public static getSuggestions(
        module: string,
        entityName: string,
        fieldId: string,
        prefix?: string,
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Data/suggestions/{module}/entity/{entityName}/field/{fieldId}',
            path: {
                'module': module,
                'entityName': entityName,
                'fieldId': fieldId,
            },
            query: {
                'prefix': prefix,
            },
        });
    }

    /**
     * @param module
     * @param entityName
     * @param fieldId
     * @param _function
     * @returns StringOperationResult OK
     * @throws ApiError
     */
    public static getHint(
        module: string,
        entityName: string,
        fieldId: string,
        _function?: string,
    ): CancelablePromise<StringOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Data/hint/{module}/entity/{entityName}/field/{fieldId}',
            path: {
                'module': module,
                'entityName': entityName,
                'fieldId': fieldId,
            },
            query: {
                'function': _function,
            },
        });
    }

    /**
     * @returns MapperItem OK
     * @throws ApiError
     */
    public static getMappings(): CancelablePromise<Array<MapperItem>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Data/suggestion/mappings',
        });
    }

}
