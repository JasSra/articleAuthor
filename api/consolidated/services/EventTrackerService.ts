/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AIEventPayload } from '../models/AIEventPayload';
import type { AISuggestion } from '../models/AISuggestion';
import type { BatchTrackEventRequest } from '../models/BatchTrackEventRequest';
import type { EventAnalytics } from '../models/EventAnalytics';
import type { EventCount } from '../models/EventCount';
import type { EventStatistics } from '../models/EventStatistics';
import type { PredictionContext } from '../models/PredictionContext';
import type { StringObjectDictionaryOperationResult } from '../models/StringObjectDictionaryOperationResult';
import type { StringOperationResult } from '../models/StringOperationResult';
import type { TrackEventResponse } from '../models/TrackEventResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EventTrackerService {

    /**
     * @param eventName 
     * @param requestBody 
     * @returns TrackEventResponse OK
     * @throws ApiError
     */
    public static postApiEventTrackerTrack(
eventName: string,
requestBody?: AIEventPayload,
): CancelablePromise<TrackEventResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/EventTracker/track/{eventName}',
            path: {
                'eventName': eventName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns TrackEventResponse OK
     * @throws ApiError
     */
    public static postApiEventTrackerTrackBatch(
requestBody?: BatchTrackEventRequest,
): CancelablePromise<Array<TrackEventResponse>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/EventTracker/track/batch',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns AISuggestion OK
     * @throws ApiError
     */
    public static postApiEventTrackerSuggestions(
requestBody?: PredictionContext,
): CancelablePromise<Array<AISuggestion>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/EventTracker/suggestions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @param from 
     * @param to 
     * @param eventPattern 
     * @param userScope 
     * @returns EventAnalytics OK
     * @throws ApiError
     */
    public static getApiEventTrackerAnalytics(
from: string,
to: string,
eventPattern?: string,
userScope: string = 'current',
): CancelablePromise<Array<EventAnalytics>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/EventTracker/analytics',
            query: {
                'from': from,
                'to': to,
                'eventPattern': eventPattern,
                'userScope': userScope,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @param from 
     * @param to 
     * @param limit 
     * @returns string OK
     * @throws ApiError
     */
    public static getApiEventTrackerHistory(
from?: string,
to?: string,
limit: number = 100,
): CancelablePromise<Array<Record<string, string>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/EventTracker/history',
            query: {
                'from': from,
                'to': to,
                'limit': limit,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @param retentionDays 
     * @returns StringOperationResult OK
     * @throws ApiError
     */
    public static postApiEventTrackerCleanup(
retentionDays: number = 90,
): CancelablePromise<StringOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/EventTracker/cleanup',
            query: {
                'retentionDays': retentionDays,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * @returns StringObjectDictionaryOperationResult OK
     * @throws ApiError
     */
    public static getApiEventTrackerHealth(): CancelablePromise<StringObjectDictionaryOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/EventTracker/health',
        });
    }

    /**
     * @param from 
     * @param to 
     * @param userScope 
     * @returns EventStatistics OK
     * @throws ApiError
     */
    public static getApiEventTrackerStatistics(
from: string,
to: string,
userScope: string = 'current',
): CancelablePromise<EventStatistics> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/EventTracker/statistics',
            query: {
                'from': from,
                'to': to,
                'userScope': userScope,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @param from 
     * @param to 
     * @param userScope 
     * @returns string OK
     * @throws ApiError
     */
    public static getApiEventTrackerEventsUnique(
from: string,
to: string,
userScope: string = 'current',
): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/EventTracker/events/unique',
            query: {
                'from': from,
                'to': to,
                'userScope': userScope,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @param from 
     * @param to 
     * @param userScope 
     * @param orderBy 
     * @param limit 
     * @returns EventCount OK
     * @throws ApiError
     */
    public static getApiEventTrackerEventsCounts(
from: string,
to: string,
userScope: string = 'current',
orderBy: string = 'most',
limit: number = 50,
): CancelablePromise<Array<EventCount>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/EventTracker/events/counts',
            query: {
                'from': from,
                'to': to,
                'userScope': userScope,
                'orderBy': orderBy,
                'limit': limit,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @param from 
     * @param to 
     * @param userScope 
     * @param eventPattern 
     * @returns number OK
     * @throws ApiError
     */
    public static getApiEventTrackerEventsTotal(
from: string,
to: string,
userScope: string = 'current',
eventPattern?: string,
): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/EventTracker/events/total',
            query: {
                'from': from,
                'to': to,
                'userScope': userScope,
                'eventPattern': eventPattern,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }

}
