import addressController from "@controllers/addressController";
import { authMiddleware } from "@middlewares/auth";
import addressValidation from "@validations/addressValidation";
import { Router } from "express";

const router = Router();

router
  .route("/")
  .get(authMiddleware.isAuthorized, addressController.getAllAddresses)
  .post(
    authMiddleware.isAuthorized,
    addressValidation.createUpdateAddress,
    addressController.createAddress
  );

router
  .route("/:id")
  .put(
    authMiddleware.isAuthorized,
    addressValidation.createUpdateAddress,
    addressController.updateAddress
  )
  .delete(authMiddleware.isAuthorized, addressController.deleteAddress);

router
  .route("/provinces")
  .get(authMiddleware.isAuthorized, addressController.getAllProvinces);

router
  .route("/provinces/:provinceCode/districts")
  .get(
    authMiddleware.isAuthorized,
    addressController.getAllDistrictsByProvinceCode
  );

router
  .route("/provinces/:provinceCode/districts/:districtCode/wards")
  .get(
    authMiddleware.isAuthorized,
    addressController.getAllWardsByDistrictCode
  );

export const ADDRESS_ROUTER = router;
