# Knex / PG / test

Running unit tests locally and on Circle CI

## Get started

- node 20 (`nvm use`)
- docker

## Setup

clone the repo as ususal and from the folder run:

```bash
npm install

./scripts/create_ci_dotenv.sh

./scripts/pg_start.sh

npm run db:migrate:up

npm run db:seed
```

## Test

```
npm run test:ci
```

## Further

### create a migration file

```bash
 npx knex migrate:make migration_name
```

creates a file, for example, `migrations/20240801161854_migration_name.js`. :wanring: the file needs some changes (async function, module.exports) and then implement the up and down functions

### create a seed file

```bash
npx knex seed:make seed_name
```

creates a file `seeds/seed_name.js`. I recommend using filename with the table name and ordering filenames with a prefix `001_tablename.js` as the seed runs alphabetically.
