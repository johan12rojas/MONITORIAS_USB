import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Query, 
  UseGuards, 
  Req, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { RegisterMonitoringSessionUseCase } from '../../application/use-cases/register-monitoring-session.use-case';
import { GetMonitorHistoryUseCase } from '../../application/use-cases/get-monitor-history.use-case';
import { GetMonitorProgressUseCase } from '../../application/use-cases/get-monitor-progress.use-case';
import { CreateSessionDto } from '../../application/dtos/create-session.dto';
import { FilterHistoryDto } from '../../application/dtos/filter-history.dto';
import { SiaExcelParserAdapter } from '../adapters/sia-excel-parser.adapter';

@ApiTags('Monitorías (Monitores)')
@Controller('api/v1')
export class MonitoringController {
  constructor(
    private readonly registerUseCase: RegisterMonitoringSessionUseCase,
    private readonly historyUseCase: GetMonitorHistoryUseCase,
    private readonly progressUseCase: GetMonitorProgressUseCase,
    private readonly siaExcelParser: SiaExcelParserAdapter,
  ) {}

  @Post('sessions')
  @ApiOperation({ summary: 'Registrar una nueva sesión de monitoría (Monitor)' })
  async createSession(@Body() dto: CreateSessionDto, @Req() req: any) {
    // Si req.user tiene el monitorProfileId (inyectado por auth guard o mock de prueba)
    const monitorProfileId = req.user?.monitorProfileId || 'default-monitor-profile-id';
    const periodId = req.user?.periodId || 'default-period-id';

    const session = await this.registerUseCase.execute(monitorProfileId, periodId, dto);
    return {
      message: 'Sesión de monitoría registrada exitosamente.',
      data: session,
    };
  }

  @Get('sessions/me')
  @ApiOperation({ summary: 'Consultar mi historial de monitorías con filtros personalizados' })
  async getMyHistory(@Query() filterDto: FilterHistoryDto, @Req() req: any) {
    const monitorProfileId = req.user?.monitorProfileId || 'default-monitor-profile-id';
    return await this.historyUseCase.execute(monitorProfileId, filterDto);
  }

  @Get('monitors/me/progress')
  @ApiOperation({ summary: 'Consultar mi progreso actual hacia el requisito de 54 horas' })
  async getMyProgress(@Req() req: any) {
    const monitorProfileId = req.user?.monitorProfileId || 'default-monitor-profile-id';
    return await this.progressUseCase.execute(monitorProfileId);
  }

  @Post('sessions/import-sia')
  @ApiOperation({ summary: 'Cargar e importar masivamente un archivo Excel/CSV del SIA' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async importSiaFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Debe adjuntar un archivo Excel (.xlsx o .csv).');
    }
    const result = this.siaExcelParser.parseBuffer(file.buffer);
    return {
      message: 'Archivo SIA procesado exitosamente.',
      summary: {
        totalRows: result.totalRows,
        validRowsCount: result.validRows.length,
        invalidRowsCount: result.invalidRows.length,
      },
      validRows: result.validRows,
      invalidRows: result.invalidRows,
    };
  }
}
