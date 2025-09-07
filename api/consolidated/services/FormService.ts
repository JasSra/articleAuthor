/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanOperationResult } from '../models/BooleanOperationResult';
import type { Form } from '../models/Form';
import type { FormEntry } from '../models/FormEntry';
import type { FormOperationResult } from '../models/FormOperationResult';
import type { FormResponse } from '../models/FormResponse';
import type { GetFormEntriesResponse } from '../models/GetFormEntriesResponse';
import type { ListOfFormResponse } from '../models/ListOfFormResponse';
import type { LookupValue } from '../models/LookupValue';
import type { ReferenceLookupSearchResult } from '../models/ReferenceLookupSearchResult';
import type { ValidateFieldRequest } from '../models/ValidateFieldRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FormService {

    /**
     * @param id 
     * @param page 
     * @param size 
     * @returns GetFormEntriesResponse OK
     * @throws ApiError
     */
    public static getAllEntriesForForm(
id: string,
page: number = 1,
size: number = 20,
): CancelablePromise<GetFormEntriesResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/form/{id}/entries',
            path: {
                'id': id,
            },
            query: {
                'page': page,
                'size': size,
            },
        });
    }

    /**
     * @param groupName 
     * @returns LookupValue OK
     * @throws ApiError
     */
    public static getLookupsForName(
groupName: string,
): CancelablePromise<Array<LookupValue>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/form/lookup/{groupName}',
            path: {
                'groupName': groupName,
            },
        });
    }

    /**
     * @returns string OK
     * @throws ApiError
     */
    public static getLookupGroupNames(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/form/lookup/groups',
        });
    }

    /**
     * @param module 
     * @param name 
     * @param page 
     * @param size 
     * @returns ReferenceLookupSearchResult OK
     * @throws ApiError
     */
    public static getReferenceLookupsByModule(
module: string,
name: string,
page: number = 1,
size: number = 20,
): CancelablePromise<ReferenceLookupSearchResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/form/reference/module/{module}/entity/{name}/page/{page}/size/{size}',
            path: {
                'module': module,
                'name': name,
                'page': page,
                'size': size,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static postApiFormIsBeingUsed(
requestBody?: ValidateFieldRequest,
): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/form/is-being-used',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiFormAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/form/all',
        });
    }

    /**
     * @param slug 
     * @returns Form OK
     * @throws ApiError
     */
    public static getForm(
slug: string,
): CancelablePromise<Form> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/form/{slug}',
            path: {
                'slug': slug,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @param slug 
     * @returns string OK
     * @throws ApiError
     */
    public static deleteForm(
slug: string,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/form/{slug}',
            path: {
                'slug': slug,
            },
        });
    }

    /**
     * @param id 
     * @returns Form OK
     * @throws ApiError
     */
    public static getFormById(
id: string,
): CancelablePromise<Form> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/form/id/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @param page 
     * @param size 
     * @returns ListOfFormResponse OK
     * @throws ApiError
     */
    public static getAllForms(
page: number = 1,
size: number = 10,
): CancelablePromise<ListOfFormResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/form',
            query: {
                'page': page,
                'size': size,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns FormOperationResult OK
     * @throws ApiError
     */
    public static createForm(
requestBody?: Form,
): CancelablePromise<FormOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/form',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }

    /**
     * @param slug 
     * @param requestBody 
     * @returns string OK
     * @throws ApiError
     */
    public static isFormValid(
slug: string,
requestBody?: FormEntry,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/form/{slug}/validate',
            path: {
                'slug': slug,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param slug 
     * @returns FormResponse OK
     * @throws ApiError
     */
    public static submit(
slug: string,
): CancelablePromise<FormResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/form/{slug}/submit',
            path: {
                'slug': slug,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }

}
