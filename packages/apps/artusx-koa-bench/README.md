# artusx-koa-bench

> benchmark for @artusx/core

## Prepare

install and build wrk

```bash
mkdir wrk && cd wrk
git clone https://github.sheincorp.cn/wg/wrk.git .
make
cp wrk  /usr/local/bin
```

## Usage

```bash
rush install 
rush build 
pnpm run bench
```

### Requirement

- Node.js 18.x
- wrk
