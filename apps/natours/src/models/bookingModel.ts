import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a tour!'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user!'],
    },
    price: {
      type: Number,
      required: [true, 'Booking must have a price!'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },

    /**
     * ## paid
     * @description If the booking is paid or not
     * @type {boolean} defaults to true in case an administrator wants to manually create a booking outside of stripe (store with cash)
     * we will use webhooks to update the booking to paid?
     */
    paid: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * ## No big performance overhead
 * only guides and admins will be able to see the bookings
 */
bookingSchema.pre(/^find/, function preFind(next) {
  /**
   * ## populate
   */
  // TODO: typescript remove any?
  void (this as mongoose.Query<any, any>)
    // .populate('user')
    .populate({
      path: 'tour',
      /**
       * ## this will populate with guides too:
       * in the pre find tour we add all the guides with populate
       */
      select: 'name id',
    })
    .populate({
      path: 'user',
      select: 'name email id',
    });

  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export { Booking };
