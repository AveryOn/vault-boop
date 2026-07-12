import { ActionKey } from "~/shared/dto/action.dto"
import { db } from "~/server/database/client"
import { actionTable } from "~/server/database/schema"
import { dateISO } from "~/shared/utils/datetime"

async function seedActions(): Promise<void> {
  const now = dateISO()

  const actions = Object.values(ActionKey).map(name => ({
    name,
    createdAt: now,
    updatedAt: now,
  }))

  await db
    .insert(actionTable)
    .values(actions)
    .onConflictDoNothing({
      target: actionTable.name,
    })

  console.log(`Seeded ${actions.length} actions`)
}

seedActions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Action seed failed:', error)
    process.exit(1)
  })
