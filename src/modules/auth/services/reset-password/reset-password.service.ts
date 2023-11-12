import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordStep1Request } from '../../../../dtos/resetPasswordStep1Request';
import { BebaUser } from '../../../../entities/user.entity';
import { Repository } from 'typeorm';
import { Result } from '../../../../dtos/results';
import { codes } from '../../../../codes';
import { BebaResetPassword } from '../../../../entities/reset-password.entity';
import { ServeEmailerService } from '../../../../emails/email.sender';
import { md5 } from '../../../../_helper/md5';
import { ToastrResponse } from '../../../../dtos/models';
import { ChangePasswordRequest } from '../../../../dtos/changePasswordRequest';

@Injectable()
export class ResetPasswordService {
    constructor(@InjectRepository(BebaUser) private bebaUser: Repository<BebaUser>,
        @InjectRepository(BebaResetPassword) private bebaResetPassword: Repository<BebaResetPassword>,
        private serveEmailerService: ServeEmailerService) { }

    async step1(resetPasswordStep1Request: ResetPasswordStep1Request, host): Promise<Result<ToastrResponse>> {
        try {
            var user = await this.bebaUser.findOne({ where: { Email: resetPasswordStep1Request.email } })

            if (!user) {
                return new Result(false)
            }
            var entity = await this.bebaResetPassword.findOne({ where: { UserEmail: resetPasswordStep1Request.email } })
            resetPasswordStep1Request.newPassword = md5(resetPasswordStep1Request.newPassword);

            if (!entity) {
                entity = {
                    Password: null,
                    UserEmail: resetPasswordStep1Request.email,
                }
            }

            entity.Password = resetPasswordStep1Request.newPassword;

            entity = await this.bebaResetPassword.save(entity);
            const url = `http://${host}/auth/reset-password/${entity.Id}`;

            await this.serveEmailerService.forgotPasswordEmail(host, `Reset password`, user.Name, user.Email, url);

            return new Result(true)
        } catch (e) {
            console.error("Error resetting password", e, codes.resetPasswordStep1)
            return new Result(false);
        }
    }

    async step2(verificationToken: string) {
        try {
            var resetEntry = await this.bebaResetPassword.findOne({ where: { Id: verificationToken } })

            if (!resetEntry) {
                return new Result(false)
            }

            var user = await this.bebaUser.findOne({ where: { Email: resetEntry.UserEmail } });

            user.Password = resetEntry.Password;

            await this.bebaUser.save(user);
            await this.bebaResetPassword.delete(resetEntry);

            return new Result(true)
        } catch (e) {
            console.error("Error resetting password", e, codes.resetPasswordStep1)
            return new Result(false);
        }
    }

    async changePassword(changePasswordRequest: ChangePasswordRequest) {
        try {
            var resetEntry = await this.bebaUser.findOne({ where: { Id: changePasswordRequest.id } })

            if (!resetEntry) {
                return new Result(false);
            }

            var password = md5(changePasswordRequest.oldPassword);

            if (password != resetEntry.Password) {
                return new Result(false);
            }

            resetEntry.Password = password;
            await this.bebaUser.save(resetEntry);

            return new Result(true)
        } catch (e) {
            console.error("Error changing password", e, codes.changePassword)
            return new Result(false);
        }
    }
}
