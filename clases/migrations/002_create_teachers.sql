CREATE TABLE IF NOT EXISTS teachers (
  user_id uuid PRIMARY KEY,
  CONSTRAINT teachers_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
