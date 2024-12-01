import { NextApiRequest, NextApiResponse } from 'next';

import { generateDigest } from '../../scripts/digest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    await generateDigest();
    res.status(200).json({ message: 'Digest gerado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar digest', error });
  }
} 