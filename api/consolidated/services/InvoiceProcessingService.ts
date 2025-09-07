/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvoiceExtractionResult } from '../models/InvoiceExtractionResult';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class InvoiceProcessingService {

    /**
     * @param formData 
     * @returns InvoiceExtractionResult OK
     * @throws ApiError
     */
    public static postApiInvoiceProcess(
formData?: {
file?: Blob;
},
): CancelablePromise<InvoiceExtractionResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/invoice/process',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param etag 
     * @returns InvoiceExtractionResult OK
     * @throws ApiError
     */
    public static getApiInvoiceCached(
etag: string,
): CancelablePromise<InvoiceExtractionResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/invoice/cached/{etag}',
            path: {
                'etag': etag,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiInvoiceHealth(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/invoice/health',
        });
    }

}
