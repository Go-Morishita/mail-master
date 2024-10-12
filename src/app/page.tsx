'use client'
import { useForm, SubmitHandler } from "react-hook-form"
import { Box, Button, FormControl, FormLabel, Input, Radio, RadioGroup, Stack, Textarea, useBreakpointValue } from '@chakra-ui/react'
import { useState } from 'react'
import axios from "axios"
import Image from "next/image"

type Inputs = {
  text1: string
  text2: string
  text3: string
  text4: string
  text5: string
  text6: string
  text7: string
}

export default function Page() {
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>({
    defaultValues: {
      text7: "ー・－・－・－・－・－・－・－・－・－・－・－・－・－・－・－・－\n" +
        "〇〇大学 〇〇学部 〇〇学科\n" +
        "メール 太郎\n" +
        "E-MAIL：\n" +
        "TEL：\n" +
        "ー・－・－・－・－・－・－・－・－・－・－・－・－・－・－・－・－",
    }
  });

  const [type, setType] = useState("1");
  const [responseText, setResponseText] = useState("");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const conversation = [
      {
        role: "user", content:
          `
          # 命令
          あなたはメールの内容を以下の情報をもとに生成するAIボットです。要件にあった返信を生成してください。
          # 要件
          - 送信者の名前: ${data.text5}
          - 送信先の名前: ${data.text6}
          - 送信先の詳細: ${data.text1}
         
          - 内容: ${data.text2}
          - 受信したメール: ${data.text3}
          - 参考にしてほしいメールの構造: ${data.text4}
          - 最後に付けてほしい帯: ${data.text7}
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

  const placeholder = useBreakpointValue({base: "例：web面接の日程を〇〇日から〇〇日に変更できないか聞きたい。", md:"例：内定を承諾する旨を伝えたい。\n　　web面接の日程を〇〇日から〇〇日に変更できないか聞きたい。\n　　体調不良で今日の〇〇時から〇〇時のシフトに出ることができないことを伝えたい。"})

  return (
    <>
      <Box bg={"#f1f1f1"} display={"flex"} justifyContent={"center"}>
        <Box w={"90%"}>
          <Box
            w={300}
            h={76.4}
            bg={"white"}
            boxShadow="md"
            my={3}
            mx={{ base: "auto", md: "0" }}  // baseとsmで中央揃え、md以上で左揃え
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              src="/images/logo.png"
              alt="logo.png"
              width={300}
              height={76.4}
            />
          </Box>


          <Box bg={"white"} boxShadow="md" mb={3} p={2}>
            <form onSubmit={handleSubmit(onSubmit)}>

              <FormControl isRequired mb={3}>
                <FormLabel>メールタイプ</FormLabel>
                <RadioGroup onChange={setType} value={type}>
                  <Stack direction='row'>
                    <Radio value='1'>新規</Radio>
                    <Radio value='2'>返信</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              {type === "2" && (
                <FormControl isRequired mb={3}>
                  <FormLabel>受信メール</FormLabel>
                  <Textarea
                    placeholder='相手から受信したメールの本文をここに貼り付けてください'
                    {...register('text3')}
                  />
                </FormControl>
              )}

              <FormControl isRequired mb={3}>
                <FormLabel>あなた（氏名）</FormLabel>
                <Input
                  placeholder=''
                  {...register('text5', { required: true })}
                />
              </FormControl>

              <FormControl isRequired mb={3}>
                <FormLabel>宛先（氏名）</FormLabel>
                <Input
                  placeholder=''
                  {...register('text6', { required: true })}
                />
              </FormControl>

              <FormControl isRequired mb={3}>
                <FormLabel>宛先（属性）</FormLabel>
                <Input
                  placeholder='例：企業、インターン先、教授、バイト先、友達'
                  {...register('text1', { required: true })}
                />
              </FormControl>

              <FormControl isRequired mb={3}>
                <FormLabel>内容</FormLabel>
                <Textarea
                  placeholder={placeholder}
                  h={{ base: 100, md: 85 }}
                  {...register('text2', { required: true })}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>構造</FormLabel>
                <Textarea
                  placeholder={"例：シンプルに短くまとめる、改行を多めに\n（過去に送信したメールと同じ構造にしたい場合は、ここに過去のメールを貼り付ける）"}
                  {...register('text4')}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>署名</FormLabel>
                <Textarea
                  h={150}
                  {...register('text7')}
                />
              </FormControl>

              <Button colorScheme='blue' type="submit">生成</Button>
            </form>

            {responseText && (
              <div
                style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f7f7f7' }}
                dangerouslySetInnerHTML={{ __html: responseText }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </>
  )
}