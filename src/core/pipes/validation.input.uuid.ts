import { Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'uuid';
import { BadRequestDomainException, NotFoundDomainException } from '../exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class ValidateUUIDPipe implements PipeTransform<string> {
    transform(value: string): string {
        console.log(validate(value));
        if (!validate(value)) {
            throw NotFoundDomainException.create('неверный формат uuid', 'id');
        }
        return value;
    }
}
