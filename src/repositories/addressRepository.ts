import { Address } from "@/types/address/address.type";
import { GET_DB } from "@configs/database";

class AddressRepository {
  async getAllAddresses(userId: number) {
    try {
      const addresses = await GET_DB().addresses.findMany({
        where: {
          userId,
        },
        include: {
          province: true,
          district: true,
          ward: true,
        },
      });
      return addresses;
    } catch (error) {
      throw error;
    }
  }

  async getAddressById(id: number) {
    try {
      const address = await GET_DB().addresses.findUnique({ where: { id } });
      return address;
    } catch (error) {
      throw error;
    }
  }

  async getDefaultAddress(userId: number) {
    try {
      const defaultAddress = await GET_DB().addresses.findFirst({
        where: { userId, isDefault: true },
        include: {
          province: true,
          district: true,
          ward: true,
        },
      });
      return defaultAddress;
    } catch (error) {
      throw error;
    }
  }
  async createAddress(userId: number, address: Address) {
    try {
      const newAddress = await GET_DB().addresses.create({
        data: {
          userId,
          name: address.name,
          phoneNumber: address.phoneNumber,
          provinceCode: address.provinceCode,
          districtCode: address.districtCode,
          wardCode: address.wardCode,
          street: address.street,
          isDefault: address.isDefault ?? false,
        },
      });
      return newAddress;
    } catch (error) {
      throw error;
    }
  }

  async updateAddress(id: number, address: Address) {
    try {
      const updatedAddress = await GET_DB().addresses.update({
        where: { id },
        data: {
          name: address.name,
          phoneNumber: address.phoneNumber,
          provinceCode: address.provinceCode,
          districtCode: address.districtCode,
          wardCode: address.wardCode,
          street: address.street,
          isDefault: address.isDefault ?? false,
        },
      });
      return updatedAddress;
    } catch (error) {
      throw error;
    }
  }

  async deleteAddressById(id: number) {
    try {
      await GET_DB().addresses.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}

const addressRepository = new AddressRepository();

export default addressRepository;
