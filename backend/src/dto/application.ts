import { Application } from "../model/Application";

export type ApplicationDto = {
  id: string;
  name: string;
  token: string;
  domain: string;
};

export function applicationToDto(application: Application): ApplicationDto;
export function applicationToDto(
  application: Application | null
): ApplicationDto | null;
export function applicationToDto(
  application: Application | null
): ApplicationDto | null {
  if (!application) {
    return null;
  }
  const { _id, token, name, domain } = application;
  return { id: _id.toString(), token, name, domain };
}
