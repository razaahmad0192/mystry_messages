'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';

interface Confession {
  _id: string;
  content: string;
  createdAt: string;
}

export default function Home() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConfessions();
  }, []);

  async function fetchConfessions() {
    setLoading(true);
    try {
      const response = await fetch('/api/confessions');
      const data = await response.json();
      if (data.success) {
        setConfessions(data.confessions || []);
      }
    } catch (error) {
      console.error('Failed to fetch confessions:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
 
  return (
    <>
      {/* Main content */}
      <main className="flex-grow min-h-[83vh] flex flex-col items-center justify-center px-4 sm:px-6 md:px-24 py-12 bg-gray-800 text-white w-full overflow-x-hidden">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        {/* Confessions */}
        <div className="w-full max-w-2xl space-y-4">
          <div className="flex md:flex-row flex-col-reverse  md:justify-between items-center mb-4 gap-2">
            <h2 className="text-2xl font-bold ">Confession Board</h2>
            <Link href="/Confession">
              <Button>Post Confession</Button>
            </Link>
          </div>
          {loading ? (
            <p className="text-center">Loading confessions...</p>
          ) : confessions.length > 0 ? (
            <div className="space-y-4">
              {confessions.map((confession) => (
                <Card key={confession._id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Heart className="flex-shrink-0 mt-1 h-5 w-5 text-pink-500" />
                      <div className="flex-1">
                        <p className="text-white whitespace-pre-wrap">{confession.content}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(confession.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-8 text-center">
                <p className="text-gray-400">No confessions yet. Be the first to share!</p>
                <Link href="/Confession">
                  <Button variant="outline" className="mt-4">
                    Post First Confession
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2023 True Feedback. All rights reserved.
      </footer>
    </>
  );
}