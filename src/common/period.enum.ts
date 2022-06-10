import { registerEnumType } from '@nestjs/graphql';

export enum PERIOD {
  DAYS_30 = 'DAYS_30',
  DAYS_60 = 'DAYS_60',
  DAYS_90 = 'DAYS_90',
}

registerEnumType(PERIOD, {
  name: 'PERIOD',
  description: 'Periods available',
  valuesMap: {
    DAYS_30: {
      description: '30 days period',
    },
    DAYS_60: {
      description: '60 days period',
    },
    DAYS_90: {
      description: '90 days period',
    },
  },
});
