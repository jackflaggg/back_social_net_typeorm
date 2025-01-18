import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class BodyValidationPipe implements PipeTransform {
    constructor(private readonly schema: ZodSchema) {}
    transform(value: any) {
        const parsed = this.schema.safeParse(value);
        if (!parsed.success) {
            throw new BadRequestException(`Validation error: ${parsed.error}`);
        }
        return parsed.data;
    }
}
