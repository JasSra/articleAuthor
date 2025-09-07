/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EndpointAuditEntry = {
    route?: string | null;
    method?: string | null;
    controller?: string | null;
    action?: string | null;
    hasAuthorize?: boolean;
    hasGroupPolicyRole?: boolean;
    hasAllowAnonymous?: boolean;
    hasPublicAttribute?: boolean;
    roles?: string | null;
    policy?: string | null;
};
