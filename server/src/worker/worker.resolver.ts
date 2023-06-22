import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WorkerService } from './worker.service';
import { Worker } from './entities/worker.entity';
import { UpdateWorkerInput } from './dto/update-worker.input';
import { FilterWorkersInput } from './dto/filter-workers.input';

export type IShifts = {
  shift: string;
};
@Resolver(() => Worker)
export class WorkerResolver {
  constructor(private readonly workerService: WorkerService) {}

  @Query(() => [Worker])
  workers(
    @Args('filters', { type: () => FilterWorkersInput, nullable: true })
    filters: FilterWorkersInput,
  ): Promise<Worker[]> {
    return this.workerService.findAll(filters);
  }

  @Query(() => [Worker])
  shifts(): Promise<IShifts[]> {
    return this.workerService.findAllShifts();
  }

  @Mutation(() => Worker)
  updateWorker(
    @Args('updateWorkerInput') updateWorkerInput: UpdateWorkerInput,
  ) {
    return this.workerService.update(updateWorkerInput.id, updateWorkerInput);
  }
}
