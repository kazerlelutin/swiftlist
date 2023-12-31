import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function createItem(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { name } = JSON.parse(request.body || '{}')

  if (!name) {
    return response.status(400).json({ error: 'Missing name' })
  }

  await prisma.item.upsert({
    where: { name },
    update: {},
    create: {
      name
    },
  })

  const item = await prisma.item.findUnique({
    where: { name },
    include: {
      section: true,
    },
  })

  return response.json({ item })
}
