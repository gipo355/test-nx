/* eslint-disable no-underscore-dangle */
import type { Model } from 'mongoose';
import mongoose from 'mongoose';
import isAscii from 'validator/lib/isAscii';

import { Logger } from '../loggers';
import { Tour } from './tourModel';

type IReview = Record<string, any>;
interface ReviewModel extends Model<IReview> {
  calcAverageRatings(): any;
}

/**
 * ## we want
 * review
 * rating
 * createdAt
 * ref to tour
 * ref to user
 */

/**
 * ## IMP: validators only work on save/create, not update. When saving, can also skip validators as a prop
 */

const ReviewSchema = new mongoose.Schema<IReview, ReviewModel>(
  {
    review: {
      type: String,
      validate: [
        isAscii,
        'Incorrect input, insert only valid ASCII characters',
      ],
      required: [true, 'Review cannot be empty'],
      trim: true,
    },
    rating: {
      type: Number,
      trim: true,
      // validate: [isNumeric, 'Rating must be a number'], // doesn't work, expects a string
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      /**
       * ## we don't want to make createdAt modifiable, but we can't use immutable else not even admins can update it
       * the below code does't work because the doc doeos't have roles, but it would work in the userModel
       */
      // immutable: (document) => document.role !== 'Admin', // if you try to update the field, it will throw an error and reject the modification
    },
    lastUpdatedAt: Date,
    /**
     * ## Implementing parent referencing
     */
    tour: {
      type: mongoose.Schema.Types.ObjectId, // this will ensure that the id is a valid mongo id
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // this will ensure that the id is a valid mongo id
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    active: {
      type: Boolean,
      default: true,
      select: false, // hide in the output
    },
    deletedAt: {
      type: Date,
      select: false,
    },
  },
  /**
   * ## options
   */
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * ## INDEX COMPOUND UNIQUE
 * a tour can only have one review per user
 * each combination of tour and user must be unique
 */
ReviewSchema.index({ tour: 1, user: 1 }, { unique: true });

/**
 * ## STATIC METHODS
 * calc average rating on a tour
 * @sideEffect: save the average rating on the tour
 */
ReviewSchema.statics.calcAverageRatings = async function calcAverageRatings(
  tourId: string | mongoose.Types.ObjectId
) {
  /**
   * ## use the aggregation pipeline to calculate the average rating
   */
  // the this keyword points to the current model in a static method
  const [stats] = await this.aggregate([
    /**
     * ## step 1: select all the reviews that belong to the current tour
     * match stage
     */
    {
      $match: { tour: tourId },
    },
    /**
     * ## stage 2: calculate the statistics
     * group stage
     */
    {
      $group: {
        _id: '$tour', // group by tourId, always start with id. the common field al docs have in common is the tour. remember the review has the tour field
        ratingsQuantity: { $sum: 1 }, // add 1 for each review on the on every same tour group
        ratingsAverage: { $avg: '$rating' }, // calculate the average for the rating field
      },
    },
  ]);
  // console.log(stats);

  await (stats.ratingsQuantity > 0
    ? Tour.findOneAndUpdate({ _id: stats._id }, stats)
    : Tour.findOneAndUpdate(
        { _id: stats._id },
        {
          ratingsQuantity: 0,
          ratingsAverage: 4.5,
        }
      ));
};

ReviewSchema.post(
  'save',
  function postSaveCalcAverageRating(_document: any, next: any) {
    // console.log('postSave hook calc avg');

    /**
     * ## in a middleware, this points to the current document ( current review )
     *
     * we can't use Review here. it's not defined yet
     * we will use constructor which is the prototype of the current model from which the document was created
     */

    // hacky way to fix prop doesn't exist on type Function
    const model = this.constructor;
    model.calcAverageRatings(this.tour);
    next();
  }
);

/**
 * ## update Review date when the review is modified
 * IMP: REMEMBER THIS DOESN'T WORK WITH UPDATE, WE NEED TO SAVE THE DOC
 */
ReviewSchema.pre('save', function preSaveUpdateReviewDate(next: any) {
  if (this.isNew) return next();
  /**
   * ## both review and rating are required, so if one is modified, it will update
   */
  if (!this.isModified('review') && !this.isModified('rating')) return next();
  this.lastUpdatedAt = Date.now();
  next();
});

/**
 * ## set deletedAt to current date
 * doesn't work with updates
 */
ReviewSchema.pre('save', function preSaveSetDeletedAt(next: any) {
  try {
    if (!this.isNew && this.active === true && this.isModified('active')) {
      this.deletedAt = new Date().toISOString();
    }

    next();
  } catch (error) {
    Logger.error(error);
    return next(error);
  }
});

// not just find, any query that starts with find
// use function or this won't be pointing to the correct object
ReviewSchema.pre(/^find/, function preFindHideNotActive(next: any) {
  // console.log('preFindHideNotActive');
  // this points to the current query

  // can also select: false directly in the model properties to prevent showing it
  // void this.select('-password -passwordConfirm'); // this will prevent finding it to comparePassword

  // find only docs with active = true
  // in this case, revert it as previous users didn't have the default

  // eslint-disable-next-line no-void
  void this.find({ active: { $ne: false } });

  next();
});

/**
 * ## Populate fields
 * regex to match find strings (find, findOne, findById, etc)
 */
ReviewSchema.pre(/^find/, function preFindPopulateFields(next: any) {
  // console.log('preFindPopulateFields');
  // eslint-disable-next-line no-void
  void (this.populate as any)({
    path: 'user',
    // jonas wants only the name
    select: [
      'name',
      'photo',
      // 'role',
      // 'email',
      // 'id',
    ], // note we can even use arrays
  });
  /*******************************
  * jonas turns the populate tour off to prevent circular reference
  /*******************************/

  // .populate({
  //   path: 'tour',
  //   // select: '-__v -passwordChangedAt', // exclude fields
  //   select: 'name', // exclude fields, we don't want to leak the email
  // });
  next();
});

/**
 * ## replicating the calcaverageRatings function on update and deleted
 * we need to target findOneAndUpdate and findOneAndDelete
 * the this keyword points to the current query
 * to access the current document, we need to use this.findOne()
 */
ReviewSchema.pre(/^findOneAnd/, function preFindOneAnd(next: any) {
  // console.log('preFindOneAnd');
  next();
});
/**
 * ## here we continue with the calcAverageRatings function on update and deleted
 * we need to use POST to calculate the average after the query has finished and data is updated
 */
// BUG: below post hook doesn't trigger after deleteOne.ts findByIdAndDelete
ReviewSchema.post(/^findOneAnd/, function postFindOneAnd() {
  // console.log('postFindOneAnd');
});
const Review = mongoose.model('Review', ReviewSchema);

export { Review };
