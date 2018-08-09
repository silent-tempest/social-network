/**
 * username | sex | session | expires
 */

\connect "social-network"

CREATE TABLE IF NOT EXISTS "signup-sessions" (
  username VARCHAR( 16 ) NOT NULL,
  sex CHAR( 1 ),
  session CHAR( 128 ) NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL );
