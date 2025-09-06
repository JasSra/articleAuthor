/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RelationshipIssue } from './RelationshipIssue';

export type RelationshipIntegrityReport = {
    totalDefinitionsChecked?: number;
    definitionsUpdated?: number;
    issuesFixed?: number;
    issuesFound?: Array<RelationshipIssue> | null;
};

