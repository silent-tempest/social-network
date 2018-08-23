\connect social_network

CREATE TABLE IF NOT EXISTS users (
  id SERIAL,
  username VARCHAR( 16 ) NOT NULL,
  password CHAR( 128 ) NOT NULL,
  lastSeen TIMESTAMP WITH TIME ZONE,
  active BOOLEAN NOT NULL DEFAULT FALSE,
  secret CHAR( 32 ) NOT NULL,
  status VARCHAR( 256 ),
  alias VARCHAR( 16 ),
  salt CHAR( 32 ) NOT NULL,
  sex CHAR( 1 ) );
