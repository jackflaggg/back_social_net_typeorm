import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserLoggedInEvent {
    constructor(public readonly userId: string) {}
}

@EventsHandler(UserLoggedInEvent)
export class UserLoggedInEventHandler implements IEventHandler<UserLoggedInEvent> {
    handle(event: UserLoggedInEvent) {
        console.log(`Юзер залогинился! ${event.userId}`);
        // Здесь вы можете выполнить дополнительные действия, такие как логирование,
        // обновление статистики, отправка уведомлений и т.д.
    }
}
