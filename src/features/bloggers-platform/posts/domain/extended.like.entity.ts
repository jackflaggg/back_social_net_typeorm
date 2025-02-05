import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NewestLikesEntity, NewestLikesSchema } from './last.three.likes.entity';
import { StatusLike } from '../../../../libs/contracts/enums/status.like';

@Schema({ _id: false })
export class ExtendedLikesEntity {
    @Prop({ type: Number, required: true })
    likesCount: number;

    @Prop({ type: Number, required: true })
    dislikesCount: number;

    @Prop({ type: String, required: true, default: StatusLike.enum['None'] })
    myStatus: string;

    @Prop({ type: [NewestLikesSchema], required: true })
    newestLikes: NewestLikesEntity[];
}

export const ExtendedLikesSchema = SchemaFactory.createForClass(ExtendedLikesEntity);
