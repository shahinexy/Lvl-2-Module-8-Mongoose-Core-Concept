/* eslint-disable @typescript-eslint/no-explicit-any */
// ========= route -> controller -> service ==========
import mongoose from 'mongoose';
import AppError from '../../error/AppError';
import { UserModel } from '../user/user.model';
import { AdminModel } from './admin.model';
import { TAdmin } from './admin.interface';
import QueryBuilder from '../../builder/QueryBuilder';

const getAllAdminsFronDB = async (query: Record<string, unknown>) => {
  const AdminSearchbleField = ['email', 'name.firstName', 'designation'];

  const AdminQuery = new QueryBuilder(AdminModel.find(), query)
    .search(AdminSearchbleField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await AdminQuery.modelQuery;
  const meta = await AdminQuery.cuntTotal();

  return { meta, result };
};

const getSingleAdminFromDB = async (id: string) => {
  const result = await AdminModel.findById(id);
  return result;
};

const updateAdminInDB = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...remainingAdmintData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdmintData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await AdminModel.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

// ===== transaction & rollback ====
const deleteAdminFromDB = async (id: string) => {
  const isIdExists = await AdminModel.findById(id);

  if (!isIdExists) {
    throw new AppError(400, 'This Admin dose not exists');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deleteAdmint = await AdminModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteAdmint) {
      throw new AppError(400, 'Faild to delete Admint');
    }

    const userId = deleteAdmint.user;

    const deleteUser = await UserModel.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteUser) {
      throw new AppError(400, 'Faild to delete User');
    }

    await session.commitTransaction();
    await session.endSession();

    return deleteAdmint;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(error);
  }
};

export const AdminServices = {
  getAllAdminsFronDB,
  getSingleAdminFromDB,
  updateAdminInDB,
  deleteAdminFromDB,
};
