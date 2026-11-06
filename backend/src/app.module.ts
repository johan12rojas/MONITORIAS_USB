import { Module } from '@nestjs/common';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { PrismaService } from './core/database/prisma.service';

@Module({
  imports: [MonitoringModule],
  providers: [PrismaService],
})
export class AppModule {}
