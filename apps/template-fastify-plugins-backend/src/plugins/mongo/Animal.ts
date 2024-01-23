import mongoose from 'mongoose';

interface IAnimal extends mongoose.Document {
  name: string;
  origin?: string;
}

// TODO: how to decorate fastify with mongoose so that we can call fastify.mongo.Animal?

const animalSchema = new mongoose.Schema<IAnimal>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
    },
    origin: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);

animalSchema.on('error', (err) => {
  console.error(err, 'this is a mongoose error');
});

const Animal = mongoose.model('Animal', animalSchema);

export { Animal };
