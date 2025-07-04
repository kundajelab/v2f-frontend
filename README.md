# Variant2Function Frontend App (ARCHIVED)

**PLEASE NOTE THIS REPO IS NO LONGER ACTIVE. PLEASE SEE THE [E2G](https://github.com/kundajelab/e2g-frontend) REPOSITORY, WHICH USES THE UPDATED OPENTARGETS PLATFORM FRONTEND. THIS REPO IS BASED ON THE DEPRECATED OPENTARGETS GENETICS PLATFORM.**

This repo contains the web application code for [Variant2Function](http://v2f-portal.stanford.edu).

It is one component of several and the overarching project is described [here](https://github.com/opentargets/genetics), which is also where issues can be raised.

## Installation

Before developing or building for production, you will need to follow these steps:

Clone the repo.

```
git clone https://github.com/opentargets/genetics-app.git
```

Enter the directory.

```
cd genetics-app
```

Install the dependencies.

```
yarn install
```

### Development

Start the dev server.

```
yarn start
```

### Build

Build for production (generates a static `build` directory).

```
yarn build
```

### Deployment

We deploy the public version of this site on [Netlify](https://www.netlify.com/). See the [netlify.toml](netlify.toml) for more detail.

## Contribute

Read our [contributing guidelines](CONTRIBUTING.md).

# Special Thanks

BrowserStack has allowed us to do cross-browser testing of the genetics app at no cost.
<img src="./tools-icons/Browserstack-logo.svg" alt="BrowserStack" width="400">

# Copyright

Copyright 2014-2018 Biogen, Celgene Corporation, EMBL - European Bioinformatics Institute, GlaxoSmithKline, Takeda Pharmaceutical Company and Wellcome Sanger Institute

This software was developed as part of the Open Targets project. For more information please see: http://www.opentargets.org

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
