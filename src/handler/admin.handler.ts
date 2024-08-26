import { count, eq } from 'drizzle-orm';
import type { NextFunction, Request, Response } from 'express';
import { db } from '../db';
import { user, vehicleBrand } from '../db/schema';

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

  const updateBrand = await db
    .update(vehicleBrand)
    .set({
      name: name.toLowerCase(),
    })
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
