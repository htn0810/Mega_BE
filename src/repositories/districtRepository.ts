import { GET_DB } from "@configs/database";

class DistrictRepository {
  async getDistricts() {
    try {
      const districts = await GET_DB().districts.findMany();
      return districts;
    } catch (error) {
      throw error;
    }
  }

  async getDistrictByCode(code: string) {
    try {
      const district = await GET_DB().districts.findUnique({
        where: { code },
      });
      return district;
    } catch (error) {
      throw error;
    }
  }

  async getDistrictsByProvinceCode(provinceCode: string) {
    try {
      const districts = await GET_DB().districts.findMany({
        where: { province_code: provinceCode },
      });
      return districts;
    } catch (error) {
      throw error;
    }
  }
}

const districtRepository = new DistrictRepository();
export default districtRepository;
