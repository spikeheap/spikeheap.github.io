---
title: Migrating user avatars to circular crops, with ImageMagick
layout: post
---
Picture the scene: you have a few thousand users with avatars on your site. You want to change from a boring 4x3 photo to a cool and hip circular crop. You know it'll look great for new users, but we don't want to leave the existing ones behind.
<!-- more -->

<!-- TODO example double-height avatar montage -->

For the sake of this example let's imagine our current approach to user avatars is to accept any size and shape image. Because we're sensible, we retain the originally uploaded image and generate a thumbnail to be used on the site which maintains the proportions but constrains the longest side to 100 pixels.

Our new UI requires circular images at three different sizes (icon, default and large avatars). We want to take this opportunity to generate thumbnails at these sizes (and x2 for Retina screens) so we can keep file sizes small and our site as fast as possible. Because we can [easily create circular masks with CSS](http://www.abeautifulsite.net/how-to-make-rounded-images-with-css/), we just need create square versions of the images, and we have a few options:

* Stretch the image to fit a square. This is obviously a bad idea.
* Crop the top/bottom or left/right of the longest side to make the image square.
* Fit the entire image within the square, and pad the excess.

Our users didn't have any of this in mind when they uploaded their images in the dim and distant past, so we need to get an idea of how these changes will affect our existing images.

#### Image dimensions
The first thing we can do is calculate the distribution of image proportions. This is useful alongside the assumption that squarer images are more likely to crop without losing the subject in the image.

ImageMagick has a set of handy command-line tools to help us with this:

```bash
find avatar_images \
  -type f \
  -not -name "thumb_*" \
  -exec identify \
  -format %w\ %h\\n {} \; | awk '{ print $1/$2 }' | sort | cut -c1,2,3
```

In the above example we search the `avatar_images` directory, include all files, but filter out images we've generated in the past (prefixed with `thumb_`). The output will be a list of the image propotions as double values (e.g. 4/3 → 1.333, 6/9 → 0.666).

You can dump this list into Excel and [generate a histogram](http://www.excel-easy.com/examples/histogram.html), or just use it to highlight how many values are outside of 'squarish'.

This approach can help if you have a very large set of user avatar images, but it doesn't help us with the qualitative task of checking that they look 'okay' with the new circular crop.

#### Creating an avatar montage for quick visual checking

TODO

```bash
convert input.jpg \
  -resize 400x400^ +repage -gravity center -extent 400x400 +repage \
  -gravity center  -crop 400x400+0+0 +repage \
  \( +clone -threshold -1 -negate -fill white -draw "circle 200,200 200,0" \) \
  -alpha off -compose copy_opacity -composite \
  -auto-orient \
  output.png
```

Let's walk through that script line-by-line:

1. Take `input.jpg`.
2. Fill a 400x400 square and crop any excess.

convert input -resize 400x400^ +repage -gravity center -extent 400x400 +repage output.jpg


# NOTES


### Avatars for new users (bonus section)
* doing it in production - CarrierWave + CSS circular crops.
* retain original if possible (scaled down) to allow re-crops
* possibly expand

### Assessing the impact

* process
  * space requirements for new versions
  * look at the distribution of dimensions in originals
  * generate avatars offline
  * create a montage
