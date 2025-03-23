import { Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'uuid';
import { NotFoundDomainException } from '../exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class ValidateUUIDPipe implements PipeTransform<string> {
    transform(value: string): string {
        if (!validate(value)) {
            throw NotFoundDomainException.create('неверный формат uuid', 'id');
        }
        return value;
    }
}
