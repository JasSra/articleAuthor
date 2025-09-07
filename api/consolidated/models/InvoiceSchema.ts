/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CustomerInfo } from './CustomerInfo';
import type { InvoiceLineItem } from './InvoiceLineItem';
import type { VendorInfo } from './VendorInfo';

export type InvoiceSchema = {
    invoiceNumber: string;
    invoiceDate?: string | null;
    dueDate?: string | null;
    vendor?: VendorInfo;
    customer?: CustomerInfo;
    lineItems?: Array<InvoiceLineItem> | null;
    subtotal?: number;
    taxAmount?: number;
    totalAmount?: number;
    currency?: string | null;
    paymentTerms?: string | null;
    purchaseOrderNumber?: string | null;
};
