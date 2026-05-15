// Mastodon comments — progressive enhancement.
//
// Reads the toot URL from the [data-mastodon-toot] element, fetches the
// status (for boost/favourite/reply counts) and its context (for the reply
// tree), then renders into the page. Without JS the section still works —
// the fallback link to the toot remains visible and clickable.
//
// HTML returned by Mastodon's API is server-rendered and already sanitised
// (no <script>, just <p>/<br>/<a>/<span>). We trust it.

(function () {
  "use strict";

  var section = document.querySelector("[data-mastodon-toot]");
  if (!section) return;

  var tootUrl = section.getAttribute("data-mastodon-toot");
  var parsed = parseTootUrl(tootUrl);
  if (!parsed) return;

  var apiBase = "https://" + parsed.instance + "/api/v1/statuses/" + parsed.id;

  Promise.all([
    fetch(apiBase).then(asJson),
    fetch(apiBase + "/context").then(asJson),
  ])
    .then(function (results) {
      var status = results[0];
      var context = results[1];
      if (status) renderCounts(status);
      if (context) renderThread(context.descendants || []);
    })
    .catch(function () {
      // Silent failure — the fallback link still works.
    });

  function asJson(response) {
    return response.ok ? response.json() : null;
  }

  // Mastodon public toot URLs come in a few shapes; we just need the
  // trailing numeric ID and the host.
  function parseTootUrl(url) {
    var match = /^https?:\/\/([^\/]+)\/[^\s]*?(\d+)\/?$/.exec(url);
    if (!match) return null;
    return { instance: match[1], id: match[2] };
  }

  function renderCounts(status) {
    var link = section.querySelector(".comments__link");
    if (!link) return;

    var replies = status.replies_count || 0;
    var boosts = status.reblogs_count || 0;
    var faves = status.favourites_count || 0;

    var parts = [];
    if (replies) parts.push(pluralise(replies, "reply", "replies"));
    if (boosts) parts.push(pluralise(boosts, "boost", "boosts"));
    if (faves) parts.push(pluralise(faves, "favourite", "favourites"));

    if (parts.length === 0) {
      link.textContent = "Continue the discussion on Mastodon";
      return;
    }
    link.textContent = "Continue the discussion on Mastodon — " + joinList(parts) + " so far";
  }

  function pluralise(n, one, many) {
    return n + " " + (n === 1 ? one : many);
  }

  function joinList(parts) {
    if (parts.length === 1) return parts[0];
    return parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1];
  }

  function renderThread(descendants) {
    if (!descendants.length) return;

    // Build tree from flat list using in_reply_to_id chains.
    var byId = {};
    descendants.forEach(function (d) {
      byId[d.id] = { reply: d, children: [] };
    });
    var roots = [];
    descendants.forEach(function (d) {
      var node = byId[d.id];
      var parent = d.in_reply_to_id && byId[d.in_reply_to_id];
      if (parent) parent.children.push(node);
      else roots.push(node);
    });

    var list = section.querySelector(".comments__list");
    if (!list) return;
    roots.forEach(function (root) {
      list.appendChild(renderReplyNode(root));
    });
    list.removeAttribute("hidden");
  }

  function renderReplyNode(node) {
    var reply = node.reply;
    var li = document.createElement("li");
    li.className = "comment h-cite";

    var header = document.createElement("header");
    header.className = "comment__meta";

    var authorLink = document.createElement("a");
    authorLink.className = "comment__author p-author h-card";
    authorLink.href = reply.account.url;
    authorLink.target = "_blank";
    authorLink.rel = "noopener noreferrer";

    var avatar = document.createElement("img");
    avatar.className = "comment__avatar u-photo";
    avatar.src = reply.account.avatar;
    avatar.alt = "";
    avatar.loading = "lazy";
    avatar.width = 32;
    avatar.height = 32;
    authorLink.appendChild(avatar);

    var name = document.createElement("span");
    name.className = "p-name";
    name.textContent = reply.account.display_name || reply.account.username;
    authorLink.appendChild(name);

    var handle = document.createElement("span");
    handle.className = "comment__handle";
    handle.textContent = "@" + reply.account.acct;
    authorLink.appendChild(handle);

    header.appendChild(authorLink);

    var permalink = document.createElement("a");
    permalink.className = "comment__permalink u-url";
    permalink.href = reply.url;
    permalink.target = "_blank";
    permalink.rel = "noopener noreferrer";
    var time = document.createElement("time");
    time.className = "dt-published";
    time.dateTime = reply.created_at;
    time.textContent = formatDate(reply.created_at);
    permalink.appendChild(time);
    header.appendChild(permalink);

    li.appendChild(header);

    var content = document.createElement("div");
    content.className = "comment__content e-content";
    content.innerHTML = reply.content; // Trusted: server-sanitised by Mastodon.
    li.appendChild(content);

    if (node.children.length) {
      var sublist = document.createElement("ol");
      sublist.className = "comments__list";
      node.children.forEach(function (child) {
        sublist.appendChild(renderReplyNode(child));
      });
      li.appendChild(sublist);
    }

    return li;
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (_e) {
      return iso;
    }
  }
})();
