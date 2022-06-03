---
title: Migrating user avatars to circular crops, with ImageMagick
tags: ['post', 'web']
comments: true
date: 2015-09-05
description: "Picture the scene: you have a few thousand users with avatars on your site. You want to change from a boring 4x3 photo to a cool and hip circular crop. You know it'll look great for new users, but we don't want to leave the existing ones behind."
---
<strong>Edit (2019-04-23):</strong> Updated to replace `compose_opacity` with `DstIn` to preserve source image transparency. Thanks Chen Han!

Picture the scene: you have a few thousand users with avatars on your site. You want to change from a boring 4x3 photo to a cool and hip circular crop. You know it'll look great for new users, but we don't want to leave the existing ones behind.

Let's imagine our current approach to user avatars is to accept any size and shape image. Because we're sensible, we retain the originally uploaded image and generate a thumbnail to be used on the site which maintains the proportions but constrains the longest side to 100 pixels.

Our new UI requires circular images at three different sizes (icon, default and large avatars). We want to take this opportunity to generate thumbnails at these sizes (and x2 for Retina screens) so we can keep file sizes small and our site as fast as possible. Because we can [easily create circular masks with CSS](http://www.abeautifulsite.net/how-to-make-rounded-images-with-css/), we just need create square versions of the images, and we have a few options:

1. Stretch the image to fit a square. This is obviously a bad idea.
2. Crop the top/bottom or left/right of the longest side to make the image square.
3. Fit the entire image within the square, and pad the excess.

In this case I believe option 2 gives the best outcome – no excess whitespace and wholly-filled circles, but our users didn't have any of this in mind when they uploaded their images in the dim and distant past so we need to get an idea of how these changes will affect their existing images.

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

Humans are really (really) good at recognising faces. They're not so good at monotony, so walking through 10,000 users' profile pages isn't going to work very well. A montage of all the avatars on a single image works surprisingly well – even at smaller sizes the headless avatars or dodgy crops jumped out at us.

ImageMagick is all set up to generate our rounded avatar images:

__Edit (2019-04-23):__ I've updated this script to use `DstIn` instead of `compose_opacity`, to preserve source image transparency in the cropped, masked output. See [the documentation](http://www.imagemagick.org/Usage/compose/#duff-porter) for more information about Duff Porter choices.

```bash
#/bin/sh
convert $1 \
        -resize x800 -resize '800x<'   -resize 50% \
        -gravity center  -crop 400x400+0+0 +repage \
        \( +clone -threshold -1 -negate -fill white -draw "circle 200,200 200,0" \) \
        -compose DstIn \
        -composite \
        -auto-orient \
    cropped_${1}.png
```

This generates a circular mask, and overlays that on the cropped, centred image. Wrapping the above with `find` allows us to loop through and process all our images:

```bash
# assumes we've placed the above snippet crop_avatars.sh
mkdir cropped_images
find ./images -type f -exec ./crop_avatars.sh {} \;
```

We now have a `cropped_images/` directory containing smaller, rounder versions of the images. All we need to do then is stitch them together, and once again ImageMagick is there for us:

```bash
montage cropped_images/* avatar_montage.png
```

After all of that you should end up with something like this:

![A montage of user avatars](/images/2015-08-28_montage.jpg)

Have fun with it, but don't be surprised when everyone wants to see your new creation. For many organisations this could well be the first chance they've had to see many of their users, and a huge grid of (hopefully smiling) faces can be quite powerful.

#### References

The following pages were hugely helpful for figuring out how to achieve the different portions of ImageMagic magic:

* [http://daemonsandagents.tumblr.com/post/108369306151/imagemagick-ways-of-cropping-an-image-to-a
](http://daemonsandagents.tumblr.com/post/108369306151/imagemagick-ways-of-cropping-an-image-to-a
)
* [http://www.imagemagick.org/Usage/resize/#space_fill
](http://www.imagemagick.org/Usage/resize/#space_fill
)
* [http://www.imagemagick.org/Usage/thumbnails/#fit_summery
](http://www.imagemagick.org/Usage/thumbnails/#fit_summery
)
* [http://www.imagemagick.org/Usage/crop/#crop_gravity
](http://www.imagemagick.org/Usage/crop/#crop_gravity
)
* [http://www.imagemagick.org/Usage/montage/
](http://www.imagemagick.org/Usage/montage/
)
