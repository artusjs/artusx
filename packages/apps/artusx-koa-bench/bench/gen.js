const fs = require('fs');
const path = require('path');

const koaRouterTemplate = `
import { Controller, GET } from '@artusx/core';
import type { ArtusXContext } from '@artusx/core';

@Controller()
export default class BenchKoaRouterController {
  @GET('/_health')
  async koarouter_health(ctx: ArtusXContext) {
    ctx.body = {};
  }

  __TO_REPLACE__
}
`;

const findMyWayTemplate = `
import { Controller, GET } from '@artusx/core';
import type { ArtusXContext } from '@artusx/core';

@Controller()
export default class BenchFindMyWayController {

  __TO_REPLACE__
}
`;
/**
 * @param {number} i
 * @returns string
 */
function genKoaRouterController(i) {
  return `
  @GET('/${i}/one')
  async koarouter_one${i}(ctx: ArtusXContext) {
    ctx.body = {
      query: ctx.query,
      params: ctx.params,
      fn: 'koarouter_one${i}'
    };
  }

  @GET('/${i}/one/two')
  async koarouter_oneTwo${i}(ctx: ArtusXContext) {
    ctx.body = {
      query: ctx.query,
      params: ctx.params,
      fn: 'koarouter_oneTwo${i}'
    };
  }

  @GET('/${i}/one/two/:three')
  async koarouter_oneTwoThree${i}(ctx: ArtusXContext) {
    ctx.body = {
      query: ctx.query,
      params: ctx.params,
      fn: 'koarouter_oneTwoThree${i}'
    };
  }

  @GET('/${i}/one/two/:three/:four?')
  async koarouter_oneTwoThreeFour${i}(ctx: ArtusXContext) {
    ctx.body = {
      query: ctx.query,
      params: ctx.params,
      fn: 'koarouter_oneTwoThreeFour${i}'
    };
  }

  @GET('/${i}/one/two/:three/:four?/five')
  async koarouter_oneTwoThreeFourFive${i}(ctx: ArtusXContext) {
    ctx.body = {
      query: ctx.query,
      params: ctx.params,
      fn: 'koarouter_oneTwoThreeFourFive${i}'
    };
  }

  @GET('/${i}/one/two/:three/:four?/five/six')
  async koarouter_oneTwoThreeFourFiveSix${i}(ctx: ArtusXContext) {
    ctx.body = {
      query: ctx.query,
      params: ctx.params,
      fn: 'koarouter_oneTwoThreeFourFiveSix${i}'
    };
  }

  @GET('/${i}/child')
  async koarouter_child${i}(ctx: ArtusXContext) {
    ctx.body = {
      query: ctx.query,
      params: ctx.params,
      fn: 'koarouter_child${i}'
    };
  }

  @GET('/${i}/child/grandchild')
  async koarouter_childGrandchild${i}(ctx: ArtusXContext) {
    ctx.body = {
      query: ctx.query,
      params: ctx.params,
      fn: 'koarouter_childGrandchild${i}'
    };
  }

  @GET('/${i}/child/grandchild/:id')
  async koarouter_childGrandchildId${i}(ctx: ArtusXContext) {
    ctx.body = {
      query: ctx.query,
      params: ctx.params,
      fn: 'koarouter_childGrandchildId${i}'
    };
  }

  @GET('/${i}/child/grandchild/:id/seven')
  async koarouter_childGrandchildIdSeven${i}(ctx: ArtusXContext) {
    ctx.body = {
      query: ctx.query,
      params: ctx.params,
      fn: 'koarouter_childGrandchildIdSeven${i}'
    };
  }

  @GET('/${i}/child/grandchild/:id/seven(/eight)?')
  async koarouter_childGrandchildIdSevenEight${i}(ctx: ArtusXContext) {
    ctx.body = {
      query: ctx.query,
      params: ctx.params,
      fn: 'koarouter_childGrandchildIdSevenEight${i}'
    };
  }
  `;
}

/**
 * @param {number} i
 * @returns string
 */
function genFindMyWayController(i) {
  return `
  @GET('/${i}/one/two/:three/:four/five/six')
  async fmw_oneTwoThreeFourFiveSix${i}(ctx: ArtusXContext) {
    ctx.body = {
      params: ctx.params,
      query: ctx.query,
      fn: 'fmw_oneTwoThreeFourFiveSix${i}'
    };
  }

  @GET('/${i}/one/two/:three/:four/five')
  async fmw_oneTwoThreeFourFive${i}(ctx: ArtusXContext) {
    ctx.body = {
      params: ctx.params,
      query: ctx.query,
      fn: 'fmw_oneTwoThreeFourFive${i}',
    };
  }

  @GET('/${i}/one/two/:three/:four')
  async fmw_oneTwoThreeFour${i}(ctx: ArtusXContext) {
    ctx.body = {
      params: ctx.params,
      query: ctx.query,
      fn: 'fmw_oneTwoThreeFour${i}',
    };
  }

  @GET('/${i}/one/two1/:three?')
  async fmw_oneTwo1Three${i}(ctx: ArtusXContext) {
    ctx.body = {
      params: ctx.params,
      query: ctx.query,
      fn: 'fmw_oneTwo1Three${i}',
    };
  }

  @GET('/${i}/one/two/:three')
  async fmw_oneTwoThree${i}(ctx: ArtusXContext) {
    ctx.body = {
      params: ctx.params,
      query: ctx.query,
      fn: 'fmw_oneTwoThree${i}',
    };
  }

  @GET('/${i}/one/two')
  async fmw_oneTwo${i}(ctx: ArtusXContext) {
    ctx.body = {
      params: ctx.params,
      query: ctx.query,
      fn: 'fmw_oneTwo${i}',
    };
  }

  @GET('/${i}/one')
  async fmw_one${i}(ctx: ArtusXContext) {
    ctx.body = {
      params: ctx.params,
      query: ctx.query,
      fn: 'fmw_one${i}',
    };
  }

  @GET('/${i}/child/grandchild/:id/seven/eight')
  async fmw_childGrandchildIdSevenEight${i}(ctx: ArtusXContext) {
    ctx.body = {
      params: ctx.params,
      query: ctx.query,
      fn: 'fmw_childGrandchildIdSevenEight${i}',
    };
  }

  @GET('/${i}/child/grandchild/:id/seven')
  async fmw_childGrandchildIdSeven${i}(ctx: ArtusXContext) {
    ctx.body = {
      params: ctx.params,
      query: ctx.query,
      fn: 'fmw_childGrandchildIdSeven${i}',
    };
  }

  @GET('/${i}/child/grandchild/:id')
  async fmw_childGrandchildId${i}(ctx: ArtusXContext) {
    ctx.body = {
      params: ctx.params,
      query: ctx.query,
      fn: 'fmw_childGrandchildId${i}',
    };
  }

  @GET('/${i}/child/grandchild')
  async fmw_childGrandchild${i}(ctx: ArtusXContext) {
    ctx.body = {
      params: ctx.params,
      query: ctx.query,
      fn: 'fmw_childGrandchild${i}',
    };
  }

  @GET('/${i}/child')
  async fmw_child${i}(ctx: ArtusXContext) {
    ctx.body = {
      params: ctx.params,
      query: ctx.query,
      fn: 'fmw_child${i}',
    };
  }

  @GET('/${i}')
  async fmw_index${i}(ctx: ArtusXContext) {
    ctx.body = {
      params: ctx.params,
      query: ctx.query,
      fn: 'fmw_index${i}',
    };
  }
  `;
}

const factor = Number.parseInt(process.env.FACTOR || '10', 10);

console.log('factor', factor);

const koaRoutes = new Array(factor)
  .fill(factor)
  .map((_, i) => {
    return genKoaRouterController(i);
  })
  .join('\n');

const findMyWayRoutes = new Array(factor)
  .fill(factor)
  .map((_, i) => {
    return genFindMyWayController(i);
  })
  .join('\n');

if (process.env.BENCH_KOA_ROUTER) {
  fs.writeFileSync(
    path.resolve(__dirname, '../src/controller/bench-koa-router.ts'),
    koaRouterTemplate.replace('__TO_REPLACE__', koaRoutes)
  );
}

if (process.env.BENCH_FIND_MY_WAY) {
  fs.writeFileSync(
    path.resolve(__dirname, '../src/controller/bench-find-my-way.ts'),
    findMyWayTemplate.replace('__TO_REPLACE__', findMyWayRoutes)
  );
}
