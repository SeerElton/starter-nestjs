import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResetPasswordService } from '../../services/reset-password/reset-password.service';
import { LoginRequest } from '../../../../dtos/loginRequest';
import { ParentSignUpRequest } from '../../../../dtos/parentSignUpRequest';
import { Public } from '../../../../_helper/jwt/public.decorator';
import { ResetPasswordStep1Request } from '../../../../dtos/resetPasswordStep1Request';
import { ToastrResponse } from '../../../../dtos/toastrResponse';
import { AuthService } from '../../services/auth/auth.service';
import { Response } from 'express';
import { codes } from '../../../../codes';
import { ChangePasswordRequest } from '../../../../dtos/changePasswordRequest';
import { LoginResponse } from '../../../../dtos/models';

@Controller('auth')
@ApiTags('auth')
@Public()
export class AuthController {

  constructor(private authService: AuthService, private resetPasswordService: ResetPasswordService) { }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Successful operation', type: ToastrResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
  async resetPasswordStep1(@Body() resetPasswordStep1Request: ResetPasswordStep1Request, @Req() req, @Res() res: Response) {
    try {
      var result = await this.resetPasswordService.step1(resetPasswordStep1Request, req.get('host'));

      if (!result.isSuccess) {
        res.status(500).json({ message: 'Please verify that your email is correct', type: 'warning' });
      } else {
        res.status(200).json({ message: 'Please check your email to verify that its you', type: 'success' });
      }

    } catch (e) {
      res.status(500).json({ message: 'Internal server error', type: 'error' });
      console.error("Reset password controller exception", e, codes.AuthControllerResetPasswordException)
    }
  }

  @Get('reset-password/:verificationToken')
  @ApiOperation({ summary: 'Verify reset password request' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
  async resetPasswordVerify(@Param('verificationToken') verificationToken: string) {
    try {
      var results = await this.resetPasswordService.step2(verificationToken);

      if (!results.isSuccess) {
        return "Link already used";
      }

      return "Password changed";
    } catch (e) {
      throw new HttpException({ message: "Internal server error", type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('resend-verification-email/:email')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiResponse({ status: 200, description: 'Successful operation', type: ToastrResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
  async resendVerificationEmail(@Param('email') email: string, @Req() req, @Res() res: Response) {
    try {
      var results = await this.authService.sendVerificationMail(req.get('host'), email);

      if (!results.isSuccess)
        res.status(500).json({
          message: "Error sending verification email",
          type: 'error'
        });
      else
        res.status(200).json({
          message: "Verification email send, please check your inbox!",
          type: 'success'
        });

    } catch (e) {
      throw new HttpException({ message: "Internal server error", type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('verify-email/:email/:code')
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
  async verifyEmail(@Param('email') email: string, @Param('code') code: string) {
    try {
      var results = await this.authService.verifyEmail(email, code);

      if (!results.isSuccess) {
        return "Link already used";
      }

      return "Email verified";
    } catch (e) {
      throw new HttpException({ message: "Internal server error", type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Successful operation', type: LoginResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
  async parentLogin(@Body() loginRequest: LoginRequest, @Res() res: Response): Promise<void> {
    try {
      var result = await this.authService.login(loginRequest);

      if (!result.isSuccess) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
          {
            message: "Incorrect credentials entered",
            type: ToastrResponse.TypeEnum.Error
          });
      } else {
        res.status(HttpStatus.OK).json(result.value);
      }

    } catch (e) {
      res.status(500).json(
        { message: "Internal server error", type: typeof ToastrResponse.TypeEnum.Error }
      )
      console.error("Login controller exception", e, codes.AuthControllerLoginException)
    }
  }

  @Post('/auth-parent/change-password')
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: 'Successful operation', type: ToastrResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(@Body() request: ChangePasswordRequest, @Res() res: Response) {
    try {

      res.status(500).json({ message: "Feature not supported", type: ToastrResponse.TypeEnum.Error })
      return;

      const results = await this.resetPasswordService.changePassword(request);

      if (results.isSuccess) {
        res.status(500).json({ message: "Invalid operation", type: ToastrResponse.TypeEnum.Error })
      } else {
        res.status(200).send({ message: "Password changed", type: ToastrResponse.TypeEnum.Success })
      }
    } catch (e) {
      throw new HttpException({ message: "Internal server error", type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new parent' })
  @ApiCreatedResponse({ description: 'Successful operation', type: ToastrResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal server error', type: ToastrResponse })
  @ApiResponse({ status: 200, description: 'Successful operation', type: ToastrResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
  async addParent(@Body() parentSignUpRequest: ParentSignUpRequest, @Res() res: Response, @Req() req) {
    try {
      parentSignUpRequest.subscribeToMarketing = parentSignUpRequest.subscribeToMarketing as any == 'true' ? true : false;
      var results = await this.authService.register(parentSignUpRequest, req.get('host'));


      if (!results.isSuccess)
        res.status(500).json({
          message: "Email already registered",
          type: 'error'
        });
      else
        res.status(200).json({
          message: "Account created successfully",
          type: 'success'
        });


    } catch (e) {
      throw new HttpException({ message: "Internal server error", type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
