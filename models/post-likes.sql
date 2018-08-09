/**
 * post-id | liker-id
 */

\connect "social-network"

CREATE TABLE IF NOT EXISTS "post-likes" (
  "post-id" INT NOT NULL,
  "liker-id" INT NOT NULL );
