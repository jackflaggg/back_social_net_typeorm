import { StatusLike, StatusLikeType } from '../../../../../../libs/contracts/enums/status/status.like';

export interface commentOutInterface {
    id: number;
    content: string;
    userId: number;
    createdAt: Date;
    userLogin: string;
    myStatus: string;
    likesCount: string;
    dislikesCount: string;
}

export interface commentIntInterface {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: Date | string;
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: StatusLikeType | string;
    };
}

export function transformComment(valueOne: commentOutInterface): commentIntInterface {
    return {
        id: String(valueOne.id) || '',
        content: valueOne.content || '',
        commentatorInfo: {
            userId: String(valueOne.userId) || '',
            userLogin: valueOne.userLogin || '',
        },
        createdAt: valueOne.createdAt || '',
        likesInfo: {
            likesCount: +valueOne.likesCount,
            dislikesCount: +valueOne.dislikesCount,
            myStatus: valueOne.myStatus || StatusLike.enum['None'],
        },
    };
}
