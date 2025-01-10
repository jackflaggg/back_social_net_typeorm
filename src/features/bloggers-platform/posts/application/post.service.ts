import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../infrastructure/post.repository';
import { InjectModel } from '@nestjs/mongoose';
import { PostEntity, PostModelType } from '../domain/post.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PostCreateDtoService } from '../dto/service/post.create.dto';
import { PostUpdateDtoService } from '../dto/service/post.update.dto';

export class PostService {
    constructor(
        private readonly blogsRepository: BlogsRepository,
        private readonly postsRepository: PostsRepository,
        @InjectModel(PostEntity.name) private readonly postModel: PostModelType,
    ) {}

    async createPost(dto: PostCreateDtoService) {
        const blog = await this.blogsRepository.findBlogById(dto.blogId);
        if (!blog) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        const post = this.postModel.buildInstance(dto, blog.name);
        await this.postsRepository.save(post);
        return post._id.toString();
    }

    async updatePost(id: string, dto: PostUpdateDtoService) {
        const post = await this.postsRepository.findPostById(id);
        const blog = await this.blogsRepository.findBlogById(dto.blogId);
        if (!blog) {
            throw new HttpException('Not found blog', HttpStatus.NOT_FOUND);
        }
        if (!post) {
            throw new HttpException('Not found post', HttpStatus.NOT_FOUND);
        }
        post.update(dto);
        await this.postsRepository.save(post);
    }

    async deletePost(id: string) {
        const result = await this.postsRepository.findPostById(id);
        if (!result) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        result.makeDeleted();
        await this.postsRepository.save(result);
    }

    async createCommentToPost() {}
}
