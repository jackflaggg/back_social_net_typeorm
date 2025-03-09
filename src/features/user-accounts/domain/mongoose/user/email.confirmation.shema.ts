import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class EmailConfirmation {
    @Prop({ type: String, required: true })
    confirmationCode: string;

    @Prop({ type: Date, required: true })
    expirationDate: Date | null;

    @Prop({ type: Boolean, required: true, default: false })
    isConfirmed: boolean;
}

export const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);
