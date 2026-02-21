import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  GetPublicKeyOrSecret,
  JwtPayload,
  verify,
  VerifyOptions,
} from 'jsonwebtoken';
import { AccessTokenExpiredException } from '../../standards/AppErrors';

type IVerifyAccessTokenOptions = {
  getPublicKeyByKid(kid: string): Promise<string | null>;
  verifyOptions?: VerifyOptions;
};

export const verifyAccessToken = async <Decoded = JwtPayload>(
  accessToken: string,
  options: IVerifyAccessTokenOptions,
) => {
  const getKeyFromHeader: GetPublicKeyOrSecret = async (header, callback) => {
    try {
      const kid = header.kid;

      if (kid) {
        const publicKey = await options.getPublicKeyByKid(kid);

        if (publicKey) {
          callback(null, publicKey);
        } else {
          callback(new AccessTokenExpiredException());
        }
      }

      callback(
        new ForbiddenException('kid not present in the acess_token header'),
      );
    } catch (e) {
      callback(
        new InternalServerErrorException(
          'could not retrieve public key for the provided access token',
        ),
      );
    }
  };

  return new Promise<null | Decoded>((resolve, reject) => {
    verify(
      accessToken,
      getKeyFromHeader,
      { ...options.verifyOptions },
      (error, decoded) => {
        if (error) {
          reject(error);
        } else {
          resolve(<Decoded>decoded);
        }
      },
    );
  });
};

const getJwtPayloadExpiresDate = (jwtPayload: JwtPayload) => {
  if (jwtPayload.exp.toString().length === 10) {
    return new Date(jwtPayload.exp * 1000);
  } else {
    return new Date(jwtPayload.exp);
  }
};

export const getJwtPayloadExpiresInMilliseconds = (jwtPayload: JwtPayload) => {
  const now = new Date();
  const jwtPayloadExpires = getJwtPayloadExpiresDate(jwtPayload);

  return jwtPayloadExpires.getTime() - now.getTime();
};
