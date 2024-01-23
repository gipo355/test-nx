import { type Static, Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export const AccessTokenPayloadSchema = Type.Object(
  {
    id: Type.String(),
    role: Type.String(),
    email: Type.String(),
  },
  {
    $id: 'AccessTokenPayloadSchema',
  }
);

export type TAccessTokenPayload = Static<typeof AccessTokenPayloadSchema>;

export const CompiledAccessTokenPayloadSchema = TypeCompiler.Compile(
  AccessTokenPayloadSchema
);
