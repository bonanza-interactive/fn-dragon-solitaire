# Card Game Kit

This is Veikkaus Card Game Kit for card game development. Documentation can be found on the developer site:

http://developer.sw.veikkaus.fi/VeikkausGDK/kits/to-cardgamekit-about/

## Running

### Setting up development environment

Install dependencies with:

```bash
yarn
```

### Using @apila/asset-pipeline for asset management

Asset pipeline v2 asset management is done by running the game specific asset pipeline script. Deployed assets should be included in the repository of the game. Release pipelines doesn't run asset pipeline anymore. The deployment script can use whatever optimizations for the assets, as long as the developers have the needed tools for it.

Default entrypoint for the script is found in `ap/ap.ts` file. Most common operations are deployment of texture, sound and spine asset optimizations without parameters:

```bash
yarn ap
```

Quicker run without optimizations is started with `--fast` parameter. Asset processing is much quicker, but result bundle has larger file sizes.

```bash
yarn ap --fast
```

Daemon mode is run with `--daemon`. Since this is common method for asset iteration, daemon is run without optimizations.

```bash
yarn ap --daemon
```

Release assets are processed with `--release` parameter.

```bash
yarn ap --release
```

There are other options as well for mobile and localization parameters.

More specific integration guide can by found in the developer site:

http://developer.sw.veikkaus.fi/VeikkausGDK/tools/to-ap2-setup/

### Hosting the game

You should now have a working environment.

Backend server can be launched with:

```bash
yarn start-server
```

Client server can be launched with:

```bash
yarn start
```

By default, this will serve the project at: `http://localhost:8080`.
The entrypoint for your project is in `./src/main.ts`.

### Backends

TODO

### Code editing

### VSCode

Install ESLint plugin. Add following to user or workspace configuration:

```
"eslint.validate": ["typescript"],
"[typescript]": {
    "editor.codeActionsOnSave": {
        "source.fixAll": true
    }
},
```

## Kit development

### Convert atlases

convert kakkospipo_cards.png -crop XxY-xPadding-yPadding@ +repage +adjoin tile-%d.png
