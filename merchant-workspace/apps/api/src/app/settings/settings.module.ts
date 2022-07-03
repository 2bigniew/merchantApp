import { Module } from '@nestjs/common'
import { RepositoryService } from '../services/repository/repository.service'
import { SettingsController } from './settings.controller'

@Module({
  controllers: [SettingsController],
  providers: [RepositoryService],
})
export class SettingsModule {}
