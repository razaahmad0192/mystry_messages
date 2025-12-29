'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ConfessionForm from '@/src/components/ConfessionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Heart } from 'lucide-react';

export default function ConfessionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <main className="flex-grow min-h-[83vh] flex items-center justify-center px-4 sm:px-6 md:px-24 py-12 bg-gray-800 text-white">
        <p>Loading...</p>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="flex-grow min-h-[83vh] flex flex-col items-center justify-center px-4 sm:px-6 md:px-24 py-12 bg-gray-800 text-white w-full">
      <div className="w-full max-w-2xl">
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-pink-500" />
              <CardTitle className="text-2xl">Share Your Confession</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6">
              Express yourself anonymously. Your confession will be shared on the confession board.
            </p>
            <ConfessionForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

