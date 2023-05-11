export function getApiUrl() {
  const domain = `http://${process.env.REACT_APP_BE_DOMAIN}`;
  const port = process.env.REACT_APP_BE_PORT;
  if (port) {
    return `${domain}:${port}`;
  } else {
    return domain;
  }
}
