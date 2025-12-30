'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, UserX } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Separator } from '@/src/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/src/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Textarea } from '@/src/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/src/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/src/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user exists when component mounts
  useEffect(() => {
    const checkUserExists = async () => {
      if (!username) {
        setUserExists(false);
        setIsCheckingUser(false);
        return;
      }

      try {
        const response = await axios.get<ApiResponse & { exists?: boolean }>(
          `/api/check-user-exists?username=${encodeURIComponent(username)}`
        );
        setUserExists(response.data.exists ?? true);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response?.status === 404) {
          setUserExists(false);
        } else {
          // On other errors, assume user doesn't exist to be safe
          setUserExists(false);
        }
      } finally {
        setIsCheckingUser(false);
      }
    };

    checkUserExists();
  }, [username]);

  // const {
  //   complete,
  //   completion,
  //   isLoading: isSuggestLoading,
  //   error,
  // } = useCompletion({
  //   api: '/api/suggest-messages',
  //   initialCompletion: initialMessageString,
  // });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast.success(response.data.message);
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'Failed to send message'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form validation errors with toasts
  const handleFormError = (errors: any) => {
    if (errors.content) {
      const errorMessage = errors.content.message || 'Please check your message';
      toast.error(errorMessage);
    }
  };

  // const fetchSuggestedMessages = async () => {
  //   try {
  //     complete('');
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //     // Handle error appropriately
  //   }
  // };

  // Show loading state while checking user
  if (isCheckingUser) {
    return (
      <div className="container mx-auto my-8 px-4 sm:p-6 bg-white rounded max-w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Checking user...</p>
        </div>
      </div>
    );
  }

  // Show error page if user doesn't exist
  if (userExists === false) {
    return (
      <div className="container mx-auto my-8 px-4 sm:p-6 bg-white rounded max-w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <UserX className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-3xl font-bold mb-4">User Does Not Exist</h1>
          <p className="text-muted-foreground mb-6">
            The user <span className="font-semibold">@{username}</span> does not exist or is not verified.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Create Your Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl mt-20 md:mt-0 ">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, handleFormError)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent || messageContent.trim().length < 5}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            // onClick={fetchSuggestedMessages}
            className="my-4"
            // disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div> */}
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}