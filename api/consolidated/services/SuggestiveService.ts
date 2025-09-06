/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PromptRequest } from '../models/PromptRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SuggestiveService {

    /**
     * @param requestBody
     * @returns string OK
     * @throws ApiError
     */
    public static makeSuggestion(
        requestBody?: PromptRequest,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/suggest/query',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
