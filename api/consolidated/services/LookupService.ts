/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddLookupRequest } from '../models/AddLookupRequest';
import type { AddLookupsToGroupRequest } from '../models/AddLookupsToGroupRequest';
import type { CreateLookupItemRequest } from '../models/CreateLookupItemRequest';
import type { Lookup } from '../models/Lookup';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LookupService {

    /**
     * @param groupName 
     * @returns Lookup OK
     * @throws ApiError
     */
    public static lookupGetByGroup(
groupName: string,
): CancelablePromise<Array<Lookup>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Lookup/group/{groupName}',
            path: {
                'groupName': groupName,
            },
        });
    }

    /**
     * @param groupName 
     * @returns any OK
     * @throws ApiError
     */
    public static lookupDeleteGroup(
groupName: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/Lookup/group/{groupName}',
            path: {
                'groupName': groupName,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns Lookup OK
     * @throws ApiError
     */
    public static lookupAddLookup(
requestBody?: AddLookupRequest,
): CancelablePromise<Lookup> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Lookup',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param groupName 
     * @param requestBody 
     * @returns Lookup OK
     * @throws ApiError
     */
    public static lookupCreateLookupItem(
groupName: string,
requestBody?: CreateLookupItemRequest,
): CancelablePromise<Lookup> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Lookup/group/{groupName}/item',
            path: {
                'groupName': groupName,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param groupName 
     * @param requestBody 
     * @returns Lookup OK
     * @throws ApiError
     */
    public static lookupAddLookupsToGroup(
groupName: string,
requestBody?: AddLookupsToGroupRequest,
): CancelablePromise<Array<Lookup>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Lookup/group/{groupName}/bulk',
            path: {
                'groupName': groupName,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param lookupId 
     * @returns any OK
     * @throws ApiError
     */
    public static lookupRemoveLookup(
lookupId: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/Lookup/{lookupId}',
            path: {
                'lookupId': lookupId,
            },
        });
    }

    /**
     * @param groupName 
     * @returns any OK
     * @throws ApiError
     */
    public static lookupClearGroup(
groupName: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Lookup/group/{groupName}/clear',
            path: {
                'groupName': groupName,
            },
        });
    }

}
