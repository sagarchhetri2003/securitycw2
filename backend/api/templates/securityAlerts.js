// exports.passwordExpiredEmail = (user, resetLink) => `
//   <p>Hello ${user.name},</p>
//   <p>Your password has expired. Please reset it using the link below:</p>
//   <a href="${resetLink}">Reset Password</a>
//   <p>This link is valid for 1 hour.</p>
// `;

// exports.accountLockedEmail = (user) => `
//   <p>Hello ${user.name},</p>
//   <p>Your account has been temporarily locked due to 3 failed login attempts.</p>
//   <p>Please wait 10 minutes before trying again.</p>
// `;


exports.passwordExpiredEmail = (user, resetLink) => `
  <p>Hello ${user.name},</p>
  <p>Our records show that your password has expired for security reasons.</p>
  <p>Please click the button below to reset your password:</p>
  <p><a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
  <p>This link is valid for 1 hour. If you did not request this, please ignore this email.</p>
  <p>Thank you,<br/>Security Team</p>
`;

exports.accountLockedEmail = (user) => `
  <p>Hello ${user.name},</p>
  <p>We detected 5 failed login attempts to your account and, as a precaution, your account has been temporarily locked.</p>
  <p>You can try logging in again after 10 minutes.</p>
  <p>If you did not attempt to log in, please consider changing your password once you regain access.</p>
  <p>Thank you,<br/>Security Team</p>
`;
