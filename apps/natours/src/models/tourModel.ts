import mongoose from 'mongoose';
import slugify from 'slugify';

import { Logger } from '../loggers';

// import { User } from './userModel';
// import isAlpha from 'validator/lib/isAlpha';

type ITour = Record<string, any>;
// ! CREATE SCHEMA ( Document )
// all the required fields are the ones that appear in the overview page.
const tourSchema = new mongoose.Schema<ITour>(
  {
    name: {
      type: String,
      required: [true, 'a tour must have a name'], // validator ( used to validate data )
      unique: true,
      trim: true,
      maxlength: [40, 'a tour must be 40 or less characters'],
      minlength: [10, 'a tour must be 10 or more characters'],
      // validate: [isAlpha, 'name must be letters only'], // pass the function to run on creation
      // validate: {
      //     // this is the same as above
      //     validator: isAlpha,
      //     message: 'name must be letters only', // pass the function to run on creation
      // },
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'a tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'a tour must have a difficulty'],
      enum: {
        // allow only selection
        values: ['easy', 'medium', 'difficult'],
        message: 'easy medium or difficult only',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5, // default value, will automatically be set if not specified
      // no required for ratings, it's not the user who specifies the values
      min: [1, 'rating between 1 and 5'],
      max: [5, 'rating between 1 and 5'],
      /**
       * ## setter function that runs each time a value is set for this field
       */
      set: (value: number) => Math.round(value * 10) / 10, // 4.6666, 46.666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'a tour must have a price'], // error, message
    },
    priceDiscount: {
      type: Number,
      // ! validate doesn't work on update ( this points to doc only for create )
      validate: {
        validator: function validate(value: number) {
          // ! this only points to new doc on creating a document, not on updating
          const { price } = this as any;
          return value < price;
        },
        message: "discount ({VALUE}) can't be higher than original price",
      },
    },
    summary: {
      type: String,
      trim: true, // trim only works for strings, remove all white space in beginning and end
      required: [true, 'a tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String, // only name or URL of the image, we store images in the server or in a cdn: a reference to the image
      // it is possible to store images ina db but never a good idea
      // we can create a server with routes to images or using the public method from express (what cdns do)
      required: [true, 'a tour must have a cover image'],
    },
    images: [String], // array with number of strings ( typescript similar )
    createdAt: {
      type: Date, // date is a js builtin datatype
      default: Date.now(), // sets default on creation, immediatly converted to date string to be created
      select: false,
    },
    // mongo will try to parse the string as date
    // can specify date hour, unix timestamp (millisec, ISO)
    startDates: [Date], // different dates for the same tour are different instances of hte same tour starting in diff dates
    secretTour: {
      type: Boolean,
      default: false,
    },

    /**
     * ## EMBEDDING DOCUMENTS
     * lessons on modelliing data
     */
    startLocation: {
      // geoJSON: special data format
      // this is an embedded object, we can specify a couple of props
      // to tell mongoose that this is a geoJSON object
      type: {
        type: String,
        default: 'Point', // can be point, line, polygon
        enum: ['Point'], // array of all possible options. we only want it to be point
      },
      coordinates: [Number], // array of numbers - longitude, latitude ORDER!! it's different in google maps, ususal order is lat, long
      address: String,
      description: String,
    },
    locations: [
      {
        // array of embedded objects
        type: {
          type: String,
          default: 'Point', // can be point, line, polygon
          enum: ['Point'], // array of all possible options. we only want it to be point
        },
        coordinates: [Number], // array of numbers - longitude, latitude ORDER!! it's different in google maps
        address: String,
        description: String,
        day: Number, // day of the tour
      },
    ],
    /**
     * ## EMBEDDING USERS, CHILD REFERENCE
     */
    // guides: Array,
    /**
     * ## REFERENCING USERS, CHILD REFERENCE
     */
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId, // array of object ids. we expect an array of user ids
        ref: 'User', // reference to the model we want to use
      },
    ],

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
  // object for options, to show virtual properties
  {
    toJSON: { virtuals: true }, // each time we extract as JSON, we want to show virtuals
    toObject: { virtuals: true }, // show even when data is outputted as an object
  }
);

tourSchema.index({
  price: 1,
  ratingsAverage: -1,
}); // 1 for ascending, -1 for descending

tourSchema.index({ slug: 1 }); // index for the slug

/**
 * ## index for geospatial data, needs to be a 2d sphere index if it describes real points on the earth like sphere
 * also use 2dindex for fictional points on a simple two dimensional plane
 */
tourSchema.index({ startLocation: '2dsphere' }); // index for geospatial data

// ! virtual properties
// get is for everytime we get data out of the database
tourSchema.virtual('durationWeeks').get(function getDurationWeeks() {
  return this.duration / 7;
});

/**
 * ## VIRTUAL POPULATE: adding bookings
 */
tourSchema.virtual('bookings', {
  ref: 'Booking',
  foreignField: 'tour',
  localField: '_id',
});

/**
 * ## VIRTUAL POPULATE
 */
// create virtual property reviews
tourSchema.virtual('reviews', {
  // connect the two models
  ref: 'Review',
  // create the connection between the fields: linking
  // foreign field(key) and local field
  foreignField: 'tour', // name of the field in the other model, the tour is the ID of the tour it's referencing (basically the Review.tourID)
  localField: '_id', // where the ID is stored in this model, name of the field in this model, the _id of the current tour, basically teh Tour._id
});

// ! doccument middleware
// creating a slug for each document
tourSchema.pre('save', function preSaveSlugify(next: any) {
  // run before we save on db. runs before .save() and .create() but not on .insertMany(), not on find, not on update
  // console.log(this); // the this is pointing to the currently processed document ( as a js object )
  this.slug = slugify(this.name, { lower: true });
  // we don't have any slug in our schema, it won't show, create in schema
  next();
});
// can have multiple hooks for pre

/**
 * ## set deletedAt to current date
 * doesn't work with updates
 */
tourSchema.pre('save', function preSaveUpdateDeletedAt(next: any) {
  try {
    if (!this.isNew && this.active === true && this.isModified('active')) {
      this.deletedAt = new Date().toISOString();
    }

    return next();
  } catch (error) {
    Logger.error(error);
    return next(error);
  }
});

/**
 * ## embed users in tours
 * PRE NORMALIZATION EXAMPLE
 */
// tourSchema.pre('save', async function preHook(next: any) {
//   try {
//     // make an array of promises
//     const guidesPromises = this.guides.map(async (id: any) => {
//       const user = await User.findById(id);
//       // what if one user doesn't exist?
//       // user is not a promise, it's awaited
//       return user;
//     });
//     // wait for all promises to resolve because the map returns an array of promises to be resolved
//     // what if one of the promises fails?
//     const guides = await Promise.all(guidesPromises);
//     this.guides = guides;

//     next();
//   } catch (error) {
//     // do we want to throw an error?
//     next(error);
//   }
// });

// tourSchema.post('save', function postHook(document: any, next: any) {
//     // executed after pre middleware and save.
//     // no this keyword
//     // doc is the saved document
//     console.log(document);

//     next();
// });

// ! query middleware

// not just find, any query that starts with find
// use function or this won't be pointing to the correct object
tourSchema.pre(/^find/, function preFindFilterNotActive(next: any) {
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
 * ## query middleware to populate guides in tours when a query happens on the tour model. replace guides ID array with real data
 * this middleware will run before any find query
 * in the query middleware, this points to the current query
 */
tourSchema.pre(/^find/, function preFindPopulateGuides(next: any) {
  // can't await here or it will execute the query
  // eslint-disable-next-line no-void
  void (this.populate as any)({
    path: 'guides',
    select: '-__v -passwordChangedAt +role', // exclude fields
  });
  next();
});

// tourSchema.pre('find', function prequery(next: any) {
tourSchema.pre(/^find/, function preFindHideSecretTours(next: any) {
  // this.start = Date.now();
  // this will point at current query, not current document
  // filtering out the secretTour when a query is called
  // ! this doesn't work for findOne, specify for findOne to
  // eslint-disable-next-line no-void
  void this.find({ secretTour: { $ne: true } }); // this chains the find
  // eslint-disable-next-line no-void
  void this.select('-secretTour');
  next();
});

// ! aggregation middleware
tourSchema.pre('aggregate', function preAgg(next: any) {
  // this is the current aggregation object
  /**
   * ## we want to have [...,{ $geoNear }, ...] as the first stage in the pipeline
   */

  /**
   * ## solution 1
   */
  // const pipeline = this.pipeline();
  // const hasPipelineGeonar = pipeline.some(
  //   (stage: any) => stage.$geoNear !== undefined
  // );
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  /**
   * ## try making a reduce function, if array of stages has geonear, move at the beginning
   * creates new array, has to substitute the old one
   */
  /**
   * ## solution 2, reduce
   */
  // eslint-disable-next-line unicorn/no-array-reduce
  // pipeline = pipeline.reduce(
  //   (accumulator: any, stage: any, _index: number, _arr: any) => {
  //     if (stage.$geoNear === undefined) {
  //       accumulator.push(stage);
  //     } else {
  //       // remove from array
  //       accumulator.unshift(stage);
  //       // add to beginning
  //       // arr.unshift(stage);
  //     }

  //     return accumulator;
  //   },
  //   []
  // );

  /**
   * ## solution 3: foreach simplest solution to move $geoNear to the beginning of the pipeline if it exists
   * side effect, modifies the original array
   */
  // eslint-disable-next-line unicorn/no-array-for-each
  this.pipeline().forEach((stage: any, index: number) => {
    if (stage.$geoNear !== undefined) {
      /**
       * ## mutates the array, removes the element at index and returns stores it in a variable
       */
      const [geoNear] = this.pipeline().splice(index, 1);
      /**
       * ## unshift adds the element at the beginning of the array
       */
      this.pipeline().unshift(geoNear);
    }
  });

  /**
   * ## solution 3, for of
   * side effect, modifies the original array
   */
  // console.log(this.pipeline().entries());
  // for (const [index, stage] of this.pipeline().entries()) {
  //   console.log(index, stage);
  //   if (stage.$geoNear !== undefined) {
  //     this.pipeline().unshift(stage);
  //     this.pipeline().splice(index, 1);
  //   }
  // }
  next();
});

// post query middleware find
// tourSchema.post(/^find/, function postHook(_documents: any, next: any) {
//     // will happen after documents are returned
//     // docs are all docs returned
//     // calc how log it takes to execute the current query
//     // set a prop in the pre

//     next();
// });

// ! CREATE MODEL ( collection ) on which the documents are created on
const Tour = mongoose.model<ITour>('Tour', tourSchema);

export { Tour };
