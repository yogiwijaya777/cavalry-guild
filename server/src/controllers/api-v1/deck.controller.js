const httpStatus = require('http-status');
const { deckService } = require('../../services');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadCloudinary = async (deckName, userId, image) => {
  try {
    const result = await cloudinary.uploader.upload(image.tempFilePath, {
      public_id: `${deckName}-${userId}`,
      overwrite: true,
      folder: 'cavalry/decks',
      resource_type: 'image',
      image_format: 'png',
    });

    fs.unlinkSync(image.tempFilePath);

    return result.secure_url;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
  }
};

const create = catchAsync(async (req, res) => {
  if (req.files) {
    const image = req.files.file || req.files.image;

    if (image.truncated) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Image is too large');
    }

    const imgUrl = await uploadCloudinary(req.body.name, req.user.id, image);

    req.body.imageUrl = imgUrl;
  }

  const deckCreated = await deckService.create(req.user, req.body);

  res.status(httpStatus.CREATED).json({
    status: httpStatus.CREATED,
    message: 'Deck Created',
    data: deckCreated,
  });
});

const getById = catchAsync(async (req, res) => {
  const deck = await deckService.getById(req.params.deckId);

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: 'Get Deck By Id Success',
    data: deck,
  });
});

const update = catchAsync(async (req, res) => {
  if (req.files) {
    const image = req.files.file || req.files.image;

    if (image.truncated) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Image is too large');
    }

    const imgUrl = await uploadCloudinary(req.body.name, req.user.id, image);

    req.body.imageUrl = imgUrl;
  }

  const deckUpdated = await deckService.update(req.user, req.params.deckId, req.body);

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: 'Update Deck Success',
    data: deckUpdated,
  });
});

const del = catchAsync(async (req, res) => {
  await deckService.del(req.user, req.params.deckId);

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: 'Delete Deck Success',
  });
});

const getByUser = catchAsync(async (req, res) => {
  const { name, page, limit, sort } = req.query;
  const filters = {
    name,
  };

  const options = {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    sort,
  };
  options.skip = (options.page - 1) * options.limit;

  const results = await deckService.getByUser(req.params.userId, filters, options);

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: 'Get All Decks Success',
    data: results.decks,
    meta: results.meta,
  });
});

const getDecksByArchetype = catchAsync(async (req, res) => {
  const { name, page, limit, sort } = req.query;
  const filters = {
    name,
  };

  const options = {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    sort,
  };
  options.skip = (options.page - 1) * options.limit;

  const results = await deckService.getDecksByArchetype(req.params.archetypeId, filters, options);

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: 'Get Decks By Archetype Success',
    data: results.decks,
    meta: results.meta,
  });
});

const search = catchAsync(async (req, res) => {
  const { name, page, limit, sort } = req.query;
  const filters = {
    name,
  };

  const options = {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    sort,
  };
  options.skip = (options.page - 1) * options.limit;

  const results = await deckService.search(filters, options);

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: 'Get All Decks Success',
    data: results.decks,
    meta: results.meta,
  });
});

module.exports = {
  create,
  getById,
  update,
  del,
  getByUser,
  getDecksByArchetype,
  search,
};
