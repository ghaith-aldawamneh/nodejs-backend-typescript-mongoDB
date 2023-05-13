import ApiKey, { ApiKeyModel } from '../model/ApiKey';

async function findByKey(key: string): Promise<ApiKey | null | undefined> {
  return ApiKeyModel.findOne({ key: key, status: true }).lean().exec();
}
//findById<ResultDoc >
export default {
  findByKey,
};
