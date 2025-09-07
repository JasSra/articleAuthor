/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NotificationAction } from './NotificationAction';
import type { NotificationLink } from './NotificationLink';

export type NotificationEvent = {
    id?: string | null;
    ts?: number;
    channel?: string | null;
    type?: string | null;
    priority?: string | null;
    sensitivity?: string | null;
    title?: string | null;
    message?: string | null;
    link?: NotificationLink;
    tenantId?: string | null;
    organizationId?: string | null;
    userId?: string | null;
    correlationId?: string | null;
    dedupeKey?: string | null;
    expiresAt?: string | null;
    actions?: Array<NotificationAction> | null;
    data?: Record<string, any> | null;
};
