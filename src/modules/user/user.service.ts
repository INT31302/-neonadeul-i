import { Injectable, Logger } from '@nestjs/common';
import { User } from '@src/modules/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { CategoryType } from '@src/modules/motivation/movitation.type';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(this.constructor.name);

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async updateJerry(id: string): Promise<void> {
    await this.userRepository.update({ id }, { jerry: true });
    this.logger.log('jerry 리셋 완료');
  }
  /**
   * 사용자 정보를 생성합니다.
   * @param user
   */
  async save(user: DeepPartial<User>): Promise<User> {
    const userEntity = await this.userRepository.findOneBy({ id: user.id });
    if (userEntity) {
      return userEntity;
    }
    return await this.userRepository.save({
      id: user.id,
      name: user.name,
      channelId: user.channelId,
    });
  }

  /**
   * 현대인 어록 구독 여부를 업데이트 합니다.
   * @param user
   * @param isModernText
   */
  updateModernSubscribe(user: DeepPartial<User>, isModernText: boolean): Promise<UpdateResult> {
    return this.userRepository.update(user.id, { isModernText });
  }

  updateSubscribe(user: DeepPartial<User>, isSubscribe: boolean): Promise<UpdateResult> {
    return this.userRepository.update(user.id, { isSubscribe });
  }

  async updatePreference(userId: string, categoryType: CategoryType, value: number): Promise<User> {
    const user = await this.findOne(userId);
    switch (categoryType) {
      case CategoryType.동기부여:
        user.motivation = value;
        break;
      case CategoryType.응원:
        user.cheering = value;
        break;
      case CategoryType.위로:
        user.consolation = value;
        break;
    }
    return this.userRepository.save(user);
  }

  /**
   * 모든 사용자 목록을 조회합니다.
   */
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   *
   * @param pushTime
   */
  findSubscriberOnPushTime(pushTime: string): Promise<User[]> {
    return this.userRepository.find({
      where: { isSubscribe: true, pushTime },
    });
  }
  /**
   * 미구독 상태의 유저 목록 조회
   */
  findUnSubscriber(): Promise<User[]> {
    return this.userRepository.find({
      where: { isSubscribe: false },
    });
  }

  /**
   * 사용자 정보를 조회합니다.
   * @param id
   */
  findOne(id: string): Promise<User> {
    return this.userRepository.findOneByOrFail({ id });
  }

  /**
   * 사용자 정보를 제거합니다.
   */
  async remove(user: User): Promise<User> {
    return this.userRepository.remove(user);
  }

  /**
   * 사용자 정보 목록을 제거합니다.
   */
  async removeList(userList: User[]): Promise<User[]> {
    return this.userRepository.remove(userList);
  }

  /**
   *
   * @param userId
   * @param selectedTime
   */
  async setTime(userId: string, selectedTime: string): Promise<User> {
    const user = await this.findOne(userId);
    return await this.userRepository.save({ ...user, pushTime: selectedTime });
  }
}
