import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Harm } from './entities/harm.entity';

@Injectable()
export class HarmService {
  constructor(
    @InjectRepository(Harm, 'med')
    private harmRepository: Repository<Harm>,
  ) {}

  async findAllHarms(): Promise<Harm[]> {
    const harms = await this.harmRepository
      .createQueryBuilder()
      .select(['harmNum', 'MIN(harm) AS harm', 'MIN(id) AS id'])
      .groupBy('harmNum')
      .getRawMany();

    return harms;
  }
}
