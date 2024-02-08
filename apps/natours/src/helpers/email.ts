// import * as aws from '@aws-sdk/client-ses';
// import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { convert } from 'html-to-text';
import type { SendMailOptions, Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';
import pug from 'pug';

import { EMAIL_PROVIDER, NEW_USER_EXPIRES_AT } from '../config';
import { Logger } from '../loggers';

Logger.info(`Email service "${EMAIL_PROVIDER}" is being used`);
const {
  MT_FAKE_EMAIL_USERNAME,
  MT_FAKE_EMAIL_PASSWORD,
  MT_FAKE_EMAIL_PORT,
  MT_FAKE_EMAIL_HOST,
  NATOUR_EMAIL_FROM,
  NODE_ENV = 'development',
  // NATOUR_SENDGRID_USERNAME,
  // NATOUR_SENDGRID_PRIVATE_KEY,
  // NATOUR_SENDGRID_SERVER,
  // NATOUR_SENDGRID_PORT,
  // NATOUR_AWSSES_SECRET,
  // NATOUR_AWSSES_ACCESS,
  // AWS_SECRET_ACCESS_KEY,
  // AWS_ACCESS_KEY_ID,
  MAILTRAP_EMAIL_FROM,
  MAILTRAP_HOST,
  MAILTRAP_API_TOKEN,
  MAILTRAP_PORT,
  MAILTRAP_USERNAME,
} = process.env;
if (
  !MT_FAKE_EMAIL_USERNAME ||
  !MT_FAKE_EMAIL_PASSWORD ||
  !MT_FAKE_EMAIL_PORT ||
  !MT_FAKE_EMAIL_HOST ||
  !NATOUR_EMAIL_FROM ||
  // !NATOUR_SENDGRID_USERNAME ||
  // !NATOUR_SENDGRID_PRIVATE_KEY ||
  // !NATOUR_SENDGRID_SERVER
  // !NATOUR_SENDGRID_PORT
  // NATOUR_AWSSES_SECRET ||
  // NATOUR_AWSSES_ACCESS
  // !AWS_SECRET_ACCESS_KEY ||
  // !AWS_ACCESS_KEY_ID
  !MAILTRAP_HOST ||
  !MAILTRAP_API_TOKEN ||
  !MAILTRAP_PORT ||
  !MAILTRAP_USERNAME ||
  !MAILTRAP_EMAIL_FROM
)
  // eslint-disable-next-line unicorn/prefer-module
  Logger.error('email env vars not set correctly');

interface EmailOptions {
  to: string;
  subject: string;
  message: string;
}

/**
 * send email with nodemailer
 *
 * @async
 * @param options - object with to, subject and text for email conent
 * @returns \{Promise<void>\}
 */
const sendEmail = async function sendEmail(options: EmailOptions) {
  try {
    // if (!EMAIL_USERNAME || !EMAIL_PASSWORD || !EMAIL_PORT || !EMAIL_HOST) {
    //   throw new Error('email env vars not set correctly');
    // }
    // console.log(options);
    /**
     * ## 3 steps for nodemailer
     */

    // NOTE: step 1: create transporter
    const transporter = createTransport({
      // service: 'Gmail',
      host: MT_FAKE_EMAIL_HOST,
      port: Number(MT_FAKE_EMAIL_PORT),
      auth: {
        user: MT_FAKE_EMAIL_USERNAME,
        pass: MT_FAKE_EMAIL_PASSWORD,
      },
    });
    // NOTE: step 2: define email options
    const emailOptions: SendMailOptions = {
      from: 'Gipo <hello@gipo.com',
      to: options.to,
      subject: options.subject,
      text: options.message,
      // html: // convert text to hmtl
    };
    // NOTE: step 3: send email
    await transporter.sendMail(emailOptions);
  } catch (error) {
    Logger.error(error);
  }
};

/**
 * ## Bring the compiled functions outsite for caching
 */
const sendWelcomeTemplate = pug.compileFile(`${__dirname}/emails/welcome.pug`);
const sendEmailConfirmationTemplate = pug.compileFile(
  `${__dirname}/emails/emailConfirmation.pug`
);
const sendPasswordResetTemplate = pug.compileFile(
  `${__dirname}/emails/passwordReset.pug`
);

class Email {
  #to: string;

  #from: string;

  #firstName: string;

  #url: string;

  // #sendWelcomeTemplate;

  // #sendPasswordResetTemplate;

  private transporter: Transporter;

  /**
   * @description
   * @param user - user object
   * @param url - url to post in email
   */
  constructor(user: any, url: string) {
    // this.#sendWelcomeTemplate = pug.compileFile(
    //     `${__dirname}/emails/welcome.pug`
    // );
    // this.#sendPasswordResetTemplate = pug.compileFile(
    //     `${__dirname}/emails/passwordReset.pug`
    // );
    this.#to = user.email;
    // this.firstName = user.name.split(' ').at(0);
    [this.#firstName] = user.name.split(' ');
    this.#url = url;
    // this.#from = `Gipo <${NATOUR_EMAIL_FROM}>`;
    this.#from = `Gipo <${MAILTRAP_EMAIL_FROM}>`;
    // this.#from = NATOUR_EMAIL_FROM as string;
    this.transporter = this.#newTransport();
  }

  #newTransport() {
    /**
     * ## Conditionally set email vars based on NODE_ENV
     */
    // const NATOUR_SENDGRID_PORT = 25;
    // const [USERNAME, PASSWORD, PORT, HOST] =
    //     // swap logic, used for testing
    //     NODE_ENV === 'production'
    //         ? [
    //               NATOUR_SENDGRID_USERNAME,
    //               NATOUR_SENDGRID_PRIVATE_KEY,
    //               NATOUR_SENDGRID_PORT,
    //               NATOUR_SENDGRID_SERVER,
    //           ]
    //         : [EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_HOST];

    /**
     * ## PRODUCTION
     */
    // if (process.env.NODE_ENV === 'production') {
    if (NODE_ENV === 'production') {
      // if (true) {
      // if (false) {
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
        host: MAILTRAP_HOST,
        port: Number(MAILTRAP_PORT),
        auth: {
          user: MAILTRAP_USERNAME,
          pass: MAILTRAP_API_TOKEN,
        },
      };
      return createTransport(transporterOptions);
    }
    /**
     * ## DEVELOPMENT mailtrap fake smtp server
     * data was changed, env vars need to be updated
     */
    // NOTE: for mailtrap
    const transporterOptions = {
      host: MT_FAKE_EMAIL_HOST,
      port: Number(MT_FAKE_EMAIL_PORT),
      auth: {
        user: MT_FAKE_EMAIL_USERNAME,
        pass: MT_FAKE_EMAIL_PASSWORD,
      },
    };
    return createTransport(transporterOptions);

    // return createTransport(transporterOptions);
  }

  // IMP: be careful abouht this binding (scope and async)
  #catchMailAsync = function catchMailAsync(callback: () => Promise<any>) {
    // TODO: must be async to wait for completion where it's called
    return async function returnedFunction() {
      try {
        await callback();
      } catch (error) {
        Logger.error(error);
      }

      // callback().catch((error: any) => {
      //   Logger.error(error);
      // });
      // callback().catch((error: any) => {
      //   Logger.error(error);
      // });
    };
  };

  /**
   * @description
   * send the email using template (pug template) and the subject
   * @param templateOptions - pug template
   * @param subject - subject of the email
   */
  async #send(html: string, subject: string) {
    // console.log('sendmail');
    // 1) render html based on a pug template
    /**
     * ## this step is tricky with webpack. with pug loader i can import the template and it returns a function which gets converted to rendered html with params passed
     * without the loader, it copies them to dist
     *
     * but in this case i need to rende conditionally, so i need to copy all pugs to dist
     */
    // eslint-disable-next-line unicorn/prefer-module
    // const html = pug.renderFile(`${__dirname}/emails/${template}.pug`, {
    //   firstName: this.#firstName,
    //   url: this.#url,
    //   subject,
    // });
    /**
     * ## better performance - caching the templaate
     */
    // const html = pug.render(templateOptions);

    // 2) define email options
    const options: SendMailOptions = {
      from: this.#from,
      to: this.#to,
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
    await this.transporter.sendMail(options);
  }

  // IMP: be careful abouht this binding (scope and async)
  public sendWelcome = this.#catchMailAsync(async () => {
    // console.log('sendwelcome');
    const subject = 'Welcome to the Natours Family!';
    // const template = `Welcome to the Natours Family, ${this.#firstName}!`;
    await this.#send(
      sendWelcomeTemplate({
        firstName: this.#firstName,
        url: this.#url,
        subject,
      }),
      subject
    );
    return this;
  });

  public sendPasswordReset = this.#catchMailAsync(async () => {
    // console.log('sendpasswordreset');

    const subject = 'You password reset token (valid for 10 min)';
    // const template = `Welcome to the Natours Family, ${this.#firstName}!`;

    await this.#send(
      sendPasswordResetTemplate({
        firstName: this.#firstName,
        url: this.#url,
        subject,
      }),
      subject
    );
    return this;
  });

  // TODO: does this work?
  // IMP: be careful abouht this binding (scope and async)
  public sendMessage = async () => {
    const subject = 'Welcome to the Natours Family!';
    const template = `Welcome to the Natours Family, ${this.#firstName}!`;
    await this.#send(template, subject);
    return this;
  };

  public sendEmailConfirmation = async () => {
    /**
     * ## TODO: send email confirmation before saving the user
     *
     * will be similar to password reset
     * 1) on sign in route, create a token
     * 2) send email with token, pointing to route
     * 3) save the user and create account
     * redirect to login page if web ( send confirmation and welcome email )
     */
    // console.log('sendemailconfirmation');
    const subject = `Email Verification, valid for ${NEW_USER_EXPIRES_AT} min`;

    await this.#send(
      sendEmailConfirmationTemplate({
        firstName: this.#firstName,
        url: this.#url,
        subject,
      }),
      subject
    );

    return this;
  };
}

export { Email, sendEmail };
