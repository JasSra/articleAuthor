/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DebtNotificationSuggestionRequest } from '../models/DebtNotificationSuggestionRequest';
import type { DebtNotificationSuggestionResponse } from '../models/DebtNotificationSuggestionResponse';
import type { EntityDefinitionSuggestionRequest } from '../models/EntityDefinitionSuggestionRequest';
import type { EntityDefinitionSuggestionResponse } from '../models/EntityDefinitionSuggestionResponse';
import type { FormFieldSuggestionRequest } from '../models/FormFieldSuggestionRequest';
import type { FormFieldSuggestionResponse } from '../models/FormFieldSuggestionResponse';
import type { NotificationTemplate } from '../models/NotificationTemplate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AiSuggestionsService {

    /**
     * @param requestBody 
     * @returns EntityDefinitionSuggestionResponse OK
     * @throws ApiError
     */
    public static postApiAiSuggestionsEntityDefinition(
requestBody?: EntityDefinitionSuggestionRequest,
): CancelablePromise<EntityDefinitionSuggestionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/AiSuggestions/entity-definition',
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
     * @returns DebtNotificationSuggestionResponse OK
     * @throws ApiError
     */
    public static postApiAiSuggestionsDebtNotification(
requestBody?: DebtNotificationSuggestionRequest,
): CancelablePromise<DebtNotificationSuggestionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/AiSuggestions/debt-notification',
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
     * @returns FormFieldSuggestionResponse OK
     * @throws ApiError
     */
    public static postApiAiSuggestionsFormFields(
requestBody?: FormFieldSuggestionRequest,
): CancelablePromise<FormFieldSuggestionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/AiSuggestions/form-fields',
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
     * @param entityName 
     * @param module 
     * @param requestBody 
     * @returns EntityDefinitionSuggestionResponse OK
     * @throws ApiError
     */
    public static postApiAiSuggestionsEntityDefinitionAnalyze(
entityName: string,
module: string,
requestBody: string,
): CancelablePromise<EntityDefinitionSuggestionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/AiSuggestions/entity-definition/analyze',
            query: {
                'entityName': entityName,
                'module': module,
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
     * @param context 
     * @param variationCount 
     * @returns NotificationTemplate OK
     * @throws ApiError
     */
    public static postApiAiSuggestionsNotificationVariations(
requestBody: string,
context: string = '',
variationCount: number = 3,
): CancelablePromise<Array<NotificationTemplate>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/AiSuggestions/notification-variations',
            query: {
                'context': context,
                'variationCount': variationCount,
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
     * @returns string OK
     * @throws ApiError
     */
    public static getApiAiSuggestionsDebtStages(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/AiSuggestions/debt-stages',
        });
    }

    /**
     * @returns string OK
     * @throws ApiError
     */
    public static getApiAiSuggestionsCommunicationChannels(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/AiSuggestions/communication-channels',
        });
    }

    /**
     * @returns string OK
     * @throws ApiError
     */
    public static getApiAiSuggestionsFieldTypes(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/AiSuggestions/field-types',
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiAiSuggestionsHealth(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/AiSuggestions/health',
        });
    }

}
