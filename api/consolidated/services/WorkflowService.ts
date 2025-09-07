/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ComponentInfo } from '../models/ComponentInfo';
import type { Flow } from '../models/Flow';
import type { FlowListOperationResult } from '../models/FlowListOperationResult';
import type { FlowOperationResult } from '../models/FlowOperationResult';
import type { FlowStep } from '../models/FlowStep';
import type { OperationManifestInfo } from '../models/OperationManifestInfo';
import type { StringListOperationResult } from '../models/StringListOperationResult';
import type { ValidateConfigRequest } from '../models/ValidateConfigRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class WorkflowService {

    /**
     * @returns FlowListOperationResult OK
     * @throws ApiError
     */
    public static getAllWorkflows(): CancelablePromise<FlowListOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Workflow/all',
            errors: {
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param id 
     * @returns FlowOperationResult OK
     * @throws ApiError
     */
    public static getFlowById(
id: string,
): CancelablePromise<FlowOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Workflow/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param id 
     * @returns FlowOperationResult OK
     * @throws ApiError
     */
    public static removeWorkflow(
id: string,
): CancelablePromise<FlowOperationResult> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/Workflow/remove/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns FlowOperationResult Created
     * @throws ApiError
     */
    public static createWorkflow(
requestBody?: Flow,
): CancelablePromise<FlowOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Workflow',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param id 
     * @param requestBody 
     * @returns FlowOperationResult OK
     * @throws ApiError
     */
    public static updateWorkflow(
id: number,
requestBody?: Flow,
): CancelablePromise<FlowOperationResult> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/Workflow/update/{id}',
            path: {
                'id': id,
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
     * @returns ComponentInfo OK
     * @throws ApiError
     */
    public static getWorkflowComponents(): CancelablePromise<Array<ComponentInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Workflow/components',
        });
    }

    /**
     * @param componentName 
     * @param requestBody 
     * @returns StringListOperationResult OK
     * @throws ApiError
     */
    public static validateComponentConfig(
componentName: string,
requestBody?: ValidateConfigRequest,
): CancelablePromise<StringListOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Workflow/components/{componentName}/validate-config',
            path: {
                'componentName': componentName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns StringListOperationResult OK
     * @throws ApiError
     */
    public static validateWorkflowStep(
requestBody?: FlowStep,
): CancelablePromise<StringListOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Workflow/validate-step',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns StringListOperationResult OK
     * @throws ApiError
     */
    public static validateWorkflowDefinition(
requestBody?: Flow,
): CancelablePromise<StringListOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Workflow/validate-flow',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param componentName 
     * @param operationId 
     * @returns OperationManifestInfo OK
     * @throws ApiError
     */
    public static getOperationManifest(
componentName: string,
operationId: string,
): CancelablePromise<OperationManifestInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Workflow/components/{componentName}/operations/{operationId}',
            path: {
                'componentName': componentName,
                'operationId': operationId,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @param runId 
     * @param requestBody 
     * @returns any OK
     * @throws ApiError
     */
    public static postApiWorkflowRunsFail(
runId: string,
requestBody?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Workflow/runs/{runId}/fail',
            path: {
                'runId': runId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
