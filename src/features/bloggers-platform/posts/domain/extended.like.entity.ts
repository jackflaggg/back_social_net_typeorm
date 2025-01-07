import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NewestLikesEntity, NewestLikesSchema } from './last.three.likes.entity';

@Schema({ _id: false })
export class ExtendedLikesEntity {
    @Prop({ type: Number, required: true })
    likesCount: number;

    @Prop({ type: Number, required: true })
    dislikesCount: number;

    @Prop({ type: [NewestLikesSchema], required: true })
    newestLikes: NewestLikesEntity[];
}

export const ExtendedLikesSchema = SchemaFactory.createForClass(ExtendedLikesEntity);
