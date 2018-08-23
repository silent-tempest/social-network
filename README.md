# Social Network

### Setup the `config/` Folder

What you should have at the end:

```sh
 - social_network/
   - config/
     - index.js    # the config
     - pg.json     # node-postgres connection config.
     - server.cert # https self-signed sertificate.
     - server.key  # https self-signed key.
```

* Create `config/pg.json` with this contents:
```json
"config://USERNAME:PASSWORD@localhost:PORT/social_network"
```

* Create self-signed sertificate and key:
```sh
openssl req -new -x509 -nodes -days 365 -subj '/CN=localhost' -newkey rsa:4096 -keyout server.key -out  server.cert
```

### Setup the Database

```sh
psql -f models/friends.sql -f models/messages.sql -f models/post-likes.sql -f models/posts.sql -f models/signup-sessions.sql -f models/user-sessions.sql -f models/users.sql
```

### Makefile

* Bundle and compress `static/scripts/index.js` into `static/dist/scripts/index.bundle.min.js`:
```sh
make script-index.js--min
```

* Bundle `static/scripts/index.js` into `static/dist/scripts/index.bundle.min.js`:
```sh
make script-index.js
```

* Bundle and compress `static/styles/index.scss` into `static/dist/styles/index.bundle.min.css`:
```sh
make style-index.scss--min
```

* Bundle `static/styles/index.scss` into `static/dist/styles/index.bundle.min.css`:
```sh
make style-index.scss
```
