import { and, count, eq } from 'drizzle-orm';
import type { NextFunction, Request, Response } from 'express';
import { db } from '../db';
import {
  pricelist,
  user,
  vehicleBrand,
  vehicleModel,
  vehicleType,
  vehicleYear,
} from '../db/schema';

type APIResponse = {
  total: number;
  limit: number;
  skip: number;
  data: any;
};

function response(res: APIResponse) {
  return res;
}

/**
 * Get users record
 * @param req
 * @param res
 * @param next
 * @returns All users record
 */
export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const limit = 10;
  const offset = 0;
  const users = await db
    .select()
    .from(user)
    .where(eq(user.isAdmin, false))
    .limit(limit)
    .offset(offset);

  const countUser = await db
    .select({ count: count() })
    .from(user)
    .where(eq(user.isAdmin, false));

  return res.json(
    response({
      data: users,
      limit: limit,
      skip: offset,
      total: countUser[0].count,
    })
  );
}

/**
 * Get user details by id
 * @param req
 * @param res
 * @param next
 * @returns one record of user
 */
export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);
  const userInfo = await db.select().from(user).where(eq(user.id, id));

  if (userInfo.length < 1) {
    req.statusCode = 404;
    next(new Error('Record not found'));
    return;
  }

  return res.json({
    data: userInfo[0],
  });
}

export async function createVehicleBrand(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const name = req.body.name as string;

  const brand = await db
    .select()
    .from(vehicleBrand)
    .where(eq(vehicleBrand.name, name.toLowerCase()))
    .limit(1);

  if (brand.length > 0) {
    req.statusCode = 400;
    next(new Error(`Brand '${name}' is already registered`));
    return;
  }

  const newBrand = await db
    .insert(vehicleBrand)
    .values({
      name: name.toLowerCase(),
    })
    .returning();

  return res.status(201).json({
    message: 'success add new brand',
    data: newBrand[0],
  });
}

export async function updateVehicleBrand(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);
  const name = req.body.name as string;

  const brand = await db
    .select()
    .from(vehicleBrand)
    .where(eq(vehicleBrand.id, id))
    .limit(1);

  if (brand.length < 1) {
    req.statusCode = 404;
    next(new Error(`record not found`));
    return;
  }

  const brandName = await db
    .select()
    .from(vehicleBrand)
    .where(eq(vehicleBrand.name, name.toLowerCase()))
    .limit(1);

  if (brandName.length > 0) {
    req.statusCode = 400;
    next(new Error(`Brand ${name} already registered`));
    return;
  }

  const updateBrand = await db
    .update(vehicleBrand)
    .set({
      name: name.toLowerCase(),
    })
    .where(eq(vehicleBrand.id, id))
    .returning();

  return res.json({
    message: 'success update brand',
    data: updateBrand[0],
  });
}

export async function deleteVehicleBrand(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);

  const brand = await db
    .select()
    .from(vehicleBrand)
    .where(eq(vehicleBrand.id, id))
    .limit(1);

  if (brand.length < 1) {
    req.statusCode = 404;
    next(new Error(`record not found`));
    return;
  }

  await db.delete(vehicleBrand).where(eq(vehicleBrand.id, id)).execute();

  return res.json({
    message: 'success delete brand',
  });
}

// Vehicle type handler

export async function createVehicleType(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, brandId } = req.body;

  const brand = await db
    .select()
    .from(vehicleBrand)
    .where(eq(vehicleBrand.id, brandId))
    .limit(1);

  if (brand.length < 1) {
    req.statusCode = 400;
    next(new Error(`Brand is not registered`));
    return;
  }

  const newType = await db
    .insert(vehicleType)
    .values({
      name,
      brandId,
    })
    .returning();

  return res.status(201).json({
    message: 'success add new type',
    data: newType[0],
  });
}

export async function updateVehicleType(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, brandId } = req.body;
  const id = Number(req.params.id);

  const brand = await db
    .select()
    .from(vehicleBrand)
    .where(eq(vehicleBrand.id, brandId))
    .limit(1);

  if (brand.length < 1) {
    req.statusCode = 400;
    next(new Error(`Brand is not registered`));
    return;
  }

  const updateType = await db
    .update(vehicleType)
    .set({
      name,
      brandId,
    })
    .where(eq(vehicleType.id, id))
    .returning();

  return res.status(201).json({
    message: 'success update type',
    data: updateType[0],
  });
}

export async function deleteVehicleType(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);

  const type = await db
    .select()
    .from(vehicleType)
    .where(eq(vehicleType.id, id))
    .limit(1);

  if (type.length < 1) {
    req.statusCode = 404;
    next(new Error(`record not found`));
    return;
  }

  await db.delete(vehicleType).where(eq(vehicleType.id, id)).execute();

  return res.json({
    message: 'success delete type',
  });
}

export async function createVehicleModel(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, typeId } = req.body;

  const type = await db
    .select()
    .from(vehicleType)
    .where(eq(vehicleType.id, typeId))
    .limit(1);

  if (type.length < 1) {
    req.statusCode = 400;
    next(new Error(`Type is not registered`));
    return;
  }

  const newModel = await db
    .insert(vehicleModel)
    .values({
      name,
      typeId,
    })
    .returning();

  return res.status(201).json({
    message: 'success add new model',
    data: newModel[0],
  });
}

export async function updateVehicleModel(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, typeId } = req.body;
  const id = Number(req.params.id);

  const type = await db
    .select()
    .from(vehicleType)
    .where(eq(vehicleType.id, typeId))
    .limit(1);

  if (type.length < 1) {
    req.statusCode = 400;
    next(new Error(`Type is not registered`));
    return;
  }

  const updateModel = await db
    .update(vehicleModel)
    .set({
      name,
      typeId,
    })
    .where(eq(vehicleModel.id, id))
    .returning();

  return res.status(201).json({
    message: 'success update model',
    data: updateModel[0],
  });
}

export async function deleteVehicleModel(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);

  const model = await db
    .select()
    .from(vehicleModel)
    .where(eq(vehicleModel.id, id))
    .limit(1);

  if (model.length < 1) {
    req.statusCode = 404;
    next(new Error(`record not found`));
    return;
  }

  await db.delete(vehicleModel).where(eq(vehicleModel.id, id)).execute();

  return res.json({
    message: 'success delete model',
  });
}

export async function createVehicleYear(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const year = req.body.year as number;

  const vehicle_year = await db
    .select()
    .from(vehicleYear)
    .where(eq(vehicleYear.year, year))
    .limit(1);

  if (vehicle_year.length < 1) {
    req.statusCode = 400;
    next(new Error(`Year '${year}' is already registered`));
    return;
  }

  const newYear = await db
    .insert(vehicleYear)
    .values({
      year,
    })
    .returning();

  return res.status(201).json({
    message: 'success add year',
    data: newYear[0],
  });
}

export async function updateVehicleYear(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const year = req.body.year as number;
  const id = Number(req.params.id);

  const vehicle_year = await db
    .select()
    .from(vehicleYear)
    .where(eq(vehicleYear.id, id))
    .limit(1);

  if (vehicle_year.length < 1) {
    req.statusCode = 400;
    next(new Error(`Year is not found`));
    return;
  }

  const updateYear = await db
    .update(vehicleYear)
    .set({
      year,
    })
    .where(eq(vehicleYear.id, id))
    .returning();

  return res.status(201).json({
    message: 'success update year',
    data: updateYear[0],
  });
}

export async function deleteVehicleYear(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);

  const vehicle_year = await db
    .select()
    .from(vehicleYear)
    .where(eq(vehicleYear.id, id))
    .limit(1);

  if (vehicle_year.length < 1) {
    req.statusCode = 404;
    next(new Error(`record not found`));
    return;
  }

  await db.delete(vehicleYear).where(eq(vehicleYear.id, id)).execute();

  return res.json({
    message: 'success delete year',
  });
}

export async function createPricelist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { code, price, yearId, modelId } = req.body;

  const checkYear = await db
    .select()
    .from(vehicleYear)
    .where(eq(vehicleYear.id, yearId))
    .limit(1);
  if (checkYear.length < 1) {
    req.statusCode = 400;
    next(new Error(`year with id of ${yearId} is not found`));
    return;
  }

  const checkModel = await db
    .select()
    .from(vehicleModel)
    .where(eq(vehicleModel.id, modelId))
    .limit(1);
  if (checkModel.length < 1) {
    req.statusCode = 400;
    next(new Error(`model with id of ${modelId} is not found`));
    return;
  }

  const checkPricelist = await db
    .select()
    .from(pricelist)
    .where(and(eq(vehicleYear.id, yearId), eq(vehicleModel.id, modelId)))
    .limit(1);
  if (checkPricelist.length > 0) {
    req.statusCode = 400;
    next(new Error(`pricelist is already registered`));
    return;
  }
  const newPricelist = await db
    .insert(pricelist)
    .values({
      code,
      price,
      modelId,
      yearId,
    })
    .returning();

  return res.json({
    message: 'succes created pricelist',
    data: newPricelist[0],
  });
}

export async function updatePricelist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { code, price, yearId, modelId } = req.body;
  const id = Number(req.params.id);

  const checkYear = await db
    .select()
    .from(vehicleYear)
    .where(eq(vehicleYear.id, yearId))
    .limit(1);
  if (checkYear.length < 1) {
    req.statusCode = 400;
    next(new Error(`year with id of ${yearId} is not found`));
    return;
  }

  const checkModel = await db
    .select()
    .from(vehicleModel)
    .where(eq(vehicleModel.id, modelId))
    .limit(1);
  if (checkModel.length < 1) {
    req.statusCode = 400;
    next(new Error(`model with id of ${modelId} is not found`));
    return;
  }

  const checkPricelist = await db
    .select()
    .from(pricelist)
    .where(eq(pricelist.id, id))
    .limit(1);
  if (checkPricelist.length < 1) {
    req.statusCode = 400;
    next(new Error(`record not found`));
    return;
  }
  const updatePrice = await db
    .update(pricelist)
    .set({
      code,
      price,
      modelId,
      yearId,
    })
    .where(eq(pricelist.id, id))
    .returning();

  return res.json({
    message: 'succes update pricelist',
    data: updatePrice[0],
  });
}

export async function deletePricelist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);

  const checkPricelist = await db
    .select()
    .from(pricelist)
    .where(eq(pricelist.id, id));
  if (checkPricelist.length < 1) {
    req.statusCode = 404;
    next(new Error('record not found'));
    return;
  }

  await db.delete(pricelist).where(eq(pricelist.id, id)).execute();

  return res.json({
    message: 'success delete pricelist',
  });
}
