import { StatusLike } from '../../../../../libs/contracts/enums/status/status.like';

export interface postOutInterface {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string;
        newestLikes: { addedAt: Date; userId: number | string; login: string }[];
    };
}

export interface postIntInterface {
    id: string | number;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    likesCount: string;
    dislikesCount: string;
    myStatus: string;
    newestLikes: { addedAt: Date; userId: string | number; login: string }[] | void[];
}

export class PostViewDto {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string;
        newestLikes: { addedAt: Date; userId: string | number; login: string }[];
    };
    constructor(model: postIntInterface) {
        this.id = String(model.id);
        this.title = model.title;
        this.shortDescription = model.shortDescription;
        this.content = model.content;
        this.blogId = String(model.blogId);
        this.blogName = model.blogName;
        this.createdAt = model.createdAt;
        this.extendedLikesInfo = {
            likesCount: +model.likesCount || 0,
            dislikesCount: +model.dislikesCount || 0,
            myStatus: model.myStatus || StatusLike.enum['None'],
            newestLikes: (model.newestLikes || []).map(like => ({
                addedAt: like.addedAt,
                userId: String(like.userId), // Приведение к числу
                login: like.login,
            })),
        };
    }

    static mapToView(blog: postIntInterface): postOutInterface {
        return new PostViewDto(blog);
    }
}
