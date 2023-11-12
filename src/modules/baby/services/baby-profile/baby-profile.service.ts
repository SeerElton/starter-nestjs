import { Injectable } from '@nestjs/common';
import { ShareBabyRequest } from '../../../../dtos/shareBabyRequest';
import { Result } from '../../../../dtos/results';
import { codes } from '../../../../codes';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { toEntity } from '../../../../_helper/toEntity/toEntity';
import { BebaBabySharedProfile } from '../../../../entities/shared-profile.entity';
import { ServeEmailerService } from '../../../../emails/email.sender';
import { BebaBaby } from '../../../../entities/baby.entity';
import { SharedBabyItem } from '../../../../dtos/models';

@Injectable()
export class BabyProfileService {

    constructor(@InjectRepository(BebaBabySharedProfile) private bebaBabySharedProfile: Repository<BebaBabySharedProfile>,
        @InjectRepository(BebaBaby) private bebaBaby: Repository<BebaBaby>,
        private toEntity: toEntity,
        private mailerService: ServeEmailerService) { }

    async shareProfile(BabyId: string, shareRequest: ShareBabyRequest): Promise<Result<null>> {
        try {
            const shared: BebaBabySharedProfile = {
                BabyId: BabyId,
                Email: shareRequest.email,
                Permission: shareRequest.permission,
                Id: shareRequest.id
            }

            await this.bebaBabySharedProfile.save(shared);

            const baby = await this.bebaBaby.findOne({ where: { Id: BabyId }, select: ['Name'] })

            this.mailerService.sharedProfileEmail(`Profile for ${baby.Name} has been shared with you! `, shareRequest.email, shareRequest.email);

            return new Result(true)

        } catch (e) {
            console.error("Error sharing profile", e, codes.AddShareProfileError)
            return new Result(false);
        }
    }

    async lookupShared(babyId: string): Promise<Result<SharedBabyItem[]>> {
        try {
            const bebaBabySharedProfiles = await this.bebaBabySharedProfile.find({ where: { BabyId: babyId }, select: ['Email', 'Id', 'Permission'] });
            var results = bebaBabySharedProfiles.map(x => this.toEntity.produce<SharedBabyItem>(x));

            return {
                isSuccess: true,
                value: results
            }

        } catch (e) {
            console.error("Error fetching shared profiles", e, codes.GetShareProfileError)
            return new Result(false);
        }
    }

    async deleteSharedAccess(id: string): Promise<Result<null>> {
        try {
            const results = await this.bebaBabySharedProfile.delete(id);

            if (results.affected == 0) {
                return new Result(false);
            }

            return new Result(true);
        } catch (e) {
            console.error("Error removing shared profiles", e, codes.RemoveShareProfileError)
            return new Result(false);
        }
    }
}
