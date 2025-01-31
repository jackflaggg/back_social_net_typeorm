import { FlattenMaps, Types } from 'mongoose';
import { outputStatusInterface, outputStatusUsersInterface } from '../like/features/mapper.status';
import { StatusLike } from '@libs/contracts/enums/status.like';

export interface postOutputInterface {
    _id: Types.ObjectId;
    likesCount?: number | null | undefined;
    dislikesCount?: number | null | undefined;
    title?: string | null | undefined;
    shortDescription?: string | null | undefined;
    content?: string | null | undefined;
    blogId?: string | null | undefined;
    blogName?: string | null | undefined;
    createdAt?: Date | null | undefined;
}

export const transformPostStatusUsers = (
    valueOne: FlattenMaps<postOutputInterface>,
    valueTwo: FlattenMaps<outputStatusInterface | null>,
    valueThree: outputStatusUsersInterface[],
) => {
    return {
        id: valueOne._id.toString(),
        title: valueOne.title || '',
        shortDescription: valueOne.shortDescription || '',
        content: valueOne.content || '',
        blogId: valueOne.blogId || '',
        blogName: valueOne.blogName || '',
        createdAt: valueOne.createdAt ? valueOne.createdAt.toISOString() : '',
        extendedLikesInfo: {
            likesCount: valueOne.likesCount !== undefined && valueOne.likesCount !== null ? valueOne.likesCount : 0,
            dislikesCount: valueOne.dislikesCount !== undefined && valueOne.dislikesCount !== null ? valueOne.dislikesCount : 0,
            myStatus: valueTwo ? valueTwo.status : StatusLike.enum['None'],
            newestLikes: valueThree
                ? valueThree.map(item => ({
                      addedAt: item.addedAt || '',
                      userId: item.userId || '',
                      login: item.login || '',
                  }))
                : [],
        },
    };
};
