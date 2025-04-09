import addressController from "@controllers/addressController";
import { authMiddleware } from "@middlewares/auth";
import addressValidation from "@validations/addressValidation";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: Get all addresses
 *     description: Retrieve all addresses for the authenticated user
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 addresses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new address
 *     description: Add a new address for the authenticated user
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressInput'
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router
  .route("/")
  .get(authMiddleware.isAuthorized, addressController.getAllAddresses)
  .post(
    authMiddleware.isAuthorized,
    addressValidation.createUpdateAddress,
    addressController.createAddress
  );

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     summary: Update an address
 *     description: Update an existing address by ID
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressInput'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete an address
 *     description: Delete an existing address by ID
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router
  .route("/:id")
  .put(
    authMiddleware.isAuthorized,
    addressValidation.createUpdateAddress,
    addressController.updateAddress
  )
  .delete(authMiddleware.isAuthorized, addressController.deleteAddress);

/**
 * @swagger
 * /addresses/provinces:
 *   get:
 *     summary: Get all provinces
 *     description: Retrieve all available provinces
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of provinces retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 provinces:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                       name:
 *                         type: string
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router
  .route("/provinces")
  .get(authMiddleware.isAuthorized, addressController.getAllProvinces);

/**
 * @swagger
 * /addresses/provinces/{provinceCode}/districts:
 *   get:
 *     summary: Get districts by province code
 *     description: Retrieve all districts for a specific province
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: provinceCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Province code
 *     responses:
 *       200:
 *         description: List of districts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 districts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                       name:
 *                         type: string
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Province not found
 *       500:
 *         description: Server error
 */
router
  .route("/provinces/:provinceCode/districts")
  .get(
    authMiddleware.isAuthorized,
    addressController.getAllDistrictsByProvinceCode
  );

/**
 * @swagger
 * /addresses/provinces/{provinceCode}/districts/{districtCode}/wards:
 *   get:
 *     summary: Get wards by district code
 *     description: Retrieve all wards for a specific district
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: provinceCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Province code
 *       - in: path
 *         name: districtCode
 *         required: true
 *         schema:
 *           type: string
 *         description: District code
 *     responses:
 *       200:
 *         description: List of wards retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 wards:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                       name:
 *                         type: string
 *       401:
 *         description: Not authorized
 *       404:
 *         description: District not found
 *       500:
 *         description: Server error
 */
router
  .route("/provinces/:provinceCode/districts/:districtCode/wards")
  .get(
    authMiddleware.isAuthorized,
    addressController.getAllWardsByDistrictCode
  );

export const ADDRESS_ROUTER = router;
