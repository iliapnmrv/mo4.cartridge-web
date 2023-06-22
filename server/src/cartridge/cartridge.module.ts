import { Module } from '@nestjs/common';
import { Cartridge } from './entities/cartridge.entity';
import { CartridgeService } from './cartridge.service';
import { CartridgeResolver } from './cartridge.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from 'src/logs/entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cartridge, Log])],
  providers: [CartridgeService, CartridgeResolver],
})
export class CartridgeModule {}
