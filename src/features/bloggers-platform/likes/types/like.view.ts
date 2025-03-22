import { StatusLikeType } from '../../../../libs/contracts/enums/status/status.like';

export interface likeViewModel {
    userId: string;
    userLogin: string;
    parentId: string;
    status: StatusLikeType;
}
