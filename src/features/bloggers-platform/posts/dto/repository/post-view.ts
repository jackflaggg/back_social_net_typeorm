import { PostDocument } from '../../domain/post.entity';
import { StatusLike } from '../../../../../libs/contracts/enums/status.like';

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
        newestLikes: { addedAt: Date; userId: string; login: string }[];
    };
    constructor(model: PostDocument) {
        this.id = String(model.id);
        this.title = model.title;
        this.shortDescription = model.shortDescription;
        this.content = model.content;
        this.blogId = String(model.blogId);
        this.blogName = model.blogName;
        this.createdAt = model.createdAt;
        this.extendedLikesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: StatusLike.enum['None'],
            newestLikes: (model.extendedLikesInfo?.newestLikes
                ?.map(like => ({
                    addedAt: like?.addedAt,
                    userId: like?.userId,
                    login: like?.login,
                }))
                .filter(Boolean) || []) as { addedAt: Date; userId: string; login: string }[],
        };
    }

    static mapToView(blog: PostDocument): PostViewDto {
        return new PostViewDto(blog);
    }
}
