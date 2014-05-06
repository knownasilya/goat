goat
====

Serve static files for development, simple and unobstructive.

## Usage

```no-highlight
npm install -g goat
```

Then add it to your `package.json` as a script:

```json
{
  "name": "my-project",
  "scripts": {
    "serve": "goat -e ./static/index.html ./dist"
  }
}
```

### Available Options

```no-highlight
  Usage: serve-dev [options]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -e, --entry-file [file]  Usually an index.html
    -p, --port [port]        Port to run server on, default: 3000
```

Any additional paths that you append to the end will be served as static directories.
When using `-e`, the parent directory is added as a static directory, so no need to add
it manually.
