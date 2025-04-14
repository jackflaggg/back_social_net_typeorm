@Injectable()
export class AnswerQueryRepository {
    constructor(@InjectRepository(Answer) private answerRepositoryTypeOrm: Repository<AnswerViewDto>) {}

    async findAnswerById(answerId: string): Promise<AnswerViewDto> {
        const answer = await this.answerRepositoryTypeOrm
            .createQueryBuilder('answer')
            .where('answer.id = :id', { id: answerId })
            .getRawOne();

        if (!answer) {
            throw NotFoundDomainException.create('Answer not found');
        }
        return AnswerViewDto.mapToView(answer);
    }
}
