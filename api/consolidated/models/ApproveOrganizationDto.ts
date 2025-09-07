/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BankDetailsDto } from './BankDetailsDto';

export type ApproveOrganizationDto = {
    organizationId?: string | null;
    approvalReason?: string | null;
    remittanceScheduleId?: string | null;
    bankDetails?: BankDetailsDto;
    notes?: string | null;
};
