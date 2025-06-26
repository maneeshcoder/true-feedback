'use client'
import React, { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from "lucide-react";


const page = () => {
  const [Username, setUsername] = useState('')
  const [UsernameMessage, setUserMessage] = useState('')
  const [IsCheckingUsername, setIsCheckingUsername] = useState(false)
  const [IsSubmitting, setisSubmitting] = useState(false)
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300)
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (Username) {
        setIsCheckingUsername(true)
        setUserMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${Username}`)
          const { isAvailable, message } = response.data;
          setUserMessage(message);
          setIsUsernameAvailable(isAvailable); //
          // let message = response.data.message
          // setUserMessage(message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          const errorMessage = axiosError.response?.data.message || "Error checking username";
          // toast.error(errorMessage);
          setUserMessage(errorMessage);
          setIsUsernameAvailable(false);
          // const axiosError = error as AxiosError<ApiResponse>;
          // setUserMessage(
          //   AxiosError.response?.data.message ?? "Error checking username"
          // )
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },
    [Username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setisSubmitting(true)
    try {
      if (!isUsernameAvailable) {
        toast.error("Username is already taken");
        setisSubmitting(false);
        return;
      }
      const response = await axios.post<ApiResponse>(`/api/sign-up`, data)
      toast.success(response.data.message);
      router.replace(`/verify/${Username}`)
      setisSubmitting(false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "Error verifying code";
      toast.error(errorMessage);
      setisSubmitting(false);
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />
                  {IsCheckingUsername && <Loader2 className="animate-spin" />}
                  {!IsCheckingUsername && UsernameMessage && (
                    <p
                      className={`text-sm ${UsernameMessage === 'Username available'
                        ? 'text-green-500'
                        : 'text-red-500'
                        }`}
                    >
                      {UsernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={IsSubmitting}>
              {IsSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page

