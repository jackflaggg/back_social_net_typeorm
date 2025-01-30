import { Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'uuid';
import { BadRequestDomainException } from '../exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class ValidateUUIDPipe implements PipeTransform<string> {
    transform(value: string): string {
        if (!validate(value)) {
            throw BadRequestDomainException.create('неверный формат uuid', 'id');
        }
        return value;
    }
}
