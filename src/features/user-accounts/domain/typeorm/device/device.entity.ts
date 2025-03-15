import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../../../../../core/domain/base.entity';

@Entity('security_device')
export class SecurityDevice extends BaseEntity {
    @PrimaryColumn({ name: 'device_id' })
    deviceId: string;

    @Column({ name: 'device_name' })
    deviceName: string;

    @Column()
    ip: string;

    @Column({ name: 'user_id' })
    userId: number;

    @CreateDateColumn({ name: 'issued_at', type: 'timestamptz' }) // default не нужен в TypeORM
    issuedAt: Date;

    @ManyToOne(() => User, user => user.securityDevices)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
