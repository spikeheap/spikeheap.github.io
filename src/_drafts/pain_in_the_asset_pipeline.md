---
published: false
---
# Pain in the asset pipelines

This mostly applies to SPAs and static sites with progressive enhancement.

What do we want?
- concatenation
- minification
- sourcemaps in development
- cachebusting



When do we want it?
- in development
  - with sourcemaps
  - recompiled
- in production
  - superfast

Sprockets

- urgh
- was great, now dated
- directory prefixing
- hijacking build steps is hard
- es6, nah
- module loading (example)

But what about the cool kids?

- gulp/grunt/brocolli/browserify/webpack/jspm/make?!
- browserify + gulp
- all the cool tools
- es6, ftw
- async loading
- browsersync
- serve separately, dev together
  - /public but add to .gitignore (or don't)
  - build step  
- uncss?
- image minification?
Caveats
- no ERB (that's a good thing)
- more complex build (that's a bad thing)


Bonus points
- splitting the frontend/backend makes usign a CDN trivial
- deploy frontend/backend changes separately, but worry about keeping them in sync.

References:
- http://nandovieira.com/using-es6-with-asset-pipeline-on-ruby-on-rails
- https://github.com/vigetlabs/gulp-starter
- https://github.com/browserify-rails/browserify-rails/issues/85

# Pain in the asset pipelines

Massive caveat: this only really applies to SPAs and sites with progressive enhancement

---

### Development environments

Development should mirror production as closely as possible, so we want to move away from the Sprockets approach of statically compiling assets ready for production, but intercepting requests in development. 

Gulp allows us to use a 'watcher' approach, where we notice file changes and rebuild the relevant files. This means we're serving up files in the same way regardless of the environment, and minimising the differences between them.

We're assuming here that you don't mind exposing your sourcemaps to the world. This won't affect your average user as sourcemaps are only downloaded if you have devtools open. It can feel like you're hemorrhaging IP by doing this, but this may be offset by the gains you have debugging issues in production. 

---

Let's revisit the caveat I started with: this only really applies to SPAs and sites with progressive enhancement. Does this mean we're doomed if we want to use ERB, Haml or Slim? Fear not, we can have the best of both worlds:

* Keep your JS/CSS external, and compile into /app/assets/
* Disable cachebusting in Gulp/Grunt and enable it in Sprockets
* Manually manage the assets in your layout files

- [ ] update structure - what do we want when we're developing (and why), what do we want in production (and why)
