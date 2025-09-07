/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ComprehensiveContentRequest } from '../models/ComprehensiveContentRequest';
import type { ComprehensiveContentSuggestion } from '../models/ComprehensiveContentSuggestion';
import type { EntityAnalysisRequest } from '../models/EntityAnalysisRequest';
import type { EntityDefinitionSuggestionResponse } from '../models/EntityDefinitionSuggestionResponse';
import type { NotificationContent } from '../models/NotificationContent';
import type { RelationshipRequest } from '../models/RelationshipRequest';
import type { RelationshipSuggestion } from '../models/RelationshipSuggestion';
import type { TemplateRequest } from '../models/TemplateRequest';
import type { TemplateSuggestion } from '../models/TemplateSuggestion';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AiSuggestionsEnhancedService {

    /**
     * @param requestBody 
     * @returns TemplateSuggestion OK
     * @throws ApiError
     */
    public static postApiAiSuggestionsEnhancedTemplates(
requestBody: TemplateRequest,
): CancelablePromise<TemplateSuggestion> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/AiSuggestionsEnhanced/templates',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns RelationshipSuggestion OK
     * @throws ApiError
     */
    public static postApiAiSuggestionsEnhancedRelationships(
requestBody: RelationshipRequest,
): CancelablePromise<RelationshipSuggestion> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/AiSuggestionsEnhanced/relationships',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param requestBody 
     * @param context 
     * @param variationCount 
     * @returns NotificationContent OK
     * @throws ApiError
     */
    public static postApiAiSuggestionsEnhancedNotificationsVariations(
requestBody: string,
context: string = '',
variationCount: number = 3,
): CancelablePromise<Array<NotificationContent>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/AiSuggestionsEnhanced/notifications/variations',
            query: {
                'context': context,
                'variationCount': variationCount,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns EntityDefinitionSuggestionResponse OK
     * @throws ApiError
     */
    public static postApiAiSuggestionsEnhancedEntitiesAnalyze(
requestBody: EntityAnalysisRequest,
): CancelablePromise<EntityDefinitionSuggestionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/AiSuggestionsEnhanced/entities/analyze',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns ComprehensiveContentSuggestion OK
     * @throws ApiError
     */
    public static postApiAiSuggestionsEnhancedContentComprehensive(
requestBody: ComprehensiveContentRequest,
): CancelablePromise<ComprehensiveContentSuggestion> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/AiSuggestionsEnhanced/content/comprehensive',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }

}
