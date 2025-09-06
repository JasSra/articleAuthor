/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileEntryOperationResult } from '../models/FileEntryOperationResult';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FileService {

    /**
     * @param formData
     * @returns FileEntryOperationResult Created
     * @throws ApiError
     */
    public static postApiFileUpload(
        formData?: {
            File?: Blob;
        },
    ): CancelablePromise<FileEntryOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/file/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad Request`,
            },
        });
    }

    /**
     * @param id
     * @returns binary OK
     * @throws ApiError
     */
    public static getApiFile(
        id: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/file/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
            },
        });
    }

}
