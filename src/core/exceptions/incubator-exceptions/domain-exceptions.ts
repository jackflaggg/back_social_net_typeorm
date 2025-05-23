import { DomainExceptionCode } from './domain-exception-codes';

export class ErrorExtension {
    constructor(
        public message: string,
        public field: string | null = null,
    ) {}
}

export class DomainException extends Error {
    constructor(
        public message: string,
        public code: DomainExceptionCode,
        public extensions: ErrorExtension[],
    ) {
        super(message);
    }
}

//используем typescript mixin для создания классов с одинаковым статическим методом create
//https://www.typescriptlang.org/docs/handbook/mixins.html
function ConcreteDomainExceptionFactory(commonMessage: string, code: DomainExceptionCode) {
    return class extends DomainException {
        constructor(extensions: ErrorExtension[]) {
            super(commonMessage, code, extensions);
        }

        static create(message?: string, field?: string) {
            return new this(message ? [new ErrorExtension(message, field)] : []);
        }
    };
}

export class newConcreteDomainError extends DomainException {
    constructor(
        public message: string,
        public code: DomainExceptionCode,
        public extensions: ErrorExtension[],
    ) {
        super(message, code, extensions);
    }
}

export const NotFoundDomainException = ConcreteDomainExceptionFactory('Not Found', DomainExceptionCode.NotFound);
export const BadRequestDomainException = ConcreteDomainExceptionFactory('Bed Request', DomainExceptionCode.BadRequest);
export const ForbiddenDomainException = ConcreteDomainExceptionFactory('Forbidden', DomainExceptionCode.Forbidden);
export const UnauthorizedDomainException = ConcreteDomainExceptionFactory('Unauthorized', DomainExceptionCode.Unauthorized);
