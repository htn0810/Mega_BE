import userController from "@controllers/userController";
import { authMiddleware } from "@middlewares/auth";
import { multerUploadMiddleware } from "@middlewares/multerUpload";
import { forgotPasswordLimiter } from "@middlewares/rateLimiter";
import userValidation from "@validations/userValidation";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all users with pagination (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.route("/").get(authMiddleware.isAuthorized, userController.getUsers);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password
 *               firstName:
 *                 type: string
 *                 description: User first name
 *               lastName:
 *                 type: string
 *                 description: User last name
 *               phone:
 *                 type: string
 *                 description: User phone number
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or email already exists
 *       500:
 *         description: Server error
 */
router
  .route("/register")
  .post(userValidation.registerOrLogin, userController.register);

/**
 * @swagger
 * /users/verify:
 *   put:
 *     summary: Verify user account
 *     description: Verify a user account with verification code
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - verificationCode
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *               verificationCode:
 *                 type: string
 *                 description: Verification code sent to user's email
 *     responses:
 *       200:
 *         description: Account verified successfully
 *       400:
 *         description: Invalid input or verification code
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router
  .route("/verify")
  .put(userValidation.verifyAccount, userController.verifyAccount);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     description: Login with email and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router
  .route("/login")
  .post(userValidation.registerOrLogin, userController.login);

/**
 * @swagger
 * /users/refresh-token:
 *   get:
 *     summary: Refresh access token
 *     description: Get a new access token using refresh token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid refresh token
 *       500:
 *         description: Server error
 */
router.route("/refresh-token").get(userController.refreshToken);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: User logout
 *     description: Logout and invalidate refresh token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router
  .route("/logout")
  .post(authMiddleware.isAuthorized, userController.logout);

/**
 * @swagger
 * /users/forgot-password:
 *   put:
 *     summary: Forgot password
 *     description: Request a password reset for a user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       404:
 *         description: User not found
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Server error
 */
router
  .route("/forgot-password")
  .put(
    forgotPasswordLimiter,
    userValidation.forgotPassword,
    userController.forgotPassword
  );

/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     summary: Update user profile
 *     description: Update a user's profile information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User first name
 *               lastName:
 *                 type: string
 *                 description: User last name
 *               phone:
 *                 type: string
 *                 description: User phone number
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: User avatar image
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router
  .route("/update/:id")
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single("avatar"),
    userValidation.update,
    userController.update
  );

/**
 * @swagger
 * /users/change-password/{id}:
 *   put:
 *     summary: Change password
 *     description: Change a user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input or current password is incorrect
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router
  .route("/change-password/:id")
  .put(
    authMiddleware.isAuthorized,
    userValidation.changePassword,
    userController.changePassword
  );

/**
 * @swagger
 * /users/update/roles/{id}:
 *   put:
 *     summary: Update user roles
 *     description: Update a user's roles (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roles
 *             properties:
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [ADMIN, USER, SELLER]
 *                 description: User roles
 *     responses:
 *       200:
 *         description: Roles updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router
  .route("/update/roles/:id")
  .put(authMiddleware.isAuthorized, userController.updateRoles);

/**
 * @swagger
 * /users/disable/{id}:
 *   put:
 *     summary: Disable user
 *     description: Disable a user account (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User disabled successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router
  .route("/disable/:id")
  .put(authMiddleware.isAuthorized, userController.disableUser);

/**
 * @swagger
 * /users/enable/{id}:
 *   put:
 *     summary: Enable user
 *     description: Enable a previously disabled user account (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User enabled successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router
  .route("/enable/:id")
  .put(authMiddleware.isAuthorized, userController.enableUser);

export const USER_ROUTER = router;
