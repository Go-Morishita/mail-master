import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { conversation } = req.body;

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/chat/completions`,
                {
                    model: process.env.NEXT_PUBLIC_API_MODEL,
                    messages: conversation,
                    functions: [{
                        name: "compose_email",
                        description: "Create an email with subject and body",
                        parameters: {
                            type: "object",
                            properties: {
                                subject: {
                                    type: "string",
                                    description: "メールの件名を入れてください。"
                                },
                                body: {
                                    type: "string",
                                    description: "メールの本文を入れてください。"
                                }
                            },
                            required: ["subject", "body"] // 必須項目を指定
                        }
                    }],
                    function_call: { "name": "compose_email" }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
                    },

                }
            );
            const answer = JSON.parse(response.data.choices[0].message.function_call.arguments)
            res.status(200).json({ answer });
        } catch (error) {
            console.error('GPTとの通信に失敗:', error);
            res.status(500).json({ error: 'GPTとの通信に失敗しました.' });
        }
    } else {
        res.status(405).json({ massage: '通信メソッドが対応していません.' })
    }
}