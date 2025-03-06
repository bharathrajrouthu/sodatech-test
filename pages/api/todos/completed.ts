import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    try {
      await prisma.todo.deleteMany({
        where: {
          completed: true,
        },
      });

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to clear completed todos' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 