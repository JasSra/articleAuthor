/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AiDemoService {

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiAiDemoEntitySuggestions(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/AiDemo/entity-suggestions',
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiAiDemoFormSuggestions(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/AiDemo/form-suggestions',
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiAiDemoNotificationSuggestions(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/AiDemo/notification-suggestions',
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiAiDemoTemplateSuggestions(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/AiDemo/template-suggestions',
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiAiDemoRelationshipSuggestions(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/AiDemo/relationship-suggestions',
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiAiDemoNotificationVariations(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/AiDemo/notification-variations',
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiAiDemoComprehensiveDemo(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/AiDemo/comprehensive-demo',
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiAiDemoDebtStageDemo(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/AiDemo/debt-stage-demo',
        });
    }

}
