# Redesign Health Design System

<p style="text-align: center;"><img src="./libs/shared/ui/src/lib/assets/RH_Logo_Single_Ultraviolet.png" width="450"></p>

## Important Notes

- Only add new packages to root. Nx will go up the nodes until the required module is found, so no need to CD into a specific app or lib to intall a package. On build/deploy Nx is smart enough to include only the packages imported into your app and prune the remaining from the root package.json.
- Run all scripts from the root. This will result in a large scripts oject, but again, no need to CD into subdirectories, app, or libs. When the commands aren't automatically generated in the root packages.json, simply look at your app's project.json file for the relavent commands, then hoist them to package.json scripts. For example, if an app named 'java-backend' is created a default serve command of `nx run java-backend:serve' will be added to that project's project.json. To add and run from root, you would simply add the following to the root package.json and Nx would know where to run the command (script can be named whatever you think is most descriptive):

```
"scripts": {
  ...
  "serve": "nx run java-backend:serve"
}
```

## Style guide (WIP)

Using VS Code is strongly encouraged, as Nx has an extension and VS support that is extremely helpful. Your .vscode settings.json and extensions.json should contain the following, or the linting, prettier and other formatting tools won't work as expected:

[settings.json](.vscode/settings.json)

[extensions.json](.vscode/extensions.json)

### Testing

- Nx generates test files in the format \*.spec.{file extension}, which should be adhered to for those tests created manually by Redesign Health engineers in this repo.

### Devcontainer setup

First time Local Environment Devcontainer Setup

1. Install [VSCode](https://code.visualstudio.com/download)
2. Install [VSCode Remote Development Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
3. Install [Rancher Desktop](https://rancherdesktop.io/)
   - container runtime: dockerd
   - kubernetes version: stable (1.24.4 at time of writing)
   - When installed, go to Preferences to set 16GB memory, 4 CPUs, _VZ_ virtual machine type and _virtiofs_ mount type (experimental as of v1.10)
   - check that it works by going to the Rancher Dashboard
   - open up a terminal on your local machine and check `docker` and `kubectl` -- you should see the help messages if everything installed correctly. If you see command not found, then please reach out to the team.
   - See [confluence page](https://redesignhealth.atlassian.net/wiki/spaces/DevOps/pages/98304013/Set+up+local+docker+env+using+Rancher+Desktop) for more detailed info, including a video walkthrough
4. Clone github repo by using the VSCode command `Clone Repository in Container Volume` - This can be accessed by clicking on the green `><` icon in the bottom left. Then enter the github URL (go to the github repo -> Code -> HTTPS -> Copy URL button)
   - If you have already cloned the repository locally, you can also reopen it in a container by choosing the `Reopen in container` command instead.
   - You can run `ssh-add` on your host to broker git ssh credentials into the dev container via `ssh-agent`. The VSCode extension supports this well.
5. The devcontainer will be built following instructions defined in the [Dockerfile](./.devcontainer/Dockerfile) and the [devcontainer.json](./.devcontainer/Dockerfile) file specifies additional setup such as post install steps and VSCode extensions
   - `~/.m2` and `~/.npm` are bind mounts, make sure they exist in your local filesystem
   - `~/.m2/settings` will need some [configuration to authenticate with GitHub Packages](https://github.com/redesignhealth/rh-design-system/blob/main/libs/shared-java/data-access-aws-secrets-manager-property-source/README.md#authenticating-with-github-packages)
   - GitHub Access Tokens may need to be explicitly authorized for the @redesignhealth GitHub organization
6. Open up a bash terminal in VS Code (Terminal -> New Terminal) and start using!

Note: If there is a new change to the Dockerfile or devcontainer.json file (whether by your edits or from a merged PR), you can rebuild the container and see the changes by clicking the green icon at the bottom `>< Dev Container` > `Rebuild Container`.

Additional Reading/tutorial information on devcontainers:

- https://code.visualstudio.com/docs/remote/containers
- https://code.visualstudio.com/docs/remote/containers-tutorial

### Typescript VSCode setup

Note: When setting up the repository for the first time in VSCode, you should see a prompt asking if the workspace's typescript version should be used. Select the workspace option so that vscode uses the right one. Also see bell icon in the bottom right.

Alternative setup instructions

- open up any typescript file (.ts)
- type command + shift + P
- enter `TypeScript: Select TypeScript Version``
- choose workspace

---

### This project was generated using [Nx](https://nx.dev)

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Fast and Extensible Build System**

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [React](https://reactjs.org)
  - `npm install --save-dev @nx/react`
- Web (no framework frontends)
  - `npm install --save-dev @nx/web`
- [Angular](https://angular.io)
  - `npm install --save-dev @nrwl/angular`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`
- [Express](https://expressjs.com)
  - `npm install --save-dev @nrwl/express`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nx/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## Generate an application

Run `nx g @nx/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nx/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@redesignhealth/libName`.

## Development server

Run `nx serve my-app` for a dev server. Navigate to <http://localhost:4200/>. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nx/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
