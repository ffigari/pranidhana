CREATE TABLE IF NOT EXISTS dojos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name character varying NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS dojos_teachers (
  dojo_id uuid NOT NULL,
  teacher_id uuid NOT NULL,
  PRIMARY KEY (dojo_id, teacher_id),
  CONSTRAINT dojos_teachers_dojo_id_fkey
    FOREIGN KEY (dojo_id)
    REFERENCES dojos(id)
    ON DELETE CASCADE,
  CONSTRAINT dojos_teachers_teacher_id_fkey
    FOREIGN KEY (teacher_id)
    REFERENCES teachers(user_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dojos_admins (
  dojo_id uuid NOT NULL,
  admin_id uuid NOT NULL,
  PRIMARY KEY (dojo_id, admin_id),
  CONSTRAINT dojos_admins_dojo_id_fkey
    FOREIGN KEY (dojo_id)
    REFERENCES dojos(id)
    ON DELETE CASCADE,
  CONSTRAINT dojos_admins_admin_id_fkey
    FOREIGN KEY (admin_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
