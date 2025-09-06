/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StringListOperationResult } from '../models/StringListOperationResult';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RelationsService {

    /**
     * @param id
     * @param targetModule
     * @param targetEntity
     * @param relationName
     * @returns StringListOperationResult OK
     * @throws ApiError
     */
    public static getInboundRelated(
        id: string,
        targetModule: string,
        targetEntity: string,
        relationName?: string,
    ): CancelablePromise<StringListOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Relations/inbound/{id}/target/{targetModule}/entity/{targetEntity}',
            path: {
                'id': id,
                'targetModule': targetModule,
                'targetEntity': targetEntity,
            },
            query: {
                'relationName': relationName,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
