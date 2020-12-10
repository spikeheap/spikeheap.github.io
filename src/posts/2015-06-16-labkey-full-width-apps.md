---
layout: post
tags: ['post', 'labkey']
title: "Constraining width for LabKey WebParts and Views"
comments: true
date: 2015-06-16
---

Building custom web views within LabKey is pretty straightforward, but if you find yourself needing to constrain the contents of your module horizontally you'll quickly find that the surrounding tables will gladly stretch to any width. Fortunately restricting the width of hte container is pretty straightforward. 

**TL;DR:** Wrap your contents in a table with `table-layout: fixed; width: 100%` and the contents won't push the surrounding page to wider than the browser window.

<!-- more -->

LabKey's JavaScript API is rich, and allows complex JavaScript applications to be built against it whilst being hosted as web parts or views within the standard LabKey environment. As big fans of [Bootstrap](http://getbootstrap.com/) we were keen to leverage the structure and base components within our embedded application, but quickly came up against an issue where the web part container would grow infinitely to contain our contents. This made things like [justified navs](http://getbootstrap.com/components/#nav-justified) irksome as our content could grow horizontally.

What we really needed was to constrain the view to 100% of the available space, which we achieved by wrapping it in a table with a specified width:

```html
<table class="myapp">
    <tr>
      <td>
        <h1>My amazing application</h1>
      </td>
    </tr>
</table>

<link rel="stylesheet" type="text/css" href="<%=contextPath%>/myapp/styles/index.min.css">
<script src="<%=contextPath%>/myapp/js/application.min.js"></script>
```

…and adding a CSS rule to set the table layout:

```css
.myapp {
    table-layout: fixed; 
    width: 100%
}
```

Table-based layouts are a bit out of fashion these days, but it's necessary here because of the unbounded tables wrapping the web parts. If there's a more elegant way of solving it, I'd love to hear about it in the comments.

With that wrapper in place the standard Bootstrap components went back to behaving as they would in a standalone app, and we're able to use `overflow-x: scroll` where we need to display tables which don't fit the viewport without breaking the width of the entire LabKey page.


