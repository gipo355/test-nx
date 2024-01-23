// TODO: redirect to login if not logged in

import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

// import type { LayoutLoad } from './$types';

// redirect to home if logged in and trying to access login page
export const load = ({ data, url }) => {
  const { user } = data || {};

  if (user && url.pathname === '/login') {
    redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
  }

  if (!user && url.pathname !== '/login') {
    redirect(StatusCodes.TEMPORARY_REDIRECT, '/login');
  }

  return {
    user,
  };
};
