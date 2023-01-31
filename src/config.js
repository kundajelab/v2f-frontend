const config = {
  apiUrl: window.configApiUrl ?? 'http://localhost:4000/graphql',
  googleTagManagerID: window.configGoogleTagManagerID ?? null,
  helpdeskEmail: window.configHelpdeskEmail ?? 'helpdesk@opentargets.org',
  profile: window.configProfile ?? {},
  platformUrl: window.configPlatformUrl ?? 'https://genetics.opentargets.org',
};

export default config;
