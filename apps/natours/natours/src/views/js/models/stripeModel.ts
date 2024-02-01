// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-import
import { loadStripe } from '@stripe/stripe-js';

import { NATOURS_STRIPE_TEST_PUBLIC } from '../environment';

const createStripe = async function createStripe() {
  const loadedStripe = await loadStripe(NATOURS_STRIPE_TEST_PUBLIC);
  return loadedStripe;
};

const bookTour = async function bookTour(tourId: string) {
  /**
   * ## steps
   *
   * 1) get checkout session from server endpoint
   *
   * 2) use stripe object to create checkout form + charge credit card
   * alternatively, redirect to session url
   */

  try {
    const res = await fetch(`/api/v1/bookings/checkout-session/${tourId}`);

    const { session } = await res.json();

    const newStripe = await createStripe();
    await newStripe?.redirectToCheckout({
      sessionId: session.id,
    });
    // return session;
  } catch {
    // console.error(error);
    alert('There was an error with your request. Please try again.');
    // refresh page
    window.location.reload();
  }
};

export { bookTour, createStripe };
