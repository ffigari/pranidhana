import { Class } from "@shared/class"

const formatClassText = (c: Class): string => {
  if (!c.teachers || c.teachers.length === 0) {
    return `Clase ${c.id}`
  }

  if (c.teachers.length === 1) {
    return `Clase ${c.id} con profesor ${c.teachers[0].id}`
  }

  // Multiple teachers
  const teacherIds = c.teachers.map(t => t.id)
  const allButLast = teacherIds.slice(0, -1).join(", ")
  const last = teacherIds[teacherIds.length - 1]
  return `Clase ${c.id} con los profesores ${allButLast} y ${last}`
}

export const ClassesList = ({ classes }: { classes: Class[] }) => {
  return (
    <ul>
      {classes.map(c => (
        <li key={c.id}>{formatClassText(c)}</li>
      ))}
    </ul>
  )
}
