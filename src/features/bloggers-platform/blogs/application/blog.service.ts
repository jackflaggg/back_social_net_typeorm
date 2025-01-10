import { BlogsRepository } from '../infrastructure/blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { BlogEntity, BlogModelType } from '../domain/blog.entity';
import { BlogCreateDtoService } from '../dto/service/blog.create.dto';
import { BlogUpdateDtoService } from '../dto/service/blog.update.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PostToBlogCreateDtoService } from '../dto/service/blog.to.post.create.dto';
import { PostsRepository } from '../../posts/infrastructure/post.repository';
import { PostEntity, PostModelType } from '../../posts/domain/post.entity';

export class BlogService {
    constructor(
        private readonly blogsRepository: BlogsRepository,
        private readonly postsRepository: PostsRepository,
        @InjectModel(BlogEntity.name) private readonly blogModel: BlogModelType,
        @InjectModel(PostEntity.name) private readonly postModel: PostModelType,
    ) {}

    async createBlog(dto: BlogCreateDtoService) {
        const result = this.blogModel.buildInstance(dto);
        await this.blogsRepository.save(result);
        return result._id.toString();
    }

    async updateBlog(id: string, dto: BlogUpdateDtoService) {
        const result = await this.blogsRepository.findBlogById(id);
        if (!result) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        result.update(dto);
        await this.blogsRepository.save(result);
    }

    async deleteBlog(id: string) {
        const result = await this.blogsRepository.findBlogById(id);
        if (!result) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        result.makeDeleted();
        await this.blogsRepository.save(result);
    }

    async createPostToBlog(blogId: string, dto: PostToBlogCreateDtoService) {
        const blog = await this.blogsRepository.findBlogById(blogId);
        if (!blog) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        const post = this.postModel.buildInstance(dto, blog.name);
        await this.postsRepository.save(post);
        return post._id.toString();
    }
}
