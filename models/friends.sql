/**
 * user-id | friend-id
 */

\connect "social-network"

CREATE TABLE IF NOT EXISTS friends (
  "user-id" INT NOT NULL,
  "friend-id" INT NOT NULL );
