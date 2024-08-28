import type { NextFunction, Request, Response } from 'express';
import { db } from '../db';
import {
  pricelist,
  vehicleBrand,
  vehicleModel,
  vehicleType,
  vehicleYear,
} from '../db/schema';
import { z } from 'zod';
import { count, eq } from 'drizzle-orm';

const PaginationSchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).default('1'),
  page: z.string().regex(/^\d+$/).transform(Number).default('10'),
});

type GETResponse = {
  page: number;
  total: number;
  limit: number;
  skip: number;
  data: any;
};

function response(obj: GETResponse): GETResponse {
  return obj;
}

export async function getAllVehicleBrand(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const page = req.query.page ? Number(req.query.page) : 1;
  const offset = (page - 1) * limit;

  const brands = await db
    .select()
    .from(vehicleBrand)
    .limit(limit)
    .offset(offset);

  const total = await db.select({ count: count() }).from(vehicleBrand);

  return res.json({
    total: total[0].count,
    page,
    limit,
    skip: offset,
    data: brands,
  });
}

export async function getVehicleBrandById(
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

  return res.json({
    data: brand,
  });
}

export async function getAllVehicleTypes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const page = req.query.page ? Number(req.query.page) : 1;
  const offset = (page - 1) * limit;
  const brandId = req.query.brandId ? Number(req.query.brandId) : undefined;

  if (brandId) {
    const types = await db
      .select()
      .from(vehicleType)
      .where(eq(vehicleType.brandId, brandId))
      .limit(limit)
      .offset(offset);
    const total = await db
      .select({ count: count() })
      .from(vehicleType)
      .where(eq(vehicleType.brandId, brandId));
    return res.json(
      response({
        total: total[0].count,
        page,
        limit,
        skip: offset,
        data: types,
      })
    );
  }

  const types = await db.select().from(vehicleType).limit(limit).offset(offset);
  const total = await db.select({ count: count() }).from(vehicleType);
  return res.json(
    response({
      total: total[0].count,
      page,
      limit,
      skip: offset,
      data: types,
    })
  );
}

export async function getVehicleTypeById(
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

  return res.json({
    data: type,
  });
}

export async function getAllVehicleModels(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const page = req.query.page ? Number(req.query.page) : 1;
  const offset = (page - 1) * limit;

  const models = await db
    .select()
    .from(vehicleModel)
    .limit(limit)
    .offset(offset);

  const total = await db.select({ count: count() }).from(vehicleModel);

  return res.json({
    total: total[0].count,
    page,
    limit,
    skip: offset,
    data: models,
  });
}

export async function getVehicleModelById(
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

  return res.json({
    data: model,
  });
}

export async function getAllVehicleYears(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const page = req.query.page ? Number(req.query.page) : 1;
  const offset = (page - 1) * limit;

  const years = await db.select().from(vehicleYear).limit(limit).offset(offset);

  const total = await db.select({ count: count() }).from(vehicleYear);

  return res.json({
    total: total[0].count,
    page,
    limit,
    skip: offset,
    data: years,
  });
}

export async function getVehicleYearById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);

  const year = await db
    .select()
    .from(vehicleYear)
    .where(eq(vehicleYear.id, id))
    .limit(1);

  return res.json({
    data: year,
  });
}

export async function getPricelists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const page = req.query.page ? Number(req.query.page) : 1;
  const offset = (page - 1) * limit;

  const priceLists = await db
    .select()
    .from(pricelist)
    .limit(limit)
    .offset(offset);

  const total = await db.select({ count: count() }).from(pricelist);

  return res.json({
    total: total[0].count,
    page,
    limit,
    skip: offset,
    data: priceLists,
  });
}
