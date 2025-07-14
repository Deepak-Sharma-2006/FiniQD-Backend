import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({}, { strict: false });

export const getLevelModel = (level) => {
  const collectionName = `level-${level}`;
  if (mongoose.models[collectionName]) {
    return mongoose.models[collectionName];
  }
  return mongoose.model(collectionName, levelSchema, collectionName);
};
