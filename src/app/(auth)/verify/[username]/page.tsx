"use client"
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { verifySchema } from '@/src/schemas/verifySchema'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/src/types/ApiResponse'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Form } from '@/src/components/ui/form'
import { Loader2, UserX, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

function VerifyAccount() {
    const router = useRouter()
    const param = useParams<{ username: string }>()
    const username = param.username;
    
    const [isCheckingUser, setIsCheckingUser] = useState(true);
    const [userExists, setUserExists] = useState<boolean | null>(null);
    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    // Check if user exists when component mounts
    useEffect(() => {
        const checkUserExists = async () => {
            if (!username) {
                setUserExists(false);
                setIsCheckingUser(false);
                return;
            }

            try {
                // For verify page, check if user exists (verified or not)
                const response = await axios.get<ApiResponse & { exists?: boolean; isVerified?: boolean }>(
                    `/api/check-user-exists?username=${encodeURIComponent(username)}&includeUnverified=true`
                );
                setUserExists(response.data.exists ?? true);
                setIsVerified(response.data.isVerified ?? false);
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                if (axiosError.response?.status === 404) {
                    setUserExists(false);
                    setIsVerified(false);
                } else {
                    // On other errors, assume user doesn't exist to be safe
                    setUserExists(false);
                    setIsVerified(false);
                }
            } finally {
                setIsCheckingUser(false);
            }
        };

        checkUserExists();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: param.username,
                code: data.code
            })
            toast.success(response.data.message)
            router.replace('/sign-in')
        } catch (error) {
            console.log("Error in signup of user:", error)
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message ?? 'Signup failed'

            toast.error(errorMessage)
        }
    }

    // Show loading state while checking user
    if (isCheckingUser) {
        return (
            <div className='flex justify-center items-center min-h-[83vh] bg-gray-100 md:mt-0 mt-20'>
                <div className='w-full px-4 sm:p-8 max-w-md space-y-8 bg-white rounded-lg shadow-md '>
                    <div className="flex flex-col items-center justify-center min-h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Checking user...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error page if user doesn't exist
    if (userExists === false) {
        return (
            <div className='flex justify-center items-center min-h-[83vh] bg-gray-100 md:mt-0 mt-20'>
                <div className='w-full px-4 sm:p-8 max-w-md space-y-8 bg-white rounded-lg shadow-md'>
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                        <UserX className="h-16 w-16 text-destructive mb-4" />
                        <h1 className="text-3xl font-bold mb-4">User Does Not Exist</h1>
                        <p className="text-muted-foreground mb-6">
                            The user <span className="font-semibold">@{username}</span> does not exist.
                        </p>
                        <div className="flex flex-col gap-4 w-full">
                            <Link href="/sign-up" className="w-full">
                                <Button className="w-full">Create Your Account</Button>
                            </Link>
                            <Link href="/sign-in" className="w-full">
                                <Button variant="outline" className="w-full">Go to Sign In</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show already verified page if user is already verified
    if (userExists === true && isVerified === true) {
        return (
            <div className='flex justify-center items-center min-h-[83vh] bg-gray-100 md:mt-0 mt-20'>
                <div className='w-full px-4 sm:p-8 max-w-md space-y-8 bg-white rounded-lg shadow-md'>
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                        <h1 className="text-3xl font-bold mb-4">Account Already Verified</h1>
                        <p className="text-muted-foreground mb-6">
                            The account for <span className="font-semibold">@{username}</span> is already verified.
                        </p>
                        <div className="flex flex-col gap-4 w-full">
                            <Link href="/sign-in" className="w-full">
                                <Button className="w-full">Go to Sign In</Button>
                            </Link>
                            <Link href="/" className="w-full">
                                <Button variant="outline" className="w-full">Go Home</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex justify-center items-center min-h-[83vh] bg-gray-100 md:mt-0 mt-20'>
            <div className='w-full p-8 max-w-md space-y-8 bg-white rounded-lg shadow-md'>
                <div className="text-center">
                    <h1 className="text-4xl text-center font-extrabold tracking-tight lg:text-5xl mb-6">Verify Your Account</h1>
                    <p className='mb-4 text-center font-medium'>
                        Please enter the verification code sent to your email.
                    </p>
                </div>


                <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="OTP Code " {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='w-full text-center' type="submit">Submit</Button>
      </form>
    </Form>
            </div>
        </div>
    )
}

export default VerifyAccount
