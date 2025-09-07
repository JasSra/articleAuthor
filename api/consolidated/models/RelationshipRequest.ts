/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityInfo } from './EntityInfo';

export type RelationshipRequest = {
    sourceEntity?: string | null;
    sourceModule?: string | null;
    availableEntities?: Array<EntityInfo> | null;
    businessContext?: string | null;
};
