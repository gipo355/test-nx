import path from 'node:path';
import { fileURLToPath } from 'node:url';

import pug from 'pug';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const emailsDirectory = path.join(dirname, '../../../views/emails');

// const renderWelcomeEmailTemplate = pug.compileFile(
//     `${emailsDirectory}/welcome.pug`
// );
// const renderEmailConfirmationEmailTemplate = pug.compileFile(
//     `${emailsDirectory}/emailConfirmation.pug`
// );
// const renderPasswordResetEmailTemplate = pug.compileFile(
//     `${emailsDirectory}/passwordReset.pug`
// );

const emailRenderers = {
  // welcome: renderWelcomeEmailTemplate,
  // emailConfirmation: renderEmailConfirmationEmailTemplate,
  // passwordReset: renderPasswordResetEmailTemplate,
  welcome: pug.compileFile(`${emailsDirectory}/welcome.pug`),
  emailConfirmation: pug.compileFile(
    `${emailsDirectory}/emailConfirmation.pug`
  ),
  passwordReset: pug.compileFile(`${emailsDirectory}/passwordReset.pug`),
};

export const renderEmail = (type: EmailTemplate, data: EmailTemplateData) => {
  const { firstName, url, subject } = data;

  const html = emailRenderers[type]({
    firstName,
    url,
    subject,
  });

  return html;
};
