import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { conversation } = req.body;

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/chat/completions`,
                {
                    model: process.env.NEXT_PUBLIC_API_MODEL,
                    messages: conversation,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
                    },
                }
            );
            const answer = response.data.choices[0]?.message?.content?.trim().replace(/\n/g, "<br>");
            res.status(200).json({ answer });
        } catch (error) {
            console.error('GPTとの通信に失敗:', error);
            res.status(500).json({ error: 'GPTとの通信に失敗しました.' });
        }
    } else {
        res.status(405).json({ massage: '通信メソッドが対応していません.' })
    }
}