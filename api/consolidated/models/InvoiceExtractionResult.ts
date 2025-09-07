/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { InvoiceSchema } from './InvoiceSchema';

export type InvoiceExtractionResult = {
    isValid?: boolean;
    confidenceScore?: number;
    invoiceData?: InvoiceSchema;
    errorMessage?: string | null;
    eTag?: string | null;
    processedAt?: string;
};
