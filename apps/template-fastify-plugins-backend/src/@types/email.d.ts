type EmailTemplate = 'welcome' | 'emailConfirmation' | 'passwordReset';

type EmailTemplateData = {
  firstName: string;
  url: string;
  subject: string;
};

type EmailOptions = {
  firstName: string;
  url: string;
  to: string;
  data?: {
    ip?: string;
    userAgent?: string;
  };
};

type SendEmail = (options: EmailOptions) => Promise<Email>;

type TBullEmailJobData = {
  type: EmailTemplate;
  options: EmailOptions;
};
