import React from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { ApiResponse } from '../types/ApiResponse';
import { Message } from '../model/User';
import dayjs from 'dayjs';

type messageCardProps = {
    message : Message,
    onMessageDelete : (messageId : string) => void
}
function MessageCard({message, onMessageDelete}: messageCardProps) {
    const handleDeleteConfirm = async () =>{
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id.toString()}`)
        toast.message(response.data.message)
        onMessageDelete(message._id.toString())
    }
    return (
        <Card className="bg-gray-600 border-gray-500">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-700 border-gray-600">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-300">
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-600 text-white border-gray-500 hover:bg-gray-500">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm text-gray-400">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
    )
}

export default MessageCard
