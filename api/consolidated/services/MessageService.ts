/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageSearchResult } from '../models/MessageSearchResult';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MessageService {

    /**
     * @param page 
     * @param size 
     * @param since 
     * @returns MessageSearchResult OK
     * @throws ApiError
     */
    public static getMessages(
page: number = 1,
size: number = 10,
since?: string,
): CancelablePromise<MessageSearchResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Message',
            query: {
                'page': page,
                'size': size,
                'since': since,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static removeAllMessages(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/Message',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * @param messageId 
     * @returns any OK
     * @throws ApiError
     */
    public static markAsRead(
messageId: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Message/mark-read/{messageId}',
            path: {
                'messageId': messageId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @param messageId 
     * @returns any OK
     * @throws ApiError
     */
    public static markAsUnread(
messageId: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Message/mark-unread/{messageId}',
            path: {
                'messageId': messageId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
