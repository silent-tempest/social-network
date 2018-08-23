\connect social_network

CREATE TABLE IF NOT EXISTS messages (
  authorId INT NOT NULL,
  addresseeId INT NOT NULL,
  contents VARCHAR( 8192 ) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL );
