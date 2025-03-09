import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserLoggedInEvent {
    constructor(public readonly userId: string) {}
}

@EventsHandler(UserLoggedInEvent)
export class LogUserInformationWhenUserLoggedInEventHandler implements IEventHandler<UserLoggedInEvent> {
    handle(event: UserLoggedInEvent) {
        console.log(`Юзер залогинился! ${event.userId}`);
    }
}
