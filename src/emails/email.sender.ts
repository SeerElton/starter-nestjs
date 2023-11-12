var nodemailer = require('nodemailer');

import { Injectable } from '@nestjs/common';
import { forgotPasswordEmailTemplate } from './forgot-password-email.template';
import { registerEmailTemplate } from './manager-email.template';
import { stakeholderEmailTemplate } from './stakeholder-email.template';
import { waiterEmailTemplate } from './waiter-email.template';

@Injectable()
export class ServeEmailerService {

    constructor() { }

    stakeholderRegistration(host, subject, name, email, resetUrl) {
        const template = stakeholderEmailTemplate(host, name, email, resetUrl);

        const mailOptions = {
            from: 'Serve 6',
            to: email,
            subject: subject,
            html: template
        };

        return this.sendMail(mailOptions);
    }

    waiterRegistration(host, subject, name, email, resetUrl) {
        const template = waiterEmailTemplate(host, name, email, resetUrl);

        const mailOptions = {
            from: 'Serve 6',
            to: email,
            subject: subject,
            html: template
        };

        return this.sendMail(mailOptions);
    }

    registration(host, subject, name, email, resetUrl) {
        const template = registerEmailTemplate(host, name, email, resetUrl);

        const mailOptions = {
            from: 'Serve 6',
            to: email,
            subject: subject,
            html: template
        };

        return this.sendMail(mailOptions);
    }

    sharedProfileEmail(subject, name, email) {
        // const template = managerEmailTemplate(host, name, email, resetUrl);

        // const mailOptions = {
        //     from: 'Serve 6',
        //     to: email,
        //     subject: subject,
        //     html: template
        // };

        // return this.sendMail(mailOptions);
    }

    forgotPasswordEmail(host, subject, name, email, resetUrl) {
        const template = forgotPasswordEmailTemplate(host, name, email, resetUrl);

        const mailOptions = {
            from: 'Serve 6',
            to: email,
            subject: subject,
            html: template
        };

        return this.sendMail(mailOptions);
    }

    private async sendMail(mailOptions) {
        let account = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            //secure: false,
            auth: {
                user: account.user,
                pass: account.pass
            },
            tls: {
                rejectUnauthorized: false
            },
        });

        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {

                console.log("here");
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    console.log(nodemailer.getTestMessageUrl(info));

                    resolve(info)
                }
            });
        })
    }
}
