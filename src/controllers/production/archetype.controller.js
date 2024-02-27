const catchAsync = require('../../utils/catchAsync');

const getById = catchAsync(async (req, res) => {
  res.render('archetypes/singleArchetype', { title: 'Archetype' });
});

const gets = catchAsync(async (req, res) => {
  res.render('archetypes/archetype', { title: 'Archetypes' });
});

module.exports = {
  getById,
  gets,
};
