import { Module } from '@nestjs/common';
import { BabyController } from './controllers/baby/baby.controller';
import { BabyGrowthRecordController } from './controllers/baby-growth-record/baby-growth-record.controller';
import { BabyProfileShareController } from './controllers/baby-profile-share/baby-profile-share.controller';
import { BabyProfileService } from './services/baby-profile/baby-profile.service';
import { BabyInfoService } from './services/baby-info/baby-info.service';
import { BabyGrowthTrackerService } from './services/baby-growth-record/baby-growth-record.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BebaBabySharedProfile } from '../../entities/shared-profile.entity';
import { BebaBaby } from '../../entities/baby.entity';
import { ServeEmailerService } from '../../emails/email.sender';
import { toEntity } from '../../_helper/toEntity/toEntity';
import { BebaBabyGrowthRecord } from '../../entities/baby-growth-record.entity';
import { BebaUser } from '../../entities/user.entity';
import { ZScoreService } from './services/z-score/z-score.service';
import { ZScoreController } from './controllers/z-score/z-score.controller';
import { MilestonesController } from './controllers/milstones/milestones.controller';
import { MilestonesService } from './services/milestones/milestones.service';
import { ImmunizationTimelineController } from './controllers/immunization-timeline/immunization-timeline.controller';
import { ImmunizationTimelineService } from './services/immunization-timeline/immunization-timeline.service';
import { BebaPersonalMilestone } from '../../entities/personal-milestone.entity';
import { BebaBabyAdditionalInformation } from '../../entities/additional-information.entity';
import { PointsService } from './services/score/points.service';

@Module({
    controllers: [BabyController, BabyGrowthRecordController, BabyProfileShareController, ZScoreController, MilestonesController, ImmunizationTimelineController],
    providers: [BabyProfileService, BabyInfoService, BabyGrowthTrackerService, ServeEmailerService, toEntity, ZScoreService, MilestonesService, ImmunizationTimelineService, PointsService],
    imports: [
        TypeOrmModule.forFeature([BebaBabySharedProfile, BebaBaby, BebaBabyGrowthRecord, BebaUser, BebaPersonalMilestone, BebaBabyAdditionalInformation])
    ]
})
export class BabyModule { }
