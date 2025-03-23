import { GET_DB } from "@configs/database";

class WardRepository {
  async getWards() {
    try {
      const wards = await GET_DB().wards.findMany();
      return wards;
    } catch (error) {
      throw error;
    }
  }

  async getWardByCode(code: string) {
    try {
      const ward = await GET_DB().wards.findUnique({
        where: { code },
      });
      return ward;
    } catch (error) {
      throw error;
    }
  }

  async getWardsByDistrictCode(districtCode: string) {
    try {
      const wards = await GET_DB().wards.findMany({
        where: { district_code: districtCode },
      });
      return wards;
    } catch (error) {
      throw error;
    }
  }
}

const wardRepository = new WardRepository();
export default wardRepository;
