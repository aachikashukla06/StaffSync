import { saveSession } from '../../utils/session';

export function saveUserSession(response, expectedRole) {
  const user = response?.data;
  const token = response?.token;

  if (!user || !token) {
    throw new Error('Invalid server response.');
  }

  if (user.role !== expectedRole) {
    throw new Error(`This account is not an ${expectedRole} account.`);
  }

  saveSession(token, user);
}

export function getLoginError(error) {
  const message = error?.response?.data?.message || error.message || 'Unable to login. Please try again.';
  if (message.toLowerCase() === 'user not found') return 'No account matches this ID or email. Ask HR or your administrator to create your account.';
  return message;
}
