import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { isNull } from '../../../utils/user/is.null';
import { DeviceCreateDto } from '../../../dto/repository/device.create.dto';

@Entity('security_device_to_user')
export class SecurityDeviceToUser {
    @PrimaryColumn({ name: 'device_id', type: 'varchar' })
    deviceId: string;

    @Column({ name: 'device_name', type: 'varchar', default: 'Google' })
    deviceName: string;

    @Column({ name: 'ip', type: 'varchar', default: '255.255.255.255' })
    ip: string;

    @CreateDateColumn({ name: 'issued_at', type: 'timestamptz' })
    issuedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    deletedAt: Date | null;

    @ManyToOne(() => User, user => user.securityDevices)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;
    @Column({ name: 'user_id' })
    userId: number;

    static buildInstance(dto: DeviceCreateDto, user: User): SecurityDeviceToUser {
        const session = new SecurityDeviceToUser();

        session.deviceId = dto.deviceId;
        session.ip = dto.ip;
        session.deviceName = dto.userAgent;
        session.issuedAt = dto.createdAt;

        session.user = user;

        return session as SecurityDeviceToUser;
    }

    public markDeleted(): void {
        if (!isNull(this.deletedAt)) throw new Error('Данный объект уже был помечен на удаление');

        this.deletedAt = new Date();
    }
    public updateIssuedAt(): void {
        this.issuedAt = new Date();
    }
}
