import type { Request, Response } from 'express';
import Stripe from 'stripe';

// import { NATOURS_STRIPE_TEST_SECRET } from '../../../env';
import { SECRETS } from '../../../env';
import { AppError, catchAsync, statusCodes } from '../../../helpers';
import { Logger } from '../../../loggers';
import { Booking, Tour, User } from '../../../models';
import { createOne } from './createOne';
import { deleteOne } from './deleteOne';
import { getAll } from './getAll';
import { getOne } from './getOne';
import { patchOne } from './patchOne';

/**
 * ## TODO: move to production live keys?
 */
const stripe = new Stripe(SECRETS.NATOURS_STRIPE_TEST_SECRET as string, {
  apiVersion: '2022-11-15',
});

const createBookingCheckout = async (sessionData: Stripe.Checkout.Session) => {
  const userId = await User.findOne({
    email: sessionData?.customer_email,
  }).select('_id');
  const tourId = sessionData.client_reference_id;
  const price =
    sessionData?.amount_total !== 0 &&
    sessionData?.amount_total !== undefined &&
    sessionData?.amount_total !== null &&
    Number.isFinite(sessionData?.amount_total)
      ? sessionData.amount_total / 100
      : 0; // handle possible 0

  await Booking.create({
    user: userId,
    tour: tourId,
    price,
  });

  // @TODO: send email to admin, guide?

  return 1;
};

const getCheckoutSession = catchAsync(async (req, res) => {
  /**
   * ## Get the currently booked tour
   */
  const { tourId } = req.params;

  if (!tourId)
    return new AppError('No tour found with that ID', statusCodes.notFound);

  const tour = await Tour.findById(tourId);

  if (!tour)
    return new AppError('No tour found with that ID', statusCodes.notFound);

  if (!req.user)
    return new AppError(
      'You must be logged in to book a tour',
      statusCodes.unauthorized
    );

  // const lineItem: any = {
  // const lineItem: Stripe.LineItem = ;

  /**
   * ## Create checkout session
   * will make an api call to stripe
   */
  const session = await stripe.checkout.sessions.create({
    /**
     * ## we are using a newer version of stripe, so we need to pass the payment method types
     * CHECK API NOTES https://stripe.com/docs/api/checkout/sessions/create
     */
    /**
     * ## fields name descriptions and others come from stripe, we can't choose them
     */

    // payment_method_types: ['card'], // can specify multiple payment methods // OLD API
    mode: 'payment',

    /**
     * ## What happens when on actions
     */
    // success_url: `${req.protocol}://${req.get('host')}/?tour=${tourId}&user=${req.user?.id}&price=${tour.price}`, // TODO: change this to a thank you page?
    /**
     * ## @IMP: old unsecure route
     */

    // success_url: `${req.protocol}://${req.get(
    //     'host'
    // )}/?tour=${tourId}&user=${req.user.id}&price=${tour.price}`, // TODO: change this to a thank you page?
    success_url: `${req.protocol}://${req.get(
      'host'
    )}/my-bookings?alert=booking`,

    // cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,

    customer_email: req.user.email as string, // we already have the access to the user email. makes the process smoother
    /**
     * ##
     * this is the tour ID - allows to pass data about the session we are creating - we will later get access to the session object in the webhook
     * and then we want to create a new booking in the database
     * only works with deployed websites, we are using a workaround here
     * to create a new booking in the database we need the user id, tour id and price
     * we can get the user id from req.user or fetching using mail ( mail is indexed as unique )
     * this is why we are passing only the tourID
     */
    client_reference_id: tourId,

    /**
     * ## details about the product itself
     */
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: tour.name,
            description: tour.summary,
            /**
             * ## must be live images ( hosted on the internet ) only works with deployed websites
             * MUST MAKE A LIST OF THINGS TO DO BEFORE DEPLOYING
             */
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${
                tour.imageCover
              }`,
            ],
          },
        },
        adjustable_quantity: {
          enabled: true,
        },
      },
    ],
  });

  // console.log(session);
  if (session.url === null || session.url === undefined || session.url === '')
    return new AppError(
      'Something went wrong with the payment! Please try again later.',
      statusCodes.internalServerError
    );

  // console.log(session.url);

  /**
   * ## Create session as response and send it back to client
   */
  return res.status(statusCodes.ok).json({
    status: 'success',
    session,
  });
  // res.status(statusCodes.temporaryRedirect).redirect(session.url);
});

/**
 * ## OLD UNSECURE ROUTE USED BEFORE STRIPE WEBHOOKS
 */
// const createBookingCheckout = catchAsync(async (req, res, next) => {
//     /**
//      * ## @IMP: temporary! unsecure: everyone can make bookings without paying
//      */
//     const { tour: tourId, user: userId, price } = req.query;
//     if (!tourId || !userId || !price) return next();

//     await Booking.create({
//         tour: tourId,
//         user: userId,
//         price,
//     });

//     /**
//      * ## NOT SECURE
//      * it sends to the page with the unsecure url containing the query params
//      */
//     // return next();
//     res.status(statusCodes.seeOther).redirect(req.originalUrl.split('?')[0]);
// });

const webhookCheckout = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.body);

  // TODO: production changes the key: it assumes the website is live and registered for a domain
  const endpointSecret =
    SECRETS.NODE_ENV === 'production'
      ? SECRETS.NATOURS_STRIPE_ENDPOINT_SECRET_PROD
      : SECRETS.NATOURS_STRIPE_ENDPOINT_SECRET;

  // console.log(req.headers, 'headers');

  const sig = req.headers['stripe-signature'];

  // console.log(sig, 'sig');

  let event: Stripe.Event | undefined;

  try {
    if (sig && endpointSecret)
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    else throw new Error('Webhook Error: no signature');
  } catch (error: unknown) {
    if (error instanceof Error) {
      Logger.error(`Webhook Error: ${error.message}`);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }

    return;
  }

  // console.log(event, 'event');

  if (!event) {
    res.status(statusCodes.badRequest).send('Webhook Error: no event');
    return;
  }

  const eventSwitch = {
    // 'payment_intent.succeeded': () => {
    //     // const paymentIntentSucceeded = event?.data.object;
    //     // console.log(event);
    //     // Logger.info('payment_intent.succeeded');
    // },
    // 'charge.succeeded': () => {
    //     // const paymentIntentSucceeded = event?.data.object;
    //     console.log(event);
    //     // price = event.data.object.amount / 100;
    //     // missing userId and tourId

    //     Logger.info('charge.succeeded');
    // },
    'checkout.session.completed': async () => {
      // const paymentIntentSucceeded = event?.data.object;
      // console.log(event?.data.object);
      // const price = event?.data.object.amount_total / 100;
      // missing userId and tourId
      // const userId = event?.data.object
      // const tourId = event?.data.object.line_items[0].description;
      // console.log(price, userId);

      await createBookingCheckout(
        event?.data.object as Stripe.Checkout.Session
      );

      // Logger.info('checkout.session.completed');
    },
    // 'payment_intent.created': () => {
    //     // const paymentIntentCreated = event?.data.object;
    //     // Logger.info('payment_intent.created');
    // },
    default: () => {},
    // Logger.error(`Unhandled stripe webhook event type: ${event?.type}`),
  };

  if (!eventSwitch[event.type as keyof typeof eventSwitch]) {
    eventSwitch.default();
    res
      .status(statusCodes.badRequest)
      .send('Webhook Error: Unhandled event type');
    return;
  }

  await eventSwitch[event.type as keyof typeof eventSwitch]();

  // Handle the event
  // switch (event.type) {
  //     case 'payment_intent.succeeded': {
  //         const paymentIntentSucceeded = event.data.object;
  //         console.log(paymentIntentSucceeded);

  //         // Then define and call a function to handle the event payment_intent.succeeded
  //         break;
  //     }
  //     // ... handle other event types
  //     default: {
  //         console.log(`Unhandled event type ${event.type}`);
  //     }
  // }

  // Return a 200 response to acknowledge receipt of the event
  res.status(statusCodes.ok).send();
});

const getAllBookings = getAll({
  Model: Booking,
});

const getBooking = getOne({
  Model: Booking,
  idName: '',
});

const updateBooking = patchOne({
  Model: Booking,
  idName: 'bookingId',
});

const deleteBooking = deleteOne({
  Model: Booking,
  idName: 'bookingId',
});

const createBooking = createOne({
  Model: Booking,
});

export {
  createBooking,
  // createBookingCheckout,
  deleteBooking,
  getAllBookings,
  getBooking,
  getCheckoutSession,
  updateBooking,
  webhookCheckout,
};
