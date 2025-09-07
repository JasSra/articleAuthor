/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OtpDeliveryMethod } from './OtpDeliveryMethod';

export type ValidateOtpRequest = {
    email?: string | null;
    phoneNumber?: string | null;
    deliveryMethod: OtpDeliveryMethod;
    code: string;
    sessionId?: string | null;
    applicationContext?: string | null;
    attestPayload?: Record<string, any> | null;
    attestFields?: Array<string> | null;
};
