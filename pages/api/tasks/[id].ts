import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  if (req.method === 'PATCH') {
    const { isDone } = req.body;

    try {
      const task = await prisma.task.update({
        where: { id },
        data: { isDone },
      });

      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.task.delete({
        where: { id },
      });

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  } else {
    res.setHeader('Allow', ['PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 