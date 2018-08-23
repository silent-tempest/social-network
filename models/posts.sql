\connect social_network

CREATE TABLE IF NOT EXISTS posts (
  authorId INT NOT NULL,
  contents VARCHAR( 8192 ) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL );
