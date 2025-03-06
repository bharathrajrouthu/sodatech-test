import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid todo ID' });
  }

  if (req.method === 'PATCH') {
    const { completed } = req.body;

    try {
      const todo = await prisma.todo.update({
        where: { id },
        data: { completed },
      });

      res.status(200).json(todo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update todo' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.todo.delete({
        where: { id },
      });

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  } else {
    res.setHeader('Allow', ['PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 