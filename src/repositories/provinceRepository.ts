import { GET_DB } from "@configs/database";

class ProvinceRepository {
  async getProvinces() {
    try {
      const provinces = await GET_DB().provinces.findMany();
      return provinces;
    } catch (error) {
      throw error;
    }
  }

  async getProvinceByCode(code: string) {
    try {
      const province = await GET_DB().provinces.findUnique({
        where: { code },
      });
      return province;
    } catch (error) {
      throw error;
    }
  }
}

const provinceRepository = new ProvinceRepository();
export default provinceRepository;
