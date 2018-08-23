\connect social_network

CREATE TABLE IF NOT EXISTS user_sessions (
  id INT NOT NULL,
  session CHAR( 128 ) NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL );
