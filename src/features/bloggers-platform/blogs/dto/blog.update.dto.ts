import { IsString, IsUrl, Length } from 'class-validator';
import {
  descriptionConstraints,
  nameConstraints,
  websiteUrlConstraints,
} from '../domain/blog.entity';

export class BlogUpdateDto {
  @Length(nameConstraints.minLength, nameConstraints.maxLength)
  name: string;

  @IsString()
  @Length(descriptionConstraints.minLength, descriptionConstraints.maxLength)
  description: string;

  @IsString()
  @Length(websiteUrlConstraints.minLength, websiteUrlConstraints.maxLength)
  @IsUrl()
  websiteUrl: string;
}
