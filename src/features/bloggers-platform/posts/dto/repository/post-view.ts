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
        likesCount: 0;
        dislikesCount: 0;
        myStatus: string;
        newestLikes: [
            {
                addedAt: Date;
                userId: string;
                login: string;
            },
        ];
    };
    constructor(model: PostDocument) {
        this.id = model._id.toString();
        this.title = model.title;
        this.shortDescription = model.shortDescription;
        this.content = model.content;
        this.blogId = model.blogId;
        this.blogName = model.blogName;
        this.createdAt = model.createdAt;
        this.extendedLikesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [
                {
                    addedAt: new Date(),
                    userId: '1',
                    login: '1',
                },
            ],
        };
    }

    static mapToView(blog: PostDocument): PostViewDto {
        return new PostViewDto(blog);
    }
}
