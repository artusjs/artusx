# @artusx/plugin-ejs

ejs plugin with layout support for artusx.

> ported from [https://github.com/Soarez/express-ejs-layouts](https://github.com/Soarez/express-ejs-layouts)

**Since the plugin is an independent version, you need to set the content-type of the returned data yourself.**

## Plugin

```ts
export default {
  artusx: {
    enable: true,
    package: '@artusx/core',
  },
  ejs: {
    enable: true,
    package: '@artusx/plugin-ejs',
  },  
};
```

## Config

```ts
import path from 'path';
import type { ArtusXConfig } from '@artusx/core';
import type { EjsConfig } from '@artusx/plugin-ejs';

export default () => {  
  const artusx: ArtusXConfig = {
    port: 7001,
    middlewares: [LimitRate, checkAuth],
    static: {
      dirs: [
        {
          prefix: '/public/',
          dir: path.resolve(__dirname, '../public'),
        },
      ],
      dynamic: true,
      preload: false,
      buffer: false,
      maxFiles: 1000,
    },
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
      credentials: false,
    },
  };

  const ejs: EjsConfig = {
    root: path.resolve(__dirname, '../view-ejs'),
    async: true,  
    layout: {
      'layout extractScripts': true,
      'layout extractStyles': true,
      // layout: false,
    },
  };

  return {    
    ejs,
    artusx,      
  };
};
```

## View

layout.ejs

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><%= title %></title>

  <% /* Place any styles in the page in this section. */ %>
  <%- style %>
</head>
<body>
  <header>
    <% /*
    Define an required placeholder for the header.
    If a page doesn't define a header, there will be an error when rendering.
    */ %>
    <%- header %>
  </header>

  <%- body %>

  <footer>
    <% /*
    Define an optional placeholder for the footer.
    If a page doesn't define a footer, this section will simply be empty.
    */ %>
    <%- defineContent('footer') %>
  </footer>

  <% /* Place any scripts contained in views at the end of the page. */ %>
  <%- script %>
</body>
</html>
```

view.ejs

```html
<%- contentFor('header') %>
<h1 class="page-title"><%= _locals.title %></h1>

<%- contentFor('footer') %>
<h1>This is the footer</h1>

<% /*
Content for the `body` section should either be the first thing defined
in the view, or it has to be declared just like any other section.
*/ %>
<%- contentFor('body') %>

This is part of the body.

<% /*
When style extraction is enabled, any custom styles that a page defines, will
be extracted out of the content and made available in the specific placeholder.
In our example, even though we're defining a <style> within the body, this will
be placed, according to our layout, inside of the <head> element.
<link> blocks to load external stylesheets are also extracted when the option
is enabled.
*/ %>

<style>
  .page-message { color: blue }
</style>

<% /*
Like stylesheets, scripts can also be extracted.
This script block will end up at the end of the HTML document.
*/ %>
<script>
  // Script content!
</script>

<h1 class="page-message"><%= message %></h1>
```

## Contoller

```ts
import { ArtusXInjectEnum } from '@artusx/utils';
import {
  ArtusInjectEnum,
  ArtusApplication,
  Inject,
  Controller,
  GET, 
  ContentType 
} from '@artusx/core';

import type { ArtusXContext } from '@artusx/core';
import { EjsClient } from '@artusx/plugin-ejs';

@Controller('/ejs')
export default class EjsController {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;
  
  @Inject(ArtusXInjectEnum.EJS)
  ejs: EjsClient;
    
  @GET('/')  
  @ContentType('html')
  async view(ctx: ArtusXContext) {        
    const locals = {
      title: 'Example',
      message: 'This is a message'
    };    
    ctx.body = await this.ejs.render('view.ejs', { 
      locals,      
    });
  }

  @GET('/people')
  @ContentType('html')
  async people(ctx: ArtusXContext) {    
    const people = ['geddy', 'neil', 'alex'];        
    ctx.body = await this.ejs.render('people.ejs', { 
      people,
      layout: false,
     });
  }
}
```
