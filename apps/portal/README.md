# Platform Portal

## Running Locally

From the root directory

(First time only)

```
$ nx build
```

Use the [.env.local.example](.env.local.example) file for reference - create a new file .env.local with the same contents.

Start portal application

```
$ nx run portal:serve
```

See package.json at the root directory for a list of available commands.

## Configuration

Configuration is handled through environment variables.

| Name                      | Example                       | Description                                                                                |
| ------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| VITE_COMPANY_API_HOSTNAME | http://localhost:8080         | Hostname for company API                                                                   |
| VITE_GOOGLE_CLIENT_ID     | \*.apps.googleusercontent.com | [More info](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid) |

Environment variables must be prefixed with `NX_` and are evaluated during the `build` target.

Environment variables can be supplied via command line arguments

```bash
$ VITE_COMPANY_API_HOSTNAME=http://localhost:8080 nx server portal
```

or via `.env` files in the root directory.

```ini
; apps/my_app/.env
VITE_COMPANY_API_HOSTNAME=http://localhost:8080
```

For local development, you can supply your own `.env.local` to override any environment variables you'd like.

```ini
; apps/my_app/.env.local
VITE_COMPANY_API_HOSTNAME=https://example.com
```

For switching between different environments, you'll need to supply `.env.build.[configuration]` where `build` is
the `target` name in `project.json` and `[configuration]` represents a `configuration` name under the `build` target.

```json
// project.json
{
  "targets": {
    "build": {
      "configurations" {
        "development": {},
        "production": {}
      }
    }
  }
}
```

When we call

```bash
$ nx serve:production portal
```

Nx will use the `.env.build.production` file to read configuration because the `build:production` target is a dependency
of `serve:production`.

More information on `.env` resolution can be found [here](https://nx.dev/recipes/environment-variables/define-environment-variables#setting-environment-variables).
