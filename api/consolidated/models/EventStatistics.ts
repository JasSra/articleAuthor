/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DailyEventTrend } from './DailyEventTrend';
import type { DeviceStatistics } from './DeviceStatistics';
import type { ErrorStatistics } from './ErrorStatistics';
import type { EventCount } from './EventCount';
import type { HourlyEventDistribution } from './HourlyEventDistribution';
import type { SessionStatistics } from './SessionStatistics';
import type { UserActivitySummary } from './UserActivitySummary';

export type EventStatistics = {
    periodStart?: string;
    periodEnd?: string;
    userId?: string | null;
    generatedAt?: string;
    hasErrors?: boolean;
    errorMessage?: string | null;
    totalEventCount?: number;
    totalUniqueEvents?: number;
    uniqueUsers?: number;
    uniqueEventNames?: Array<string> | null;
    eventCounts?: Array<EventCount> | null;
    mostCommonEvent?: EventCount;
    leastCommonEvent?: EventCount;
    hourlyDistribution?: Array<HourlyEventDistribution> | null;
    dailyTrends?: Array<DailyEventTrend> | null;
    topActiveUsers?: Array<UserActivitySummary> | null;
    deviceStatistics?: DeviceStatistics;
    sessionStatistics?: SessionStatistics;
    errorStatistics?: ErrorStatistics;
    customMetrics?: Record<string, any> | null;
};

