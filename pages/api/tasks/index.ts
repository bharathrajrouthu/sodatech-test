import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Task } from '../../../types/task';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { description } = req.body;

    try {
      const task = await prisma.task.create({
        data: {
          description,
          isDone: false,
          createdAt: new Date(),
        },
      });

      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  } else if (req.method === 'GET') {
    try {
      const tasks = await prisma.task.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 