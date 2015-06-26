---
title: Migrating user avatars to circular crops, with ImageMagick
layout: post
---
Picture the scene: you have a few thousand users with avatars on your site. You want to change from a boring 4x3 photo to a cool and hip circular crop. You know it'll look great for new users, but we don't want to leave the existing ones behind.
<!-- more -->

### Avatars for new users
* doing it in production - CarrierWave + CSS circular crops.
* retain original if possible (scaled down) to allow re-crops
* possibly expand

### Assessing the impact

* process
  * space requirements for new versions
  * look at the distribution of dimensions in originals
  * generate avatars offline
  * create a montage

Get the size and dimensions of all images in a directory:

```bash
find avatar_images \
  -type f \
  -not -name "thumb_*" \
  -exec identify -format %G\ %\[size\]\\n {} \;
```

Get the sorted list of dimension proportions:

```bash
find avatar_images \
  -type f \
  -not -name "thumb_*" \
  -exec identify \
  -format %w\ %h\\n {} \; | awk '{ print $1/$2 }' | sort | cut -c1,2,3
```

Generate a circular crop of an image

```bash
convert input.jpg \
  -resize x800 -resize '800x<'   -resize 50% \
  -gravity center  -crop 400x400+0+0 +repage \
  \( +clone -threshold -1 -negate -fill white-draw "circle 200,200 200,0" \) \
 -alpha off -compose copy_opacity -composite \
 -auto-orient \
  output.png
```
