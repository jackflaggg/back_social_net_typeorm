import { BlogDocument } from '../../domain/blog.entity';

export class BlogViewDto {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    isMembership: boolean;
    createdAt: Date;

    constructor(model: BlogDocument) {
        this.id = model._id.toString();
        this.name = model.name;
        this.description = model.description;
        this.websiteUrl = model.websiteUrl;
        this.isMembership = model.isMembership;
        this.createdAt = model.createdAt;
    }

    static mapToView(blog: BlogDocument): BlogViewDto {
        return new BlogViewDto(blog);
    }
}
