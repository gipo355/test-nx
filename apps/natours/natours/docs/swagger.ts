/**
 * ## THIS FILE IS A SCRIPT TO BE USED WITH PNPM GENERATE-DOCS COMMAND
 * it will output the swagger.json file in the same dir
 */
/* eslint-disable unicorn/prefer-top-level-await */
// import { writeFile } from 'node:fs/promises';
// import path from 'node:path';

// import { Express, Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-import
import swaggerJSDoc from 'swagger-jsdoc';

// import swaggerUi from 'swagger-ui-express';
import { CURRENT_API_VERSION } from '../src/config';
// import { Logger } from '../loggers';

// const {
//     // WORKER_POOL_ENABLED = 0,
//     PORT = 8000, // set default
//     HOST = '127.0.0.1', // set default
// } = process.env;

// const apiPath = path.join(__dirname, 'main.js');
// console.log(apiPath, 'apipath');

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    servers: [
      {
        url: `https://natours.gipo.dev/api/${CURRENT_API_VERSION}`,
        description: 'development server',
      },
    ],
    info: {
      title: 'Natours API docs',
      version: CURRENT_API_VERSION,
      description: 'This is a simple API',
      contact: {
        email: 'you@your-company.com',
      },
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
      termsOfService: '/terms-of-use',
    },
    tags: [
      { name: 'tours', description: 'handle tours' },
      {
        name: 'users',
        description: 'handle users',
      },
      {
        name: 'reviews',
        description: 'handle reviews',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        UpdateReviewRequestBody: {
          type: 'object',
          properties: {
            review: {
              type: 'string',
            },
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
            },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            user: {
              type: 'string',
            },
            price: {
              type: 'number',
            },
            tour: {
              type: 'string',
            },
          },
        },
        createReviewRequestBody: {
          type: 'object',
          properties: {
            review: {
              type: 'string',
            },
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
            },
            tour: {
              type: 'string',
              description: 'tour id',
            },
          },
        },

        SuccessResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
          },
        },
        TokenGenerated: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
            },
            token: {
              type: 'string',
            },
            'x-csrf-token': {
              type: 'string',
            },
          },
        },
        NewUserSchema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            data: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
              },
            },
            token: {
              type: 'string',
            },
            'x-csrf-token': {
              type: 'string',
            },
          },
        },
        GetReviews: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            results: {
              type: 'number',
              example: '4',
            },
            data: {
              type: 'object',
              properties: {
                reviews: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Review',
                  },
                },
              },
            },
          },
        },
        GetReview: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            data: {
              type: 'object',
              properties: {
                review: {
                  type: 'object',
                  $ref: '#/components/schemas/Review',
                },
              },
            },
          },
        },
        Review: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'reviewId',
            },
            review: {
              type: 'string',
            },
            tour: {
              type: 'string',
              example: 'tourId',
            },
            user: {
              type: 'string',
              example: 'userId',
            },
            createdAt: {
              type: 'string',
              example: '2021-08-01T12:00:00.000Z',
            },
            lastUpdatedAt: {
              oneOf: [
                {
                  type: 'string',
                },
                {
                  type: 'undefined',
                },
              ],
              example: '2021-08-01T12:00:00.000Z || undefined',
            },
            rating: {
              type: 'number',
              example: 4.5,
              minimum: 1,
              maximum: 5,
            },
          },
        },
      },
    },
    // security: [
    //     {
    //         bearerAuth: [],
    //     },
    // ],
  },
  // apis: SWAGGER_JSDOC_PATHS,
  // apis: [apiPath],
  apis: [
    './src/routes/api/v1/*.ts',
    './src/app.ts',
    './src/models/*.ts',
    './src/controllers/api/v1/*.ts',
    './src/middleware/*.ts',
    './src/controllers/**/*.ts',
  ],
};

export const swaggerSpec = swaggerJSDoc(options);

/**
 * uncomment this only if you want to generate external swaggerdocs
 */
// eslint-disable-next-line security/detect-non-literal-fs-filename
// writeFile(
//     // eslint-disable-next-line unicorn/prefer-module
//     path.join(__dirname, 'swagger-output.json'),
//     JSON.stringify(swaggerSpec),
//     'utf8'
// ).catch((error) => console.error(error));

// export const swaggerDocumentation = (app: Express) => {
//     // swagger page
//     app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//     // docs in json format
//     app.get('/docs.json', (_req: Request, res: Response) => {
//         res.status(200).json(swaggerSpec);
//     });

//     console.log(swaggerSpec, 'swaggerspec');

//     Logger.info(`docs running on ${HOST}:${PORT}/[docs|docs.json] ...`);
// };

// export { swaggerSpec };
