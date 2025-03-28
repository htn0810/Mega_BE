import addressService from "@services/addressService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

class AddressController {
  async getAllAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email } = req.jwtUser as JwtPayload;
      const addresses = await addressService.getAllAddresses(email);
      res.status(StatusCodes.OK).json({
        message: "Addresses fetched successfully",
        data: addresses,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email } = req.jwtUser as JwtPayload;
      const address = await addressService.createAddress(email, req.body);
      res.status(StatusCodes.CREATED).json({
        message: "Address created successfully",
        data: address,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllProvinces(req: Request, res: Response, next: NextFunction) {
    try {
      const provinces = await addressService.getAllProvinces();
      res.status(StatusCodes.OK).json({
        message: "Get all provinces successfully",
        data: provinces,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllDistrictsByProvinceCode(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { provinceCode } = req.params;
      const districts = await addressService.getAllDistrictsByProvinceCode(
        provinceCode
      );
      res.status(StatusCodes.OK).json({
        message: "Get all districts by province code successfully",
        data: districts,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllWardsByDistrictCode(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { districtCode } = req.params;
      const wards = await addressService.getAllWardsByDistrictCode(
        districtCode
      );
      res.status(StatusCodes.OK).json({
        message: "Get all wards by district code successfully",
        data: wards,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, email } = req.jwtUser as JwtPayload;
      const address = await addressService.updateAddress(
        email,
        parseInt(id),
        req.body
      );
      res.status(StatusCodes.OK).json({
        message: "Address updated successfully",
        data: address,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await addressService.deleteAddress(parseInt(id));
      res.status(StatusCodes.OK).json({
        message: "Address deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

const addressController = new AddressController();

export default addressController;
