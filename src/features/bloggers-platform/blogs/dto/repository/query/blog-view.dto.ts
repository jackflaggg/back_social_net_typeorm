export class BlogViewDto {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    isMembership: boolean;
    createdAt: Date;

    constructor(model: any) {
        this.id = String(model.id);
        this.name = model.name;
        this.description = model.description;
        this.websiteUrl = model.websiteUrl;
        this.createdAt = model.createdAt;
        this.isMembership = model.isMembership;
    }

    static mapToView(blog: any): BlogViewDto {
        return new BlogViewDto(blog);
    }
}
