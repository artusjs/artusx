const fs = require('fs');
const path = require('path');

const koaRouterTemplate = `
import { Controller, GET } from '@artusx/core';
import type { ArtusxContext } from '@artusx/core';

@Controller()
export default class BenchKoaRouterController {
  @GET('/_health')
  async koarouter_health(ctx: ArtusxContext) {
    ctx.body = {};
  }

  __TO_REPLACE__
}
`;

const findMyWayTemplate = `
import { Controller, GET } from '@artusx/core';
import type { ArtusxContext } from '@artusx/core';

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
  async koarouter_one${i}(ctx: ArtusxContext) {
    ctx.body = {};
  }

  @GET('/${i}/one/two')
  async koarouter_oneTwo${i}(ctx: ArtusxContext) {
    ctx.body = {};
  }

  @GET('/${i}/one/two/:three')
  async koarouter_oneTwoThree${i}(ctx: ArtusxContext) {
    ctx.body = {};
  }

  @GET('/${i}/one/two/:three/:four?')
  async koarouter_oneTwoThreeFour${i}(ctx: ArtusxContext) {
    ctx.body = {};
  }

  @GET('/${i}/one/two/:three/:four?/five')
  async koarouter_oneTwoThreeFourFive${i}(ctx: ArtusxContext) {
    ctx.body = {};
  }

  @GET('/${i}/one/two/:three/:four?/five/six')
  async koarouter_oneTwoThreeFourFiveSix${i}(ctx: ArtusxContext) {
    ctx.body = {};
  }

  @GET('/${i}/child')
  async koarouter_child${i}(ctx: ArtusxContext) {
    ctx.body = {};
  }

  @GET('/${i}/child/grandchild')
  async koarouter_childGrandchild${i}(ctx: ArtusxContext) {
    ctx.body = {};
  }

  @GET('/${i}/child/grandchild/:id')
  async koarouter_childGrandchildId${i}(ctx: ArtusxContext) {
    ctx.body = {};
  }

  @GET('/${i}/child/grandchild/:id/seven')
  async koarouter_childGrandchildIdSeven${i}(ctx: ArtusxContext) {
    ctx.body = {};
  }

  @GET('/${i}/child/grandchild/:id/seven(/eight)?')
  async koarouter_childGrandchildIdSevenEight${i}(ctx: ArtusxContext) {
    ctx.body = {};
  }
  `;
}

/**
 * @param {number} i
 * @returns string
 */
function genFindMyWayController(i) {
  return '';
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
