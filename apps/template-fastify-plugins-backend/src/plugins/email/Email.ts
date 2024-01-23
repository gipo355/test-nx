// import * as aws from '@aws-sdk/client-ses';
// import { defaultProvider } from '@aws-sdk/credential-provider-node';

// import path from 'node:path';
// import { fileURLToPath } from 'node:url';

import type { FastifyInstance } from 'fastify';
import { convert } from 'html-to-text';
import type { SendMailOptions, Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';
// import ejs from 'ejs';
// import pug from 'pug';

// const filename = fileURLToPath(import.meta.url);
// const dirname = path.dirname(filename);

/**
 * ## Compile in memory (better performance) once
 */

// const emailsDirectory = path.join(dirname, '../../../views/emails');

// const sendWelcomeEmailTemplate = pug.compileFile(
//     `${emailsDirectory}/welcome.pug`
// );
// const sendEmailConfirmationEmailTemplate = pug.compileFile(
//     `${emailsDirectory}/emailConfirmation.pug`
// );
// const sendPasswordResetEmailTemplate = pug.compileFile(
//     `${emailsDirectory}/passwordReset.pug`
// );

class Email {
  // #to: string;

  #from: string;

  // #firstName: string;

  // #url: string;

  #fastify: FastifyInstance;

  // #sendWelcomeTemplate;

  // #sendPasswordResetTemplate;

  #transporter: Transporter;

  /**
   * @description
   * @param user - user object
   * @param url - url to post in email
   */
  constructor(fastify: FastifyInstance) {
    // constructor(fastify: FastifyInstance, user: any, url: string) {
    this.#fastify = fastify;

    // this.#sendWelcomeTemplate = pug.compileFile(
    //     `${dirname}/emails/welcome.pug`
    // );
    // this.#sendPasswordResetTemplate = pug.compileFile(
    //     `${dirname}/emails/passwordReset.pug`
    // );
    //
    // this.#to = user.email;

    // this.firstName = user.name.split(' ').at(0);
    //
    // [this.#firstName] = user.name.split(' ');

    // this.#url = url;

    // this.#from = `Gipo <${NATOUR_EMAIL_FROM}>`;
    //
    this.#from = `Gipo <${fastify.env.MAILTRAP_FROM}>`;

    // this.#from = NATOUR_EMAIL_FROM as string;
    //
    this.#transporter = this.#newTransport();
  }

  #newTransport() {
    /**
     * ## The env vars will decide if we are in production or development
     */

    /**
     * ## Sendgrid
     */
    // const transporterOptions = {
    //     ...(NODE_ENV === 'production' && { service: 'SendGrid' }),
    //     ...(NODE_ENV === 'development' && { host: HOST }),
    //     ...(NODE_ENV === 'development' && { port: Number(PORT) }),
    //     auth: {
    //         user: USERNAME,
    //         pass: PASSWORD,
    //     },

    /**
     * ## AWS SES
     */
    // const ses = new aws.SES({
    //     // apiVersion: '2010-12-01',
    //     // region: 'us-east-1',
    //     region: 'eu-central-1',
    //     // ...(defaultProvider as SESClientConfigType),
    //     credentials: {
    //         accessKeyId: AWS_ACCESS_KEY_ID as string,
    //         secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
    //     },
    // });
    // const transporterOptions = {
    //     SES: { ses, aws },
    // };
    // return createTransport({ SES: { ses, aws } });

    /**
     * ## Mailtrap
     */
    const transporterOptions = {
      // service: 'Mailtrap',

      host: this.#fastify.env.MAILTRAP_HOST,
      port: Number(this.#fastify.env.MAILTRAP_PORT),
      auth: {
        user: this.#fastify.env.MAILTRAP_USERNAME,
        pass: this.#fastify.env.MAILTRAP_API_TOKEN_OR_PASSWORD,
      },
    };

    return createTransport(transporterOptions);
  }

  async sendEmail(type: EmailTemplate, options: EmailOptions) {
    await this.#emailSenders[type](options);
  }

  /**
   * @description
   * send the email using template (pug template) and the subject
   * @param templateOptions - pug template
   * @param subject - subject of the email
   */
  async #send(html: string, subject: string, to: string) {
    // console.log('sending email');
    // console.log(html, 'html');
    // console.log(subject, 'subject');
    // console.log(to, 'to');

    // 2) define email options
    const options: SendMailOptions = {
      from: this.#from,
      to,
      subject,
      html, // convert text to hmtl
      /**
       * ## WE MUST INCLUDE TEXT FOR DELIVERY RATE AND SPAM FOLDERS (like accessibility) in case html is not supported
       * we need a way to convert html to text (html-to-text)
       */
      text: convert(html),
    };

    // 3) create a transport and send email
    // const transporter = this.#newTransport(); // caching this in the constructor
    try {
      await this.#transporter.sendMail(options);
      // console.log('email sent');
    } catch (error) {
      this.#fastify.log.error(error);
      // console.log('email not sent');
    }
  }

  #sendWelcomeEmail: SendEmail = async ({ firstName, url, to }) => {
    const subject = 'Welcome to the Natours Family!';
    const html = await this.#fastify.workerpools.proxy1.renderEmail('welcome', {
      firstName,
      url,
      subject,
    });
    // console.log(subject, 'subject');
    // console.log(html, 'html');

    await this.#send(html, subject, to);
    return this;
  };

  #sendPasswordResetEmail: SendEmail = async ({ firstName, url, to }) => {
    const subject = 'You password reset token (valid for 10 min)';
    const html = await this.#fastify.workerpools.proxy1.renderEmail(
      'passwordReset',
      {
        firstName,
        url,
        subject,
      }
    );

    await this.#send(html, subject, to);
    return this;
  };

  #sendEmailConfirmation: SendEmail = async ({ firstName, url, to }) => {
    /**
     * will be similar to password reset
     * 1) on sign in route, create a token
     * 2) send email with token, pointing to route
     * 3) save the user and create account
     * redirect to login page if web ( send confirmation and welcome email )
     */
    // TODO: no magic number for new user expires at
    const subject = `Email Verification, valid for ${
      this.#fastify.config.NEW_USER_EMAIL_EXPIRATION
    } min`;

    const html = await this.#fastify.workerpools.proxy1.renderEmail(
      'emailConfirmation',
      {
        firstName,
        url,
        subject,
      }
    );

    await this.#send(html, subject, to);

    return this;
  };

  #emailSenders: Record<EmailTemplate, SendEmail> = {
    welcome: this.#sendWelcomeEmail,
    passwordReset: this.#sendPasswordResetEmail,
    emailConfirmation: this.#sendEmailConfirmation,
  };
}

export { Email };
