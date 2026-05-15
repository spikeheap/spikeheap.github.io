// Webmentions — fetches webmention.io's public jf2 API for the current post
// and renders likes/reposts as compact avatar facepiles, replies/mentions as
// comment cards. The section starts hidden; only revealed when there's at
// least one webmention to show.
//
// webmention.io sanitises author-supplied HTML server-side. We use innerHTML
// for reply bodies on that basis (same posture as comments.js).

(function () {
  "use strict";

  var section = document.querySelector("[data-webmentions]");
  if (!section) return;
  var target = section.getAttribute("data-webmentions-target");
  if (!target) return;

  var url =
    "https://webmention.io/api/mentions.jf2?target=" +
    encodeURIComponent(target) +
    "&per-page=100";

  fetch(url)
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data || !Array.isArray(data.children) || data.children.length === 0) return;
      render(data.children);
    })
    .catch(function () { /* silent — section stays hidden */ });

  function render(mentions) {
    var likes = mentions.filter(byProperty("like-of"));
    var reposts = mentions.filter(byProperty("repost-of"));
    var bookmarks = mentions.filter(byProperty("bookmark-of"));
    var replies = mentions.filter(byProperty("in-reply-to"));
    var generic = mentions.filter(byProperty("mention-of"));

    var content = section.querySelector(".webmentions__content");
    if (!content) return;

    var heading = document.createElement("h2");
    heading.className = "webmentions__heading";
    heading.textContent = "Webmentions";
    content.appendChild(heading);

    if (likes.length) content.appendChild(buildFacepile("Likes", likes));
    if (reposts.length) content.appendChild(buildFacepile("Reposts", reposts));
    if (bookmarks.length) content.appendChild(buildFacepile("Bookmarks", bookmarks));

    var threadEntries = replies.concat(generic);
    if (threadEntries.length) content.appendChild(buildReplies(threadEntries));

    content.removeAttribute("hidden");
  }

  function byProperty(name) {
    return function (m) { return m["wm-property"] === name; };
  }

  function buildFacepile(label, entries) {
    var wrap = document.createElement("div");
    wrap.className = "facepile";

    var h = document.createElement("h3");
    h.className = "facepile__heading";
    h.textContent = label + " (" + entries.length + ")";
    wrap.appendChild(h);

    var list = document.createElement("ul");
    list.className = "facepile__list";

    entries.forEach(function (entry) {
      var item = document.createElement("li");
      var a = document.createElement("a");
      a.href = entry.url || (entry.author && entry.author.url) || "#";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "facepile__item";

      var img = document.createElement("img");
      img.className = "facepile__avatar";
      img.src = (entry.author && entry.author.photo) || "";
      img.alt = (entry.author && entry.author.name) || "";
      img.loading = "lazy";
      img.width = 32;
      img.height = 32;
      a.appendChild(img);

      var name = document.createElement("span");
      name.className = "visually-hidden";
      name.textContent = (entry.author && entry.author.name) || "Unknown";
      a.appendChild(name);

      item.appendChild(a);
      list.appendChild(item);
    });

    wrap.appendChild(list);
    return wrap;
  }

  function buildReplies(entries) {
    var wrap = document.createElement("div");
    wrap.className = "webmentions__replies";

    var h = document.createElement("h3");
    h.className = "webmentions__replies-heading";
    h.textContent = "Replies and mentions (" + entries.length + ")";
    wrap.appendChild(h);

    var list = document.createElement("ol");
    list.className = "comments__list";

    entries
      .sort(function (a, b) {
        return new Date(a.published || 0) - new Date(b.published || 0);
      })
      .forEach(function (entry) {
        list.appendChild(buildReplyCard(entry));
      });

    wrap.appendChild(list);
    return wrap;
  }

  function buildReplyCard(entry) {
    var li = document.createElement("li");
    li.className = "comment h-cite";

    var header = document.createElement("header");
    header.className = "comment__meta";

    var authorLink = document.createElement("a");
    authorLink.className = "comment__author p-author h-card";
    authorLink.href = (entry.author && entry.author.url) || entry.url || "#";
    authorLink.target = "_blank";
    authorLink.rel = "noopener noreferrer";

    if (entry.author && entry.author.photo) {
      var avatar = document.createElement("img");
      avatar.className = "comment__avatar u-photo";
      avatar.src = entry.author.photo;
      avatar.alt = "";
      avatar.loading = "lazy";
      avatar.width = 32;
      avatar.height = 32;
      authorLink.appendChild(avatar);
    }

    var name = document.createElement("span");
    name.className = "p-name";
    name.textContent = (entry.author && entry.author.name) || "Unknown";
    authorLink.appendChild(name);

    header.appendChild(authorLink);

    if (entry.url) {
      var permalink = document.createElement("a");
      permalink.className = "comment__permalink u-url";
      permalink.href = entry.url;
      permalink.target = "_blank";
      permalink.rel = "noopener noreferrer";
      var time = document.createElement("time");
      time.className = "dt-published";
      time.dateTime = entry.published || "";
      time.textContent = formatDate(entry.published);
      permalink.appendChild(time);
      header.appendChild(permalink);
    }

    li.appendChild(header);

    var content = document.createElement("div");
    content.className = "comment__content e-content";
    if (entry.content && entry.content.html) {
      content.innerHTML = entry.content.html; // server-sanitised by webmention.io
    } else if (entry.content && entry.content.text) {
      content.textContent = entry.content.text;
    } else {
      content.textContent = "—";
    }
    li.appendChild(content);

    return li;
  }

  function formatDate(iso) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
      });
    } catch (_e) {
      return iso;
    }
  }
})();
