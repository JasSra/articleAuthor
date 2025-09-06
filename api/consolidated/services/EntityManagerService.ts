/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityDefinition } from '../models/EntityDefinition';
import type { EntityDefinitionListOperationResult } from '../models/EntityDefinitionListOperationResult';
import type { EntityDefinitionOperationResult } from '../models/EntityDefinitionOperationResult';
import type { EntityExistsResponseOperationResult } from '../models/EntityExistsResponseOperationResult';
import type { FieldDefinitionOperationResult } from '../models/FieldDefinitionOperationResult';
import type { Int64OperationResult } from '../models/Int64OperationResult';
import type { RelationshipIntegrityReportOperationResult } from '../models/RelationshipIntegrityReportOperationResult';
import type { StringListOperationResult } from '../models/StringListOperationResult';
import type { StringOperationResult } from '../models/StringOperationResult';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EntityManagerService {

    /**
     * @param requestBody
     * @returns EntityDefinitionOperationResult OK
     * @throws ApiError
     */
    public static register(
        requestBody?: EntityDefinition,
    ): CancelablePromise<EntityDefinitionOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/manager/Register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param entityId
     * @returns StringOperationResult OK
     * @throws ApiError
     */
    public static deleteDefinition(
        entityId: string,
    ): CancelablePromise<StringOperationResult> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/manager/delete/{entityId}',
            path: {
                'entityId': entityId,
            },
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @returns StringOperationResult OK
     * @throws ApiError
     */
    public static deleteAll(): CancelablePromise<StringOperationResult> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/manager/DeleteAll',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @returns Int64OperationResult OK
     * @throws ApiError
     */
    public static getTotalDefinitionCount(): CancelablePromise<Int64OperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manager/Count',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @returns EntityDefinitionListOperationResult OK
     * @throws ApiError
     */
    public static getAll(): CancelablePromise<EntityDefinitionListOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manager/GetAll',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param module
     * @param entityName
     * @returns EntityDefinitionOperationResult OK
     * @throws ApiError
     */
    public static getDefinitionByCategory(
        module: string,
        entityName: string,
    ): CancelablePromise<EntityDefinitionOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manager/get/{module}/name/{entityName}',
            path: {
                'module': module,
                'entityName': entityName,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @param entityId
     * @returns EntityDefinitionOperationResult OK
     * @throws ApiError
     */
    public static getDefinitionById(
        entityId: string,
    ): CancelablePromise<EntityDefinitionOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manager/get/id/{entityId}',
            path: {
                'entityId': entityId,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @param module
     * @param entityName
     * @returns EntityExistsResponseOperationResult OK
     * @throws ApiError
     */
    public static doesDefinitionExist(
        module: string,
        entityName: string,
    ): CancelablePromise<EntityExistsResponseOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manager/exists/{module}/name/{entityName}',
            path: {
                'module': module,
                'entityName': entityName,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @returns StringListOperationResult OK
     * @throws ApiError
     */
    public static getAllFields(): CancelablePromise<StringListOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manager/fields',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param fieldType
     * @param fieldName
     * @returns FieldDefinitionOperationResult OK
     * @throws ApiError
     */
    public static getFieldByName(
        fieldType: string,
        fieldName: string,
    ): CancelablePromise<FieldDefinitionOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manager/generate/field/{fieldType}/name/{fieldName}',
            path: {
                'fieldType': fieldType,
                'fieldName': fieldName,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns StringListOperationResult OK
     * @throws ApiError
     */
    public static getEditors(): CancelablePromise<StringListOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manager/editors',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @returns RelationshipIntegrityReportOperationResult OK
     * @throws ApiError
     */
    public static checkRelationshipIntegrity(): CancelablePromise<RelationshipIntegrityReportOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/manager/CheckRelationshipIntegrity',
        });
    }

}
