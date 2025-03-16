import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { isNull } from '../../../../../core/utils/user/is.null';

@Entity('security_device_to_user')
export class SecurityDeviceToUser {
    @PrimaryColumn({ name: 'device_id', type: 'string' })
    deviceId: string;

    @Column({ name: 'device_name', type: 'varchar', default: 'Google' })
    deviceName: string;

    @Column({ name: 'device_name', type: 'varchar', default: '255.255.255.255' })
    ip: string;

    @Column({ name: 'user_id' })
    userId: number;

    @CreateDateColumn({ name: 'issued_at', type: 'timestamptz' })
    issuedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    deletedAt: Date | null;

    @ManyToOne(() => User, user => user.securityDevices)
    @JoinColumn({ name: 'user_id' })
    user: User;

    static buildInstance(dto: any) {
        const session = new SecurityDeviceToUser();

        session.deviceId = dto.deviceId;
        session.ip = dto.ip;
        session.deviceName = dto.userAgent;
        session.userId = dto.userId;
        session.issuedAt = dto.createdAt;

        return session as SecurityDeviceToUser;
    }

    private markDeleted() {
        // метод обертка!
        if (!isNull(this.deletedAt)) throw new Error('Данный объект уже был помечен на удаление');

        this.deletedAt = new Date();
    }
}
