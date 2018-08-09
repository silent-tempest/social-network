/**
 * author-id | contents | date
 */

\connect "social-network"

CREATE TABLE IF NOT EXISTS posts (
  "author-id" INT NOT NULL,
  contents VARCHAR( 8192 ) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL );
