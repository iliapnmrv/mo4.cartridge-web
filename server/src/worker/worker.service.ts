import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Like, Not, IsNull } from 'typeorm';
import { FilterWorkersInput } from './dto/filter-workers.input';
import { UpdateWorkerInput } from './dto/update-worker.input';
import { Worker } from './entities/worker.entity';
import { IShifts } from './worker.resolver';
import * as moment from 'moment';

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(Worker, 'med')
    private workerRepository: Repository<Worker>,
  ) {}

  async findAll(filters: FilterWorkersInput): Promise<Worker[]> {
    const { name, shifts, date } = filters;

    const workers = await this.workerRepository.find({
      where: {
        name: Like(`%${name}%`),
        shift: shifts && shifts.length ? In([shifts]) : Not(IsNull()),
      },
      relations: { harm: true },
      order: { name: 1, isException: 1 },
    });

    console.log(workers.length, date, typeof date, date == null);

    return date == null
      ? workers
      : workers.filter(
          (worker) =>
            moment(worker.lastMed)
              .add(moment(moment()).diff(date, 'days'), 'days')
              .diff(moment(), 'days') <= -335,
        );
  }

  async findAllShifts(): Promise<IShifts[]> {
    return await this.workerRepository
      .createQueryBuilder()
      .select('shift')
      .distinct(true)
      .getRawMany();
  }

  async update(
    id: number,
    updateWorkerInput: UpdateWorkerInput,
  ): Promise<Worker> {
    const worker = await this.workerRepository.update(id, {
      ...updateWorkerInput,
    });
    return await this.workerRepository.findOne({
      where: { id },
      relations: { harm: true },
    });
  }
}
