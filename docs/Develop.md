# madamis

## How To Develop

### 0 Prepare Node

use mise

```sh
mise install
```

### 1 Install Dependencies

```sh
pnpm i
```

- If asked to download pnpm, do so.

### 2 Prepare DB

To prepare the database, run the migrations

```sh
pnpm migrate
```

There is no data in the Users table, so add it
(Data can be freely entered)

```sh
pnpx wrangler d1 execute madamis-db --local --command "INSERT INTO Users (name, color) VALUES ('User1', '#1b7a16'), ('User2', '#bd8317');"
```

### 3 Run App

To run the App, run this command

```sh
pnpm dev
```

Then, you can access the App in your browser
