import type { NextFunction, Request, Response } from 'express';
import { db } from '@/db';
import { user } from '../db/schema';
import { eq } from 'drizzle-orm';
import {
  comparePassword,
  createJWT,
  hashPassword,
} from '../middleware/auth.middleware';

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const checkEmail = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (checkEmail.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Email already exist',
    });
  }

  const hash = await hashPassword(password);
  const newUser = await db
    .insert(user)
    .values({
      email,
      name,
      password: hash,
    })
    .returning({ id: user.id, isAdmin: user.isAdmin });

  const token = createJWT({
    id: newUser[0].id,
    email,
    isAdmin: newUser[0].isAdmin!,
  });

  return res.json({
    token,
  });
}

/**
 *
 * @param req
 * @param res
 * @return Bearer token
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  const authUser = await db.select().from(user).where(eq(user.email, email));
  if (authUser.length < 1) {
    req.statusCode = 404;
    next(new Error('User not found'));
    return;
  }

  const checkPassword = await comparePassword(password, authUser[0].password);
  if (!checkPassword) {
    req.statusCode = 400;
    next(new Error('Credentials mismatch'));
    return;
  }

  const token = createJWT({
    id: authUser[0].id,
    email: authUser[0].email,
    isAdmin: authUser[0].isAdmin!,
  });

  return res.json({
    token,
  });
}
