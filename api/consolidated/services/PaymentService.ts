/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentSession } from '../models/PaymentSession';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PaymentService {

    /**
     * @param provider
     * @param userId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiPaymentSession(
        provider: string,
        userId?: string,
        requestBody?: PaymentSession,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/payment/{provider}/session',
            path: {
                'provider': provider,
            },
            query: {
                'userId': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param provider
     * @param sessionId
     * @param userId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiPaymentSessionCapture(
        provider: string,
        sessionId: string,
        userId?: string,
        requestBody?: Record<string, string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/payment/{provider}/session/{sessionId}/capture',
            path: {
                'provider': provider,
                'sessionId': sessionId,
            },
            query: {
                'userId': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param provider
     * @param sessionId
     * @param amount
     * @param userId
     * @returns any OK
     * @throws ApiError
     */
    public static postApiPaymentSessionRefund(
        provider: string,
        sessionId: string,
        amount?: number,
        userId?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/payment/{provider}/session/{sessionId}/refund',
            path: {
                'provider': provider,
                'sessionId': sessionId,
            },
            query: {
                'amount': amount,
                'userId': userId,
            },
        });
    }

    /**
     * @param provider
     * @returns any OK
     * @throws ApiError
     */
    public static getApiPaymentConfig(
        provider: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/payment/{provider}/config',
            path: {
                'provider': provider,
            },
        });
    }

    /**
     * @param provider
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiPaymentConfig(
        provider: string,
        requestBody?: Record<string, string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/payment/{provider}/config',
            path: {
                'provider': provider,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param provider
     * @param transactionId
     * @returns any OK
     * @throws ApiError
     */
    public static getApiPaymentTransaction(
        provider: string,
        transactionId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/payment/{provider}/transaction/{transactionId}',
            path: {
                'provider': provider,
                'transactionId': transactionId,
            },
        });
    }

    /**
     * @param provider
     * @param sessionId
     * @returns any OK
     * @throws ApiError
     */
    public static getApiPaymentSession(
        provider: string,
        sessionId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/payment/{provider}/session/{sessionId}',
            path: {
                'provider': provider,
                'sessionId': sessionId,
            },
        });
    }

    /**
     * @param provider
     * @returns any OK
     * @throws ApiError
     */
    public static getApiPaymentConfigFormFields(
        provider: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/payment/{provider}/config/form-fields',
            path: {
                'provider': provider,
            },
        });
    }

}
