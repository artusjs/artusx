# pV-Artus

> undefined project with http-server powered by artus.

## Usage

### Database

```bash
docker-compose up -d
```

### Config

config app with dotenv.

```bash
# mysql
MYSQL_HOST = "localhost"
MYSQL_PORT = 3306
MYSQL_DATABASE = "mysql"
MYSQL_USERNAME = "root"
MYSQL_PASSWORD = "root"

# redis
REDIS_HOST = 'localhost'
REDIS_PORT = 6379
REDIS_USERNAME = ''
REDIS_PASSWORD = ''
REDIS_DATABASE = 0
```

### Development

```bash
pnpm i
pnpm run dev
```

### Production

```bash
pnpm run start

# nohup
nohup pnpm run start &
```

### Requirement

- Docker
- Node.js 18.x
- Typescript 4.x+
