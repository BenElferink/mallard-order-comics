// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  maxDuration: 300,
  api: {
    responseLimit: false,
  },
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    name: string
    url: string
  }>
) {
  res.status(200).json({
    name: 'Ben Elferink',
    url: 'https://github.com/BenElferink',
  })
}
