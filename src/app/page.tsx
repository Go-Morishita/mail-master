'use client'
import { useForm, SubmitHandler, Form } from "react-hook-form"
import { Button, Input, Radio, RadioGroup, Stack, Text, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import axios from "axios"

type Inputs = {
  text1: string
  text2: string
  text3: string
  text4: string
}

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [tone, setTone] = useState('ビジネス')
  const [responseText, setResponseText] = useState("");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const conversation = [
      {
        role: "user", content:
          `
          # 命令
          あなたはメールの内容を以下の情報をもとに生成するAIボットです。要件にあった返信を生成してください。
          # 要件
          - 送信先: ${data.text1}
          - トーン: ${tone}
          - 内容: ${data.text2}
          - 受信したメール: ${data.text3}
          - 参考にしてほしいフォーマット: ${data.text4}
          # 補足条件
          - 返答はメールの本文のみを含めて、それ以外の文字は入れないでください。
        `
      }
    ];

    try {
      const res = await axios.post('/api/gpt', { conversation });
      setResponseText(res.data.answer.toString());
    } catch (error) {
      console.error('GPTとの通信に失敗:', error);
      setResponseText('エラーが発生しました。もう一度お試しください。');
    }
  }


  return (
    <>
      <Text> メールマスター</Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioGroup onChange={setTone} value={tone}>
          <Stack>
            <Radio value='ビジネス'>ビジネス</Radio>
            <Radio value='フォーマル'>フォーマル</Radio>
            <Radio value='カジュアル'>カジュアル</Radio>
          </Stack>
        </RadioGroup>
        <Input
          placeholder='送信先（「インターン先」「教授」など...）'
          {...register('text1', { required: true })}
        />
        <Textarea
          placeholder='だいたいの内容（「13時15分研究室訪問のアポイントをとりたい」など...）'
          {...register('text2', { required: true })}
        />
        <Textarea
          placeholder='返信の場合は送信されてきたメール'
          {...register('text3')}
        />
        <Textarea
          placeholder='過去のメールと同じ構造にしたい場合のなどはここに過去のメールを貼り付ける'
          {...register('text4')}
        />
        <Button colorScheme='blue' type="submit">返信を生成</Button>
      </form>

      {responseText && (
        <div
        style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f7f7f7' }}
        dangerouslySetInnerHTML={{ __html: responseText }}
      />
      )}
    </>
  )
}