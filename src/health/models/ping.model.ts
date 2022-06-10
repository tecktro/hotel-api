import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Ping {
  @Field()
  db: string;

  @Field()
  local_api: string;

  @Field()
  external_api: string;
}
