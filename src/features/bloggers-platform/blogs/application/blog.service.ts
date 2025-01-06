import { BlogsRepository } from '../infrastructure/blogs.repository';

export class BlogService {
  constructor(private readonly blogsRepository: BlogsRepository) {}
}
