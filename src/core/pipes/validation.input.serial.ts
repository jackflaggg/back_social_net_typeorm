import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { BadRequestDomainException } from '../exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class ValidateSerialPipe implements PipeTransform<string | number> {
    transform(value: any, metadata: ArgumentMetadata) {
        const type = metadata.type;
        // Обработка различных типов данных
        if (typeof value === 'string') {
            const parsedValue = parseInt(value, 10);
            if (isNaN(parsedValue)) {
                throw BadRequestDomainException.create('Неверный формат SERIAL', 'id');
            }
            return parsedValue;
        } else if (typeof value === 'number') {
            // Проверка на корректное числовое значение
            if (!Number.isInteger(value)) {
                throw BadRequestDomainException.create('Неверный формат SERIAL', 'id');
            }
            return value;
        } else {
            BadRequestDomainException.create(`Неподдерживаемый тип данных: ${type}`, 'id');
        }
    }
}
