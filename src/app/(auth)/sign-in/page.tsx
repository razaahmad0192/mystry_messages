"use client"
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { FormField } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { toast } from 'sonner'
import { Button } from '@/src/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { signInSchema } from '@/src/schemas/signInSchema'
import { signIn } from 'next-auth/react'


const page = () => {

  const [isSubmitting, setIsSubmitting] = useState(false)


  const router = useRouter()

  //Zod Implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  })


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {

    const result = await signIn('credentials', {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    })
    if (result?.error) {
        toast.error("Incorrect username or password")
    }
    if (result?.url)
      toast.success("Signed in successfully")
    router.replace('/dashboard')

  }

  return (
    <div className='flex justify-center items-center min-h-[83vh] bg-gray-100'>
      <div className='w-full p-8 max-w-md space-y-8 bg-white rounded-lg shadow-md md:mt-0 mt-20 '>
        <div className="text-center">
          <h1 className="text-4xl text-center font-extrabold tracking-tight lg:text-5xl mb-6">Welcome Back</h1>
          <p className='mb-4 text-center font-medium'>
            Login to continue your anonymous adventure!
          </p>
        </div>


        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email/Username" {...field}/>
                  </FormControl>
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
                  <FormControl>
                    <Input type='password' placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isSubmitting} className='w-full text-center'>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging In...
                </>
              ) : ('Login')}
            </Button>
          </form>
        </Form>
        <div className='text-center mt-4'>
          <p>
            Not Registered Yet?{' '}
            <Link href="/sign-up" className="text-blue-500 hover:text-blue-800">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page
