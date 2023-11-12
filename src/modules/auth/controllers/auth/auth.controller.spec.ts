// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthController } from './auth.controller';
// import { AuthService } from '../../services/auth/auth.service';
// import { ResetPasswordService } from '../../services/reset-password/reset-password.service';
// import { HttpException } from '@nestjs/common';
// import { ToastrResponse } from '../../../../dtos/toastrResponse';
// import { LoginRequest } from '../../../../dtos/loginRequest';
// import { LoginResponse } from '../../../../dtos/loginResponse';
// import { ResetPasswordStep1Request } from '../../../../dtos/resetPasswordStep1Request';

// describe('AuthController', () => {
//     let controller: AuthController;
//     let authService: AuthService;
//     let resetPasswordService: ResetPasswordService;

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             controllers: [AuthController],
//             providers: [
//                 {
//                     provide: AuthService,
//                     useValue: {
//                         login: jest.fn(() => ({
//                             isSuccess: true,
//                             value: {
//                                 token: 'mockToken',
//                                 parent: { id: 'mockId' },
//                             },
//                         })),
//                     },
//                 },
//                 {
//                     provide: ResetPasswordService,
//                     useValue: {
//                         step1: jest.fn(() => ({ isSuccess: true })),
//                         step2: jest.fn(() => ({ isSuccess: true })),
//                     },
//                 },
//             ],
//         }).compile();

//         controller = module.get<AuthController>(AuthController);
//         authService = module.get<AuthService>(AuthService);
//         resetPasswordService = module.get<ResetPasswordService>(
//             ResetPasswordService,
//         );
//     });

//     describe('resetPasswordStep1', () => {
//         it('should return success response', async () => {
//             const resetPasswordStep1Request: ResetPasswordStep1Request = {
//                 email: 'test@example.com',
//             };
//             const req = { get: jest.fn(() => 'localhost') };

//             const result = await controller.resetPasswordStep1(
//                 resetPasswordStep1Request,
//                 req,
//             );

//             expect(result).toEqual({
//                 message: 'Please check your email to verify that its you',
//                 type: 'success',
//             });
//             expect(resetPasswordService.step1).toHaveBeenCalledWith(
//                 resetPasswordStep1Request,
//                 'localhost',
//             );
//         });

//         // it('should return warning response if step1 is not successful', async () => {
//         //   const resetPasswordStep1Request: ResetPasswordStep1Request = {
//         //     email: 'test@example.com',
//         //   };
//         //   const req = { get: jest.fn(() => 'localhost') };
//         //   resetPasswordService.step1.mockReturnValueOnce({ isSuccess: false });

//         //   const result = await controller.resetPasswordStep1(
//         //     resetPasswordStep1Request,
//         //     req,
//         //   );

//         //   expect(result).toEqual({
//         //     message:
//         //       'Verify that your email is right, if it is then check your mailbox',
//         //     type: 'warning',
//         //   });
//         //   expect(resetPasswordService.step1).toHaveBeenCalledWith(
//         //     resetPasswordStep1Request,
//         //     'localhost',
//         //   );
//         // });
//     });
// });