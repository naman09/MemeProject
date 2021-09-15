GetRecommendedMemesSVC = require('./GetRecommendedMemes');
GetTrendingMemesSVC = require('./GetTrendingMemes');
MemeUploaderSVC = require('./MemeUploader');
LikeUpdaterSVC = require('./LikeUpdater');
CategoryUploaderSVC = require('./CategoryUploader');
GetCategoriesForMemeSVC = require('./GetCategoriesForMeme');

module.exports = { 
  GetRecommendedMemesSVC, 
  GetTrendingMemesSVC, 
  MemeUploaderSVC, 
  LikeUpdaterSVC,
  CategoryUploaderSVC,
  GetCategoriesForMemeSVC
};