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
} from '@/handler/user.handler';
import { vehicleBrandSchema } from './dto/vehicle.dto';

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
router.get('/vehicle-type/:id', () => {});

router.get('/vehicle-model', getAllVehicleModels);
router.get('/vehicle-model/:id', () => {});

router.get('/vehicle-year', getAllVehicleYears);
router.get('/vehicle-year/:id', () => {});

router.get('/pricelist', getPricelists);

/**
 * ADMIN routes
 * Only admin can access it
 * @private
 */

// Middleware check for admin
router.use(isAdminMiddleware);

router.get('/users', asyncHandler(adminRoute.getAllUsers));
router.get('/users/:id', asyncHandler(adminRoute.getUserById));

router.post(
  '/vehicle-brand',
  validateBody(vehicleBrandSchema),
  asyncHandler(adminRoute.createVehicleBrand)
);
router.put('/vehicle-brand/:id', () => {});
router.delete('/vehicle-brand/:id', () => {});

router.post('/vehicle-type', () => {});
router.put('/vehicle-type/:id', () => {});
router.delete('/vehicle-type/:id', () => {});

router.post('/vehicle-model', () => {});
router.put('/vehicle-model/:id', () => {});
router.delete('/vehicle-model/:id', () => {});

router.post('/vehicle-year', () => {});
router.put('/vehicle-year/:id', () => {});
router.delete('/vehicle-year/:id', () => {});

router.post('/pricelist', () => {});
router.put('/pricelist/:id', () => {});
router.delete('/pricelist/:id', () => {});

export default router;
