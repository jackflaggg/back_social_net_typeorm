import { PipeTransform } from '@nestjs/common';
import { isValidObjectId, Types } from 'mongoose';
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';
import { BadRequestDomainException } from '../exceptions/domain-exceptions';

export class ObjectIdValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.metatype === Types.ObjectId) {
            if (!isValidObjectId(value)) {
                throw BadRequestDomainException.create();
            }
            return new Types.ObjectId(value);
        }
        return value;
    }
}
