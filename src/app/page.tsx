'use client'
import { useForm, SubmitHandler } from "react-hook-form"
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Radio, RadioGroup, Stack, Text, Textarea, useBreakpointValue, useToast } from '@chakra-ui/react'
import TextareaAutosize from 'react-textarea-autosize';
import { useState } from 'react'
import axios from "axios"
import Image from "next/image"
import Link from "next/link";

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
        "苗字 名前\n" +
        "E-MAIL：\n" +
        "TEL：\n" +
        "ー・－・－・－・－・－・－・－・－・－・－・－・－・－・－・－・－",
    }
  });

  const [type, setType] = useState("新規");
  const [tone, setTone] = useState("デフォルト");

  const [responseSub, setResponseSub] = useState("");
  const [responseBody, setResponseBody] = useState("");

  const toast = useToast();

  const handleCopyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: 'コピーしました！',
      status: 'success',
      duration: 2000,
      isClosable: true,

    });
  }

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);

    const conversation = [
      {
        role: "user", content:
          `
          # 命令
          あなたはメールの内容を以下の情報をもとに生成するAIボットです。要件にあった返信を生成してください。
          # 要件
          - メールタイプ: ${type}
          - 受信メール: ${data.text3}
          - 送信者の名前: ${data.text5}
          - 宛先の名前: ${data.text6}
          - 宛先の属性: ${data.text1}
          - メールの内容: ${data.text2}
          - 参考にしてほしいメールの構造: ${data.text4}
          - 最後に付けてほしい帯: ${data.text7}
          - メールのトーン: ${tone}
          # 補足条件
          - 返答はメールの本文のみを含めて、それ以外の文字は入れないでください。
        `
      }
    ];

    try {
      const res = await axios.post('/api/gpt', { conversation });
      setResponseSub(res.data.answer.subject.toString());
      setResponseBody(res.data.answer.body.toString());
    } catch (error) {
      console.error('GPTとの通信に失敗:', error);
      setResponseSub('エラーが発生しました。もう一度お試しください。');
      setResponseBody('エラーが発生しました。もう一度お試しください。');
    }
    setIsLoading(false);
  }

  const placeholder = useBreakpointValue({ base: "例：web面接の日程を〇〇日から〇〇日に変更できないか聞きたい。", md: "例：内定を承諾する旨を伝えたい。\n　　web面接の日程を〇〇日から〇〇日に変更できないか聞きたい。\n　　体調不良で今日の〇〇時から〇〇時のシフトに出ることができないことを伝えたい。" })

  return (
    <>
      <Box bg={"#f1f1f1"} display={"flex"} justifyContent={"center"}>
        <Box w={{ base: "92%", md: "70%" }}>
          <Box
            w={300}
            h={76.4}
            bg={"white"}
            boxShadow="md"
            my={3}
            mx={{ base: "auto", sm: "0" }}  // baseとsmで中央揃え、md以上で左揃え
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


          <Box bg={"white"} boxShadow="md" mb={3} px={2} py={4}>
            <Heading
              as="h1"
              size="md"
              mb={3}
              sx={{
                padding: '0.25em 0.5em',
                color: '#494949',
                backgroundColor: 'transparent',
                borderLeft: 'solid 5px #7db4e6',
              }}
            >
              生成したいメール情報を入力
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>

              <FormControl mb={3}>
                <FormLabel>メールタイプ</FormLabel>
                <RadioGroup onChange={setType} value={type}>
                  <Stack direction='row'>
                    <Radio value='新規'>新規</Radio>
                    <Radio value='返信'>返信</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              {type === "返信" && (
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
                  placeholder='例：企業、インターン先、教授、バイト先'
                  {...register('text1', { required: true })}
                />
              </FormControl>

              <FormControl isRequired mb={3}>
                <FormLabel>内容</FormLabel>
                <Textarea
                  placeholder={placeholder}
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

              <FormControl mb={4}>
                <FormLabel>トーン</FormLabel>
                <RadioGroup onChange={setTone} value={tone}>
                  <Stack direction={{ base: 'column', sm: 'row' }}>
                    <Stack direction='row'>
                      <Radio value='デフォルト'>デフォルト</Radio>
                      <Radio value='ビジネス'>ビジネス</Radio>
                    </Stack>
                    <Stack direction='row'>
                      <Radio value='フォーマル'>フォーマル</Radio>
                      <Radio value='カジュアル'>カジュアル</Radio>
                    </Stack>
                  </Stack>
                </RadioGroup>
              </FormControl>

              {isLoading ? (
                <Flex justifyContent={{ base: "flex-end", md: "flex-start" }}>
                  <Button isLoading size="md" colorScheme="blue" type="submit">
                    メールを生成
                  </Button>
                </Flex>
              ) : (
                <Flex justifyContent={{ base: "flex-end", md: "flex-start" }}>
                  <Button size="md" colorScheme='blue' type="submit" mb={1}>メールを生成</Button>
                </Flex>
              )}
            </form>
          </Box>


          <Box bg={"white"} boxShadow="md" mb={3} px={2} py={4}>

            <Heading
              as="h1"
              size="md"
              mb={3}
              sx={{
                padding: '0.25em 0.5em',
                color: '#494949',
                backgroundColor: 'transparent',
                borderLeft: 'solid 5px #FFC107',
              }}
            >
              生成されたメール
            </Heading>

            <FormControl mb={1}>
              <FormLabel>件名</FormLabel>
              <Input
                placeholder={"メールは何回でも生成できます"}
                value={responseSub}
                onChange={(e) => setResponseSub(e.target.value)}
              />
            </FormControl>

            <Flex justifyContent={{ base: "flex-end", md: "flex-start" }}>
              <Button colorScheme='blue' onClick={() => handleCopyToClipboard(responseSub)} mb={3}>コピー</Button>
            </Flex>

            <FormControl mb={1}>
              <FormLabel>本文</FormLabel>
              <Textarea
                placeholder={"メールは何回でも生成できます"}
                value={responseBody}
                as={TextareaAutosize}
                onChange={(e) => setResponseBody(e.target.value)}
              />
            </FormControl>
            <Flex justifyContent={{ base: "flex-end", md: "flex-start" }}>
              <Button colorScheme='blue' onClick={() => handleCopyToClipboard(responseBody)} mb={3}>コピー</Button>
            </Flex>
          </Box>

        </Box>
      </Box>
      <Box bg="gray.400" color="white" pb={6} pt={3} textAlign="center">

        <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
          <div style={{ maxWidth: '200px' }}>
            <Image
              src="/images/gpt.png"
              alt="Description of the image"
              width={200}
              height={1}
              layout="responsive"
            />
          </div>
        </Box>


        <Text fontSize="sm">
          Powered by ChatGPT-4o.
        </Text>
        <Text fontSize="sm">
          © 2024{" "}
          <Link href="https://go-morishita.vercel.app/" target="_blank" rel="noopener noreferrer">
            <Text as="span" color="blue.500" textDecoration="underline">
              Go Morishita
            </Text>
          </Link>. All Rights Reserved.
        </Text>
      </Box>
    </>
  )
}