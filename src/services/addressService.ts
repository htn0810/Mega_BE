import { Address } from "@/types/address/address.type";
import { BadRequestError } from "@exceptions/BadRequestError";
import addressRepository from "@repositories/addressRepository";
import districtRepository from "@repositories/districtRepository";
import provinceRepository from "@repositories/provinceRepository";
import userRepository from "@repositories/userRepository";
import wardRepository from "@repositories/wardRepository";

class AddressService {
  async getAllAddresses(email: string) {
    try {
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }
      const addresses = await addressRepository.getAllAddresses(user.id);
      return addresses;
    } catch (error) {
      throw error;
    }
  }

  async createAddress(email: string, address: Address) {
    try {
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      await this.checkAddress(address);

      const newAddress = await addressRepository.createAddress(
        user.id,
        address
      );
      return newAddress;
    } catch (error) {
      throw error;
    }
  }

  async getAllProvinces() {
    try {
      const provinces = await provinceRepository.getProvinces();
      return provinces;
    } catch (error) {
      throw error;
    }
  }

  async getAllDistrictsByProvinceCode(provinceCode: string) {
    try {
      const districts = await districtRepository.getDistrictsByProvinceCode(
        provinceCode
      );
      if (!districts) {
        throw new BadRequestError("Province code is invalid");
      }
      return districts;
    } catch (error) {
      throw error;
    }
  }

  async getAllWardsByDistrictCode(districtCode: string) {
    try {
      const wards = await wardRepository.getWardsByDistrictCode(districtCode);
      if (!wards) {
        throw new BadRequestError("District code is invalid");
      }
      return wards;
    } catch (error) {
      throw error;
    }
  }

  async updateAddress(id: number, address: Address) {
    try {
      await this.checkAddress(address);
      const updatedAddress = await addressRepository.updateAddress(id, address);
      return updatedAddress;
    } catch (error) {
      throw error;
    }
  }

  async deleteAddress(id: number) {
    try {
      const address = await addressRepository.getAddressById(id);
      if (!address) {
        throw new BadRequestError("Address not found");
      }
      await addressRepository.deleteAddressById(id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  private async checkAddress(address: Address) {
    // Check if province code is valid
    const province = await provinceRepository.getProvinceByCode(
      address.provinceCode
    );
    if (!province) {
      throw new BadRequestError("Province code is invalid");
    }

    // Check if district code is valid and belongs to the province
    const districts = await districtRepository.getDistrictByCode(
      address.districtCode
    );
    if (!districts) {
      throw new BadRequestError("District code is invalid");
    }
    if (districts.province_code !== address.provinceCode) {
      throw new BadRequestError("District code is invalid");
    }

    // Check if ward code is valid and belongs to the district
    const wards = await wardRepository.getWardByCode(address.wardCode);
    if (!wards) {
      throw new BadRequestError("Ward code is invalid");
    }
    if (wards.district_code !== address.districtCode) {
      throw new BadRequestError("Ward code is invalid");
    }
  }
}

const addressService = new AddressService();

export default addressService;
