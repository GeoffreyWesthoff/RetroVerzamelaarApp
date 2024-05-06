import { Module } from '@nestjs/common';
import { ConsoleController } from './console.controller';
import { ConsoleService } from './console.service';
import { Neo4jModule } from '@nhogs/nestjs-neo4j';

@Module({
  imports: [
  ],
  controllers: [ConsoleController],
  providers: [ConsoleService],
})
export class ConsoleModule {}
