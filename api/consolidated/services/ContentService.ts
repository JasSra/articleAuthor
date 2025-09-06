/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SiteContentOperationResult } from '../models/SiteContentOperationResult';
import type { StringSearchResultOperationResult } from '../models/StringSearchResultOperationResult';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ContentService {

    /**
     * @param id
     * @returns SiteContentOperationResult OK
     * @throws ApiError
     */
    public static getApiContent(
        id: string,
    ): CancelablePromise<SiteContentOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Content/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @param placeholder
     * @param type
     * @returns StringSearchResultOperationResult OK
     * @throws ApiError
     */
    public static getApiContentTypePlaceholder(
        placeholder: string,
        type: string,
    ): CancelablePromise<StringSearchResultOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Content/type/{type}/placeholder/{placeholder}',
            path: {
                'placeholder': placeholder,
                'type': type,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

}
