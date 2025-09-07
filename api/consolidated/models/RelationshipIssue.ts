/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RelationshipIssueType } from './RelationshipIssueType';

export type RelationshipIssue = {
    sourceEntity?: string | null;
    relationshipName?: string | null;
    targetEntity?: string | null;
    issueType?: RelationshipIssueType;
    description?: string | null;
    isFixed?: boolean;
    fixDetails?: string | null;
};
