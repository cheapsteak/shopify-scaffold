shopify-scaffold
================

for large-scale theme development

Gives you:  

1. SASS (with @imports)
2. folder structures
3. Autoprefixer
4. ~~source maps~~ presently broken X(

## How to use it

[grunt-shopify](https://github.com/wilr/grunt-shopify) is used to keep files in `deploy/` synced with the server. 

Here are its configs in `Gruntfile.js` :

```javascript
shopify: {
  options: {
    api_key: process.env.API_KEY,
    password: process.env.PASSWORD,
    url: "your.shopify.url",
    base: "deploy/"
  }
},
```
Replace `your.shopify.url` with your shop’s actual URL. 
If you don’t know how to set environment variables, you could either check out the instructions for [windows](http://superuser.com/questions/79612/setting-and-getting-windows-environment-variables-from-the-command-prompt)/[linux](https://help.ubuntu.com/community/EnvironmentVariables)/[osx](http://stackoverflow.com/questions/135688/setting-environment-variables-in-os-x), or just hardcode the strings in.

Open up a console in the project’s root directory, run `grunt`, and you’re good to go!

## Folder structure
```
deploy/
images/
markup/
|-config/
|-layout/
|-snippets/
|-templates/
sass/
scripts/
```

* `deploy/` is the build folder, files are copied here to be uploaded to the server. (this folder is not tracked by version control)  
* `images/` can have any number of subdirectories (e.g. `images/icons/`, `images/carousel`). All the files will be copied into `deploy/assets` so be careful not to have files with identical names.  
* `markup/config`, `markup/layout`, `markup/snippets`, `markup/templates` can also have any number of subdirectories. This should be particularly useful for organizing the `snippets` folder and inline SVGs.
* `sass/` sass/scss files here will be processed with autoprefixer and compiled to `.css.liquid` files (with matching `.map` source maps) and copied to the `deploy/assets` folder.  
  You can use liquid tags, although you’ll have to do some weird stuff so the SASS and Autoprefixer parsers don’t freak out.  
  Here’s an example: (credit to [hopper and ryancito on SO](http://stackoverflow.com/questions/11237792/shopify-theme-with-compass-and-sass/12737288#12737288) for figuring this out)
```sass
/* {% unless settings.page_bg_transparent %} */
background: url( "#{'{{ "splash-1.jpg" | asset_url }}'}" )
/* {% endunless %} */
```
* `scripts/` js files in the top directory will be concated and uglified to `deploy/assets/main.js`,  
  files in `scripts/plugins` will be concated and uglified to `deploy/assets/plugins.js`

## Source Maps
We're serving source files for the sourcemaps on `127.0.0.1:9000`  
If a different port number is desired, set a `PORT` environment variable, or change the specified port in the `connect` and `copy` configs:
```javascript
connect: {
  server: {
    options: {
      hostname: '127.0.0.1',
      port: process.env.PORT || 9000
    }
  }
}
```
```javascript
copy: {
  main: {
    options: {
      process: function (content, srcpath) {
        if (srcpath.slice(-4) === '.map') {
          var sourcemap = JSON.parse(content);
          sourcemap.sources = sourcemap.sources.map(function (path) {
            return path.replace('..\\..\\','');
          });
          sourcemap.sourceRoot = 'http://127.0.0.1:' + (process.env.PORT || 9000) + '/';
          content = JSON.stringify(sourcemap);
        }
        return content;
      }
    },
```
