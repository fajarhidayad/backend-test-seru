import { Router } from 'express';
import { validateBody } from './middleware/validation.middleware';
import { loginSchema, registrationSchema } from './dto/auth.dto';
import * as authRoute from '@/handler/auth.handler';
import * as adminRoute from '@/handler/admin.handler';
import { authenticated, isAdminMiddleware } from './middleware/auth.middleware';
import {
  getAllVehicleBrand,
  getAllVehicleModels,
  getAllVehicleTypes,
  getAllVehicleYears,
  getPricelists,
  getVehicleBrandById,
  getVehicleModelById,
  getVehicleTypeById,
  getVehicleYearById,
} from '@/handler/user.handler';
import {
  pricelistSchema,
  vehicleBrandSchema,
  vehicleModelSchema,
  vehicleTypeSchema,
  vehicleYearSchema,
} from './dto/vehicle.dto';

const router = Router();

const asyncHandler =
  (func: Function) =>
  (...args: any) => {
    const fnReturn = func(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch(next);
  };

/**
 * Auth routes
 * @public
 */
router.post(
  '/auth/login',
  validateBody(loginSchema),
  asyncHandler(authRoute.login)
);
router.post(
  '/auth/register',
  validateBody(registrationSchema),
  asyncHandler(authRoute.register)
);

// Authorization middleware, check bearer token before passing
router.use(authenticated);

/**
 * User routes
 * Specific only authed user
 */

router.get('/vehicle-brand', getAllVehicleBrand);
router.get('/vehicle-brand/:id', getVehicleBrandById);

router.get('/vehicle-type', getAllVehicleTypes);
router.get('/vehicle-type/:id', getVehicleTypeById);

router.get('/vehicle-model', getAllVehicleModels);
router.get('/vehicle-model/:id', getVehicleModelById);

router.get('/vehicle-year', getAllVehicleYears);
router.get('/vehicle-year/:id', getVehicleYearById);

router.get('/pricelist', getPricelists);

/**
 * ADMIN routes
 * Only admin can access it
 * @private
 */

// Middleware check for admin
router.use(isAdminMiddleware);

/**
 * GET users route
 */
router.get('/users', asyncHandler(adminRoute.getAllUsers));
router.get('/users/:id', asyncHandler(adminRoute.getUserById));

/**
 * Vehicle brand routes
 */
router.post(
  '/vehicle-brand',
  validateBody(vehicleBrandSchema),
  asyncHandler(adminRoute.createVehicleBrand)
);
router.put(
  '/vehicle-brand/:id',
  validateBody(vehicleBrandSchema),
  asyncHandler(adminRoute.updateVehicleBrand)
);
router.delete(
  '/vehicle-brand/:id',
  asyncHandler(adminRoute.deleteVehicleBrand)
);

/**
 * Vehicle type routes
 */
router.post(
  '/vehicle-type',
  validateBody(vehicleTypeSchema),
  asyncHandler(adminRoute.createVehicleType)
);
router.put(
  '/vehicle-type/:id',
  validateBody(vehicleTypeSchema),
  asyncHandler(adminRoute.updateVehicleType)
);
router.delete('/vehicle-type/:id', asyncHandler(adminRoute.deleteVehicleType));

/**
 * Vehicle model routes
 */
router.post(
  '/vehicle-model',
  validateBody(vehicleModelSchema),
  asyncHandler(adminRoute.createVehicleModel)
);
router.put(
  '/vehicle-model/:id',
  validateBody(vehicleModelSchema),
  asyncHandler(adminRoute.updateVehicleModel)
);
router.delete(
  '/vehicle-model/:id',
  asyncHandler(adminRoute.deleteVehicleModel)
);

/**
 * Vehicle year routes
 */
router.post(
  '/vehicle-year',
  validateBody(vehicleYearSchema),
  asyncHandler(adminRoute.createVehicleYear)
);
router.put(
  '/vehicle-year/:id',
  validateBody(vehicleYearSchema),
  asyncHandler(adminRoute.updateVehicleYear)
);
router.delete('/vehicle-year/:id', asyncHandler(adminRoute.deleteVehicleType));

/**
 * Pricelist routes
 */
router.post(
  '/pricelist',
  validateBody(pricelistSchema),
  asyncHandler(adminRoute.createPricelist)
);
router.put(
  '/pricelist/:id',
  validateBody(pricelistSchema),
  asyncHandler(adminRoute.updatePricelist)
);
router.delete('/pricelist/:id', asyncHandler(adminRoute.deletePricelist));

export default router;
