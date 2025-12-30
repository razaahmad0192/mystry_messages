"use client"
import { Message } from '@/src/model/User'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { acceptMessageSchema } from '@/src/schemas/acceptMessageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/src/types/ApiResponse'
import MessageCard from '@/src/components/MessageCard'
import { Loader2, RefreshCcw } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Switch } from '@/src/components/ui/switch'
import { Separator } from '@/src/components/ui/separator'
import { User } from 'next-auth'
function Page() {
  const [messages, setMessages] = useState<Message[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId))
    toast.success("Message deleted successfully")
  }

  const { data: session } = useSession()
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })
  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages')
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessage === undefined ? false : response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || 'Error fetching accept messages setting')
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if (refresh) {
        toast.success("Refreshed messages successfully")
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || 'Error fetching messages')
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [setIsLoading, setMessages])

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessage();
    fetchMessages();
  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  //Handle Switch Change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || 'Error updating accept messages setting')
    }
  }
  if (!session || !session.user) {
    return <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center pt-20">Please Login</div>
  }
  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied to clipboard");
  };
  
  return (
    <div className="min-h-screen bg-gray-800 py-8 pt-24 px-2 md:px-8">
      <div className="lg:mx-auto p-6 bg-gray-700 rounded-lg w-full max-w-6xl border border-gray-600">
        <h1 className=" text-2xl md:textbase text-center md:text-4xl font-bold mb-4 text-white">User Dashboard</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-200">Copy Your Unique Link</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 p-2 rounded-md bg-gray-600 border border-gray-500 text-white placeholder-gray-400 disabled:opacity-70"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="text-gray-200">
              Accept Messages: {acceptMessages ? 'On' : 'Off'}
            </span>
          </div>
        </div>
        <Separator className="bg-gray-600" />

        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p className="text-gray-400">No messages to display.</p>
          )}
        </div>
      </div>
    </div>
  );

}

export default Page
