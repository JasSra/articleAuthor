/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DepositJob } from '../models/DepositJob';
import type { DepositJobRun } from '../models/DepositJobRun';
import type { QueueStatus } from '../models/QueueStatus';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QueueService {

    /**
     * @param queueName
     * @returns number OK
     * @throws ApiError
     */
    public static getQueueStatus(
        queueName: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/queue/{queueName}/status',
            path: {
                'queueName': queueName,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @param queueName
     * @returns DepositJob OK
     * @throws ApiError
     */
    public static deQueueJob(
        queueName: string,
    ): CancelablePromise<DepositJob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/queue/{queueName}/deQueueJob',
            path: {
                'queueName': queueName,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @param queueName
     * @param requestBody
     * @returns any Created
     * @throws ApiError
     */
    public static queueJob(
        queueName: string,
        requestBody?: DepositJob,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/queue/{queueName}/job',
            path: {
                'queueName': queueName,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param queueName
     * @returns any OK
     * @throws ApiError
     */
    public static emptyQueue(
        queueName: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/queue/{queueName}',
            path: {
                'queueName': queueName,
            },
        });
    }

    /**
     * @returns string OK
     * @throws ApiError
     */
    public static getRegisteredQueues(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/queue/registered',
        });
    }

    /**
     * @param queueName
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static moveToComplete(
        queueName: string,
        requestBody?: DepositJobRun,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/queue/{queueName}/job/complete',
            path: {
                'queueName': queueName,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param queueName
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static moveToFailed(
        queueName: string,
        requestBody?: DepositJobRun,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/queue/{queueName}/job/fail',
            path: {
                'queueName': queueName,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param queueName
     * @param count
     * @returns DepositJobRun OK
     * @throws ApiError
     */
    public static peekLatestJobs(
        queueName: string,
        count: number,
    ): CancelablePromise<Array<DepositJobRun>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/queue/{queueName}/peek/{count}',
            path: {
                'queueName': queueName,
                'count': count,
            },
        });
    }

    /**
     * @returns QueueStatus OK
     * @throws ApiError
     */
    public static getAllQueueStatuses(): CancelablePromise<Array<QueueStatus>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/queue/status',
        });
    }

}
