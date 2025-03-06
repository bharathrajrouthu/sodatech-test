import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { text } = req.body;

    try {
      const todo = await prisma.todo.create({
        data: {
          text,
          completed: false,
          createdAt: new Date(),
        },
      });

      res.status(201).json(todo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create todo' });
    }
  } else if (req.method === 'GET') {
    try {
      const todos = await prisma.todo.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.status(200).json(todos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 