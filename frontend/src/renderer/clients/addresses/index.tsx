import { AddressesSort } from '../../enums';
import { AddressEntity, PaginatedAddressesResponse, PostAddressEntity, UpdateAddressEntity } from '../../dto';
import { axiosInstance } from '../instance';
import { BaseClient } from '../base.client';

const BASE_URL = 'http://0.0.0.0:3000/api/v1';
const PATH_PART = `addresses`;

class AddressesClient extends BaseClient<
  AddressEntity,
  AddressesSort,
  PaginatedAddressesResponse,
  PostAddressEntity,
  UpdateAddressEntity
> {}

export default new AddressesClient(axiosInstance, BASE_URL, PATH_PART);
