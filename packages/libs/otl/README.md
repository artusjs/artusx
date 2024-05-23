# @artusx/otl

Opentelemetry for ArtusX.

## Usage

### Automatic Instrumentation setup

init opentelemetry with default config.

- KoaInstrumentation
- HttpInstrumentation

```ts
import path from 'path';
import { initOtl } from '@artusx/otl';
import { bootstrap } from '@artusx/utils';

const ROOT_DIR = path.resolve(__dirname);

initOtl('artusx-koa', '1.0.0');
bootstrap({ root: ROOT_DIR });
```

### Manual instrumentation setup

custom tracer and meter.

```ts
import path from 'path';
import {
  initOtl,
  initMeter,
  initTracer,
} from '@artusx/otl';
import { bootstrap } from '@artusx/utils';

const ROOT_DIR = path.resolve(__dirname);

// initOtl('artusx-koa', '1.0.0');
initMeter();
initTracer();

bootstrap({ root: ROOT_DIR });
```

#### addEvent and counter

```ts
import { ArtusXInjectEnum, Inject, Controller, GET } from '@artusx/core';
import { getMeter, getTracer, Span } from '@artusx/otl';

const meter = getMeter('artusx-koa', '1.0.0');
const tracer = getTracer('artusx-koa', '1.0.0');
const homeCounter = meter.createCounter('home.counter');

@Controller()
export default class HomeController {
  @Inject(ArtusXInjectEnum.Nunjucks)
  nunjucks: NunjucksClient;

  @GET('/')
  async home(ctx: ArtusXContext) {
    // meter
    homeCounter.add(1);

    // tracer
    tracer.startActiveSpan('home', (span: Span) => {      
      span.addEvent('home', { key: 'home', value: Math.random() });
      
      ctx.body = this.nunjucks.render('index.html', { title: 'ArtusX', message: 'Hello ArtusX!' });
      span.end();
    });  
  }  
}
```
