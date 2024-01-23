import mongoose from 'mongoose';

type IUser = Record<string, unknown>;

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'please tell us your name!'],
      trim: true,
      maxlength: [40, 'a username must be 40 or less chars'],
      minlength: [2, 'a username must be 2 or more chars'],
    },
  },
  // object for options, to show virtual properties
  {
    toJSON: {
      virtuals: true,
      /**
       * ## 2 possible ways to transform the output of JSON
       * When for exmaple we want to swap _id with id in every json output
       */
      // transform: (_document_, returnValue, options) => {
      //   delete returnValue.__v;
      //   returnValue.id = returnValue._id.toString();
      //   delete returnValue._id;
      // },
      // transform(_document_, returnValue) {
      //   // eslint-disable-next-line no-underscore-dangle, no-param-reassign
      //   delete returnValue._id;
      // },
    }, // each time we extract as JSON, we want to show virtuals
    toObject: { virtuals: true }, // show even when data is outputted as an object
  }
);

const User = mongoose.model<IUser>('User', userSchema);

export { User };
