import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class NewestLikesEntity {
    @Prop({ type: Date, required: true })
    addedAt: Date;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: String, required: true })
    login: string;
}

export const NewestLikesSchema = SchemaFactory.createForClass(NewestLikesEntity);
