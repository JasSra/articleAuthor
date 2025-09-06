/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationEvent } from '../models/NotificationEvent';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NotificationsService {

    /**
     * @param channels
     * @param tenantId
     * @param organizationId
     * @param userId
     * @param sinceId
     * @returns any OK
     * @throws ApiError
     */
    public static getApiNotificationsStream(
        channels?: string,
        tenantId?: string,
        organizationId?: string,
        userId?: string,
        sinceId?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Notifications/stream',
            query: {
                'channels': channels,
                'tenantId': tenantId,
                'organizationId': organizationId,
                'userId': userId,
                'sinceId': sinceId,
            },
        });
    }

    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiNotificationsPublish(
        requestBody?: NotificationEvent,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Notifications/publish',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param channels
     * @param tenantId
     * @param organizationId
     * @param userId
     * @param sinceId
     * @param take
     * @returns any OK
     * @throws ApiError
     */
    public static getApiNotificationsHistory(
        channels?: string,
        tenantId?: string,
        organizationId?: string,
        userId?: string,
        sinceId?: string,
        take: number = 100,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Notifications/history',
            query: {
                'channels': channels,
                'tenantId': tenantId,
                'organizationId': organizationId,
                'userId': userId,
                'sinceId': sinceId,
                'take': take,
            },
        });
    }

}
