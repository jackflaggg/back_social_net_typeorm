import { StatusLike } from '../../../../libs/contracts/enums/status.like';

export function transformCommentToGet(valueOne: any, valueTwo?: any) {
    return {
        id: String(valueOne._id),
        content: valueOne.content || '',
        commentatorInfo: {
            userId: valueOne.commentatorInfo?.userId || valueTwo?.userId || '',
            userLogin: valueOne.commentatorInfo?.userLogin || valueTwo?.userLogin || '',
        },
        createdAt: valueOne.createdAt || '',
        likesInfo: {
            likesCount: valueOne.likesInfo.likesCount || 0,
            dislikesCount: valueOne.likesInfo.dislikesCount || 0,
            myStatus: valueTwo?.status || StatusLike.enum['None'],
        },
    };
}

export function transformComment(valueOne: any) {
    return {
        id: String(valueOne.id) || '',
        content: valueOne.content || '',
        commentatorInfo: {
            userId: String(valueOne.userId) || '',
            userLogin: valueOne.userLogin || '',
        },
        createdAt: valueOne.createdAt || '',
        likesInfo: {
            likesCount: valueOne.likesCount || 0,
            dislikesCount: valueOne.dislikesCount || 0,
            myStatus: valueOne.myStatus || StatusLike.enum['None'],
        },
    };
}
