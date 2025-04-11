if (!process.env.REACT_APP_BE_DOMAIN) {
  var dotenv = require('dotenv');
  var dotenvExpand = require('dotenv-expand');

  const env = dotenv.config();
  dotenvExpand.expand(env);
}

export function getApiUrl() {
  const domain = process.env.REACT_APP_BE_DOMAIN?.includes("$") ? process.env.BE_DOMAIN : process.env.REACT_APP_BE_DOMAIN;
  const domainUrl = `http://${domain}`;
  const port = process.env.REACT_APP_BE_PORT?.includes("$") ? process.env.BE_LOCAL_PORT : process.env.REACT_APP_BE_PORT;
  if (port) {
    return `${domainUrl}:${port}`;
  } else {
    return domainUrl;
  }
}

export function getFeDomain() {
  const domain = process.env.REACT_APP_FE_DOMAIN?.includes("$") ? process.env.FE_DOMAIN : process.env.REACT_APP_FE_DOMAIN;
  console.log(domain);
  if (!domain) {
    throw new Error("No domain is set");
  }
  if (domain.includes("localhost")) {
    return "http://localhost:3000";
  }
  return `http://${domain}`;
}