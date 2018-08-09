/**
 * id | session | expires
 */

\connect "social-network"

CREATE TABLE IF NOT EXISTS "user-sessions" (
  id INT NOT NULL,
  session CHAR( 128 ) NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL );
