import { FlattenMaps, Types } from 'mongoose';
import { StatusLike } from 'libs/contracts/enums/status.like';

export interface StatusResult {
    _id: Types.ObjectId;
    createdAt: Date | null | undefined;
    userId: string | null | undefined;
    userLogin: string | null | undefined;
    parentId: string | null | undefined;
    status: string | null | undefined;
}

export interface outputStatusInterface {
    createdAt: Date | string;
    userId: string;
    login: string;
    status: string;
}

export interface outputStatusUsersInterface {
    addedAt: Date | string;
    userId: string;
    login: string;
}

export const transformStatus = (value: FlattenMaps<StatusResult>) => {
    return {
        status: value.status || StatusLike.enum['None'],
    };
};

export const statusesUsersMapper = (value: FlattenMaps<StatusResult>): outputStatusUsersInterface => {
    return {
        addedAt: value.createdAt || '',
        userId: value.userId || '',
        login: value.userLogin || '',
    };
};
