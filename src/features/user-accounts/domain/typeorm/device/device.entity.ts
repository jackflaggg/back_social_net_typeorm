import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('security_device_to_user')
export class SecurityDeviceToUser {
    @PrimaryColumn({ name: 'device_id' })
    deviceId: string;

    @Column({ name: 'device_name' })
    deviceName: string;

    @Column()
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
}
