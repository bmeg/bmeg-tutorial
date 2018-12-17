---
title: Demo
---

<nav>
  <div class="nav-wrapper">
    <a href="#" class="brand-logo">Tokens</a>
    <ul id="nav-mobile" class="right hide-on-med-and-down">
      <li><a href="/_token.txt">text</a></li>
      <li><a href="/_token.json">json</a></li>
      <li><a href="/_token.curl">curl</a></li>
      <li><a href="/_signout">signout</a></li>
    </ul>
  </div>
</nav>

```
curl -H "OauthEmail: XXXX@YYYY.com" -H "OauthAccessToken: /SSSSSSSS" -H "OauthExpires: 1544674452" http://localhost/api/v1/
```


Visit [GRIP](/grip) to run interactive queries
