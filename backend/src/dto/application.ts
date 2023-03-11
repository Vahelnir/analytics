import { Application } from "../model/Application";

export type ApplicationDto = {
  id: string;
  name: string;
  token: string;
  urls: string[];
};

export function applicationToDto({
  _id,
  token,
  name,
  urls,
}: Application): ApplicationDto {
  return { id: _id.toString(), token, name, urls };
}
