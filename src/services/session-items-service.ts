import type { SessionItemsRepository } from '@/database/repositories/session-items-repository'
import type { CreateSessionItemsDto } from '@/dtos/session-items/create-session-items-dto'

export class SessionItemsService {
  constructor(
    private readonly sessionItemsRepository: SessionItemsRepository
  ) {}

  public async create(
    sessionId: string,
    sessionItemsDto: CreateSessionItemsDto
  ): Promise<void> {
    await this.sessionItemsRepository.save({
      sessionId,
      correctAnswer: sessionItemsDto.correctAnswer,
      difficulty: sessionItemsDto.difficulty,
      discrimination: sessionItemsDto.discrimination,
      guessing: sessionItemsDto.guessing,
      information: sessionItemsDto.information,
      isCorrect: sessionItemsDto.isCorrect,
      itemIndex: sessionItemsDto.itemIndex,
      playerAnswer: sessionItemsDto.playerAnswer,
      probability: sessionItemsDto.probability,
      questionNumber: sessionItemsDto.questionNumber,
      stimulusName: sessionItemsDto.stimulusName,
      thetaAfter: sessionItemsDto.thetaAfter,
      thetaBefore: sessionItemsDto.thetaBefore,
      thetaError: sessionItemsDto.thetaError,
    })
  }
}
