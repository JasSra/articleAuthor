/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanOperationResult } from '../models/BooleanOperationResult';
import type { ExternalUserRegistrationRequest } from '../models/ExternalUserRegistrationRequest';
import type { GroupUpdateRequest } from '../models/GroupUpdateRequest';
import type { ManagedGroup } from '../models/ManagedGroup';
import type { ManagedIdentity } from '../models/ManagedIdentity';
import type { ManagedIdentityListOperationResult } from '../models/ManagedIdentityListOperationResult';
import type { ManagedIdentityOperationResult } from '../models/ManagedIdentityOperationResult';
import type { MessageOperationResult } from '../models/MessageOperationResult';
import type { MessageRequest } from '../models/MessageRequest';
import type { QueryParam } from '../models/QueryParam';
import type { SendMessageRequest } from '../models/SendMessageRequest';
import type { SingleUserMessageRequest } from '../models/SingleUserMessageRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ManageUsersService {

    /**
     * @param requestBody 
     * @returns ManagedIdentityOperationResult OK
     * @throws ApiError
     */
    public static registerExternalUser(
requestBody?: ExternalUserRegistrationRequest,
): CancelablePromise<ManagedIdentityOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/manage/user/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns ManagedIdentityOperationResult OK
     * @throws ApiError
     */
    public static registerLocalUser(
requestBody?: ManagedIdentity,
): CancelablePromise<ManagedIdentityOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/manage/user/create',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param userId 
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static enableUser(
userId: string,
): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/manage/user/enable/{userId}',
            path: {
                'userId': userId,
            },
        });
    }

    /**
     * @param userId 
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static disableUser(
userId: string,
): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/manage/user/disable/{userId}',
            path: {
                'userId': userId,
            },
        });
    }

    /**
     * @param userId 
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static lockUser(
userId: string,
): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/manage/user/lock/{userId}',
            path: {
                'userId': userId,
            },
        });
    }

    /**
     * @param userId 
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static unlockUser(
userId: string,
): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/manage/user/unlock/{userId}',
            path: {
                'userId': userId,
            },
        });
    }

    /**
     * @param userId 
     * @returns ManagedIdentityOperationResult OK
     * @throws ApiError
     */
    public static getUserById(
userId: string,
): CancelablePromise<ManagedIdentityOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manage/user/{userId}',
            path: {
                'userId': userId,
            },
        });
    }

    /**
     * @param page 
     * @param size 
     * @returns ManagedIdentityListOperationResult OK
     * @throws ApiError
     */
    public static getAllUsers(
page: number = 1,
size: number = 10,
): CancelablePromise<ManagedIdentityListOperationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manage/user/all',
            query: {
                'page': page,
                'size': size,
            },
        });
    }

    /**
     * @param page 
     * @param size 
     * @param requestBody 
     * @returns ManagedIdentity OK
     * @throws ApiError
     */
    public static searchUsers(
page: number = 1,
size: number = 10,
requestBody?: Array<QueryParam>,
): CancelablePromise<Array<ManagedIdentity>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/manage/user/search',
            query: {
                'page': page,
                'size': size,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns number OK
     * @throws ApiError
     */
    public static countUsers(
requestBody?: Array<QueryParam>,
): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/manage/user/count',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static addUserToGroup(
requestBody?: GroupUpdateRequest,
): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/manage/user/group/add',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanOperationResult OK
     * @throws ApiError
     */
    public static removeUserFromGroup(
requestBody?: GroupUpdateRequest,
): CancelablePromise<BooleanOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/manage/user/group/remove',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param userId 
     * @returns ManagedGroup OK
     * @throws ApiError
     */
    public static getUserGroups(
userId: string,
): CancelablePromise<Array<ManagedGroup>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manage/user/user-groups/{userId}',
            path: {
                'userId': userId,
            },
        });
    }

    /**
     * @param groupId 
     * @returns string OK
     * @throws ApiError
     */
    public static getUserByGroupId(
groupId: string,
): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manage/user/group-users/{groupId}',
            path: {
                'groupId': groupId,
            },
        });
    }

    /**
     * @param groupQueryName 
     * @param admin 
     * @returns string OK
     * @throws ApiError
     */
    public static getUserByGroupName(
groupQueryName?: string,
admin?: 'None' | 'Read' | 'Query' | 'Create' | 'Write' | 'Delete' | 'Execute' | 'Share' | 'Manage' | 'Admin',
): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manage/user/group-users-by-name',
            query: {
                'groupQueryName': groupQueryName,
                'admin': admin,
            },
        });
    }

    /**
     * @param groupId 
     * @returns string OK
     * @throws ApiError
     */
    public static getGroupPermissions(
groupId: string,
): CancelablePromise<Record<string, 'None' | 'Read' | 'Query' | 'Create' | 'Write' | 'Delete' | 'Execute' | 'Share' | 'Manage' | 'Admin'>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manage/user/group-permissions/{groupId}',
            path: {
                'groupId': groupId,
            },
        });
    }

    /**
     * @param groupName 
     * @returns ManagedGroup OK
     * @throws ApiError
     */
    public static getGroupByName(
groupName: string,
): CancelablePromise<ManagedGroup> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manage/user/group-by-name/{groupName}',
            path: {
                'groupName': groupName,
            },
        });
    }

    /**
     * @param groupId 
     * @returns ManagedGroup OK
     * @throws ApiError
     */
    public static getGroupById(
groupId: string,
): CancelablePromise<ManagedGroup> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manage/user/group-by-id/{groupId}',
            path: {
                'groupId': groupId,
            },
        });
    }

    /**
     * @param userId 
     * @param groupId 
     * @returns boolean OK
     * @throws ApiError
     */
    public static isUserInGroup(
userId?: string,
groupId?: string,
): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manage/user/is-user-in-group',
            query: {
                'userId': userId,
                'groupId': groupId,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns MessageOperationResult OK
     * @throws ApiError
     */
    public static sendMessageToAllAdmins(
requestBody?: MessageRequest,
): CancelablePromise<Array<MessageOperationResult>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/manage/user/send-to-admins',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns MessageOperationResult OK
     * @throws ApiError
     */
    public static sendMessageToUser(
requestBody?: SingleUserMessageRequest,
): CancelablePromise<MessageOperationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/manage/user/send-to-user',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns any OK
     * @throws ApiError
     */
    public static sendMessageToUserDirect(
requestBody?: SendMessageRequest,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/manage/user/send-message',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param userId 
     * @returns boolean OK
     * @throws ApiError
     */
    public static doesUserExists(
userId: string,
): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manage/user/user-exists/{userId}',
            path: {
                'userId': userId,
            },
        });
    }

    /**
     * @param email 
     * @returns boolean OK
     * @throws ApiError
     */
    public static isEmailInUse(
email: string,
): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manage/user/email-in-use/{email}',
            path: {
                'email': email,
            },
        });
    }

    /**
     * @param issuer 
     * @param issuerAssignedId 
     * @returns boolean OK
     * @throws ApiError
     */
    public static isIdentityInUse(
issuer?: string,
issuerAssignedId?: string,
): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/manage/user/identity-in-use',
            query: {
                'issuer': issuer,
                'issuerAssignedId': issuerAssignedId,
            },
        });
    }

}
