/**
 * id | username | password | active | secret | status | alias | salt | sex
 */

\connect "social-network"

CREATE TABLE IF NOT EXISTS users (
  id SERIAL,
  username VARCHAR( 16 ) NOT NULL,
  password CHAR( 128 ) NOT NULL,
  lastseen TIMESTAMP WITH TIME ZONE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT FALSE,
  secret CHAR( 32 ) NOT NULL,
  status VARCHAR( 256 ),
  alias VARCHAR( 16 ),
  salt CHAR( 32 ) NOT NULL,
  sex CHAR( 1 ) );
