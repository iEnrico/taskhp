import "dotenv/config";

export const config = {
  ITUNES_API_URL: process.env.ITUNES_API_URL || "https://itunes.apple.com/search",
  PORT: process.env.PORT || 3010,
};
