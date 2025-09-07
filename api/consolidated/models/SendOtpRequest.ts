/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OtpDeliveryMethod } from './OtpDeliveryMethod';

export type SendOtpRequest = {
    email?: string | null;
    phoneNumber?: string | null;
    deliveryMethod: OtpDeliveryMethod;
    applicationContext?: string | null;
    languageCode?: string | null;
    templateVariables?: Record<string, string> | null;
};
