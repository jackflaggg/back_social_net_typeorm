import { PipeTransform, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { BadRequestDomainException } from '../exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform<string> {
    transform(value: string): string {
        if (!Types.ObjectId.isValid(value)) {
            throw BadRequestDomainException.create('неверный формат objectId', 'id');
        }
        return value;
    }
}
