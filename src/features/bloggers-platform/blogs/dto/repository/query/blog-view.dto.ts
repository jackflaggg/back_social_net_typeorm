export interface BlogIntInterface {
    id: string | number;
    name: string;
    description: string;
    websiteUrl: string;
    isMembership: boolean;
    createdAt: Date;
}

export interface BlogOutInterface {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date | string;
    isMembership: boolean;
}

export class BlogViewDto {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    isMembership: boolean;
    createdAt: Date;

    constructor(model: BlogIntInterface) {
        this.id = String(model.id);
        this.name = model.name;
        this.description = model.description;
        this.websiteUrl = model.websiteUrl;
        this.createdAt = model.createdAt;
        this.isMembership = model.isMembership;
    }

    static mapToView(blog: BlogIntInterface): BlogOutInterface {
        return new BlogViewDto(blog);
    }
}
