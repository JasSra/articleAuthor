/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ListOfConfigKeysDto } from '../models/ListOfConfigKeysDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ConfigurationService {

    /**
     * @param key 
     * @returns string OK
     * @throws ApiError
     */
    public static getConfigByKey(
key: string,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/configuration/{key}',
            path: {
                'key': key,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @param key 
     * @param encrypted 
     * @param requestBody 
     * @returns any OK
     * @throws ApiError
     */
    public static setConfigByKey(
key: string,
encrypted: boolean = false,
requestBody?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/configuration/{key}',
            path: {
                'key': key,
            },
            query: {
                'encrypted': encrypted,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }

    /**
     * @param key 
     * @returns void 
     * @throws ApiError
     */
    public static removeConfigByKey(
key: string,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/configuration/{key}',
            path: {
                'key': key,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @param key 
     * @returns boolean OK
     * @throws ApiError
     */
    public static configKeyExists(
key: string,
): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/configuration/exists/{key}',
            path: {
                'key': key,
            },
        });
    }

    /**
     * @returns ListOfConfigKeysDto OK
     * @throws ApiError
     */
    public static getAllConfigKeys(): CancelablePromise<ListOfConfigKeysDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/configuration/keys',
        });
    }

}
