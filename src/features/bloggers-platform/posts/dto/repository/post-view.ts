import { PostDocument } from '../../domain/post.entity';

export class PostViewDto {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    extendedLikesInfo: {
        likesCount: number | string;
        dislikesCount: number | string;
        myStatus: string;
        newestLikes: { addedAt: Date; userId: string; login: string }[];
    };
    constructor(model: any) {
        this.id = String(model.id);
        this.title = model.title;
        this.shortDescription = model.shortDescription;
        this.content = model.content;
        this.blogId = String(model.blogId);
        this.blogName = model.blogName;
        this.createdAt = model.createdAt;
        this.extendedLikesInfo = {
            likesCount: String(model.likesCount),
            dislikesCount: String(model.dislikesCount),
            myStatus: model.myStatus,
            newestLikes: model.newestLikes || [],
        };
    }

    static mapToView(blog: PostDocument): any {
        return new PostViewDto(blog);
    }
}
