const predictionService = require('../services/predictionService');

const getEndOfMonth = async (req, res, next) => {
  try {
    const data = await predictionService.predictEndOfMonth(req.user.id);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const getCategoryRisk = async (req, res, next) => {
  try {
    const data = await predictionService.predictCategoryRisk(req.user.id);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getEndOfMonth, getCategoryRisk };
