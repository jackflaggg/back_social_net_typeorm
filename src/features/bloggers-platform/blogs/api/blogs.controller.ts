import { Controller, Get, Param } from '@nestjs/common';
import { BlogService } from '../application/blog.service';

@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogService: BlogService) {}

    @Get()
    async getAllBlogs() {}

    @Get(':blogId')
    async getBlog(@Param('blogId') blogId: string) {}
}
