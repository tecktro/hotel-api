import { registerEnumType } from '@nestjs/graphql';

export enum ROOM_TYPE {
  BUSINESS = 'business',
  RESIDENTIAL = 'residential',
}

registerEnumType(ROOM_TYPE, {
  name: 'ROOM_TYPE',
  description: 'Rooms Type Available',
  valuesMap: {
    BUSINESS: {
      description: 'Business room type',
    },
    RESIDENTIAL: {
      description: 'Residential room type',
    },
  },
});
