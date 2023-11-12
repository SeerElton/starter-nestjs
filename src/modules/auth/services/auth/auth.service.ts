import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BebaUser } from '../../../../entities/user.entity';
import { LoginRequest, LoginResponse, ParentSignUpRequest } from '../../../../dtos/models';
import { Result } from '../../../../dtos/results';
import { UserProfile } from '../../../../dtos/userProfile';
import { codes } from '../../../../codes';
import { toEntity } from '../../../../_helper/toEntity/toEntity';
import { md5 } from '../../../../_helper/md5';
import { ServeEmailerService } from '../../../../emails/email.sender';

@Injectable()
export class AuthService {

    resetEmailSecrete = 'BebaToken23';
    constructor(@InjectRepository(BebaUser) private bebaUser: Repository<BebaUser>,
        private jwtService: JwtService,
        private toEntity: toEntity,
        private serveEmailerService: ServeEmailerService) { }

    async validateUser(email: string, pass: string): Promise<UserProfile> {
        const user = await this.bebaUser.findOne({ where: { Email: email } });

        if (user && user.Password === pass) {
            const { Password, ...result } = user;
            return result;
        }

        return null;
    }

    async login(user: LoginRequest): Promise<Result<LoginResponse>> {
        try {
            user.password = md5(user.password);
            const payload = await this.validateUser(user.email, user.password);
            const expiresIn = 365 * 24 * 60 * 60; // expires in a year

            if (!payload) {
                console.error("Login error", user)
                return new Result(false);
            }

            const results: LoginResponse = {
                name: payload.Name,
                isVerified: payload.IsVerified,
                jwt: this.jwtService.sign(
                    payload,
                    { expiresIn }
                )
            };

            return {
                isSuccess: true,
                value: results
            }
        } catch (e) {
            console.error("Error login in", e, codes.LoginException)
            return new Result(false);
        }
    }

    async register(user: ParentSignUpRequest, host): Promise<Result<boolean>> {
        try {
            var exist = await this.bebaUser.exist({ where: { Email: user.email } });

            if (exist) {
                return new Result(false)
            }

            user.password = md5(user.password);
            var entity = this.toEntity.create<BebaUser>(user);

            await this.bebaUser.save(entity);

            const sendVerification = await this.sendVerificationMail(host, user.email, user.name);

            if (!sendVerification.isSuccess) {
                return new Result(false);
            }

            return new Result(true)

        } catch (e) {
            console.error("Error registering", e, codes.RegisterException);
            return new Result(false);
        }
    }

    async verifyEmail(email: string, code: string): Promise<Result<boolean>> {
        try {
            const user = await this.bebaUser.findOne({ where: { Email: email } });

            const expectedCode = md5(email + 'BebaToken23');

            if (!user || user.IsVerified || expectedCode != code) {
                return new Result(false)
            }

            user.IsVerified = true;
            await this.bebaUser.save(user);

            return new Result(true)

        } catch (e) {
            console.error("Error verifying email", e, codes.VerifyEmailError)
            return new Result(false);
        }
    }

    async sendVerificationMail(host: string, email: string, name?: string): Promise<Result<boolean>> {
        try {

            if (!name) {
                const user = await this.bebaUser.findOne({ select: ['Name'], where: { Email: email } });
                name = user.Name;
            }

            const url = `http://${host}/auth/verify-email/${email}/${md5(email + this.resetEmailSecrete)}`;
            await this.serveEmailerService.registration(host, "Beba Account Created", name, email, url);

            return new Result(true);
        } catch (e) {
            console.error("Error sending verification mail", e, codes.SendVerificationEmailException);
            return new Result(false);
        }
    }
}