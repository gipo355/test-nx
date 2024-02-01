import { Job } from 'bullmq';
import type { Document } from 'mongoose';

import { Email, sendEmail } from '../helpers';
import { Logger } from '../loggers';
import { User } from '../models';

/**
 * ## job structure:
 * {
 *  type: 'sendWelcome',
 *  data: {
 *
 *
 *  }
 * }
 */

export type JobDataCustom =
  | {
      /**
       * @description the type must be a valid Email method
       */
      type: 'sendWelcome' | 'sendPasswordReset' | 'sendEmailConfirmation';
      data: {
        user: Document;
        url?: string;
      };
    }
  | {
      type: 'old';
      data: {
        old: {
          subject: string;
          message: string;
          to: string;
          id: string;
        };
      };
    };

// TODO: reset mongodb userResetToken and userResetTokenExpiry on error

// export const bullmqMailWorkerJob = async (job: Job) => {
//   // console.log(job.name);
//   // console.log(job.data);
//   // console.log('bullmq worker from pool completed a job');
//   // we need to handle mail errors
//   try {
//     await sendEmail({
//       to: job.data.to,
//       subject: job.data.subject,
//       message: job.data.message,
//     });
//     // console.log('mail sent');
//   } catch (error) {
//     const user = await User.findById(job.data.id);
//     if (user) {
//       await user.clearPasswordResetToken();
//       await user.save({ validateBeforeSave: false });
//     }
//     Logger.error(error);
//     throw error;
//   }
//   // console.log(`mail sent to ${job.data.to}`);
// };

export const bullmqMailWorkerJob = async (job: Job) => {
  /**
   * ## resetPassword bullmqQueue1 job
   */
  if (job.data.type === 'old') {
    /**
     * ## old reset password way
     */
    try {
      const {
        data: {
          data: {
            old: { to, subject, message },
          },
        },
      }: { data: JobDataCustom } = job;

      // we need to handle mail errors

      // if (id) {
      await sendEmail({
        to,
        subject,
        message,
      });
      // console.log('mail sent');
      // }
    } catch (error) {
      /**
       * ## reset password reset token if error
       */
      const user = await User.findById(job.data.id);
      if (user) {
        await user.clearPasswordResetToken();
        await user.save({ validateBeforeSave: false });
      }
      Logger.error(error);
      throw error;
    }
  } else {
    try {
      const {
        data: {
          type,
          data: { user, url },
        },
      }: { data: JobDataCustom } = job;
      // console.log(job.name);
      // console.log(job.data);
      // console.log('bullmq worker from pool completed a job');

      const allowedTypes = [
        'sendWelcome',
        'sendPasswordReset',
        'sendEmailConfirmation',
      ];

      if (!allowedTypes.includes(type))
        throw new Error('invalid bullmq job type');

      if (user && user.id && url) {
        const email = new Email(user, url);

        // const sendMailCases = {
        //   /**
        //    * ## we can't assign it directly or it will be executed on assignment
        //    */
        //   sendWelcome: async () => email.sendWelcome(),
        //   sendPasswordReset: async () => email.sendPasswordReset(),
        // };

        // // eslint-disable-next-line security/detect-object-injection -- this is not user input
        // await sendMailCases[type]();

        // eslint-disable-next-line security/detect-object-injection -- this is not user input
        await email[type]();
      }
    } catch (error) {
      // possible double handling?
      Logger.error(error);
      throw error;
    }
  }

  // console.log(`mail sent to ${job.data.to}`);
};
