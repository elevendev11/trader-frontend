import path from "path";

export default {
  sassOptions: {
    includePaths: [path.join(process.cwd(), "styles")],
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.join(process.cwd(), "app");
    return config;
  },
  // Add any other configurations you might need
};
