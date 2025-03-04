import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserRegistrationEvent {
    constructor(public readonly user: boolean) {}
}

@EventsHandler(UserRegistrationEvent)
export class UserRegistrationEventHandler implements IEventHandler<UserRegistrationEvent> {
    handle(event: UserRegistrationEvent) {
        console.log(`Юзер успешно зарег-ся, но без подтверждения: ${event.user}`);
        // Здесь вы можете выполнить дополнительные действия, такие как логирование,
        // обновление статистики, отправка уведомлений и т.д.
    }
}