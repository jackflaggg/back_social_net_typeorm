import { BlogsRepository } from '../infrastructure/blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { BlogEntity, BlogModelType } from '../domain/blog.entity';
import { BlogCreateDtoService } from '../dto/service/blog.create.dto';
import { BlogUpdateDtoService } from '../dto/service/blog.update.dto';
import { BadRequestException } from '@nestjs/common';
import { PostToBlogCreateDtoService } from '../dto/service/blog.to.post.create.dto';
import { PostsRepository } from '../../posts/infrastructure/post.repository';

export class BlogService {
    constructor(
        private readonly blogsRepository: BlogsRepository,
        private readonly postsRepository: PostsRepository,
        @InjectModel(BlogEntity.name) private blogModel: BlogModelType,
    ) {}

    async createBlog(dto: BlogCreateDtoService) {
        const result = this.blogModel.buildInstance(dto);
        await this.blogsRepository.save(result);
        return result._id.toString();
    }

    async updateBlog(id: string, dto: BlogUpdateDtoService) {
        const result = await this.blogsRepository.findBlogById(id);
        if (!result) {
            throw new BadRequestException('Not Found Blog');
        }
        result.update(dto);
        await this.blogsRepository.save(result);
    }

    async deleteBlog(id: string) {
        const result = await this.blogsRepository.findBlogById(id);
        if (!result) {
            throw new BadRequestException('Not Found Blog');
        }
        result.makeDeleted();
        await this.blogsRepository.save(result);
    }

    async createPostToBlog(blogId: string, dto: PostToBlogCreateDtoService) {
        const blog = await this.blogsRepository.findBlogById(blogId);
        if (!blog) {
            throw new BadRequestException('Not Found Blog');
        }
    }
}
