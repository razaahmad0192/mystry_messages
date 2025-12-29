'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Mail, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/src/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/src/components/ui/carousel';

interface Confession {
  _id: string;
  content: string;
  createdAt: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'messages' | 'confessions'>('messages');
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'confessions') {
      fetchConfessions();
    }
  }, [activeTab]);

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

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'messages' ? 'default' : 'outline'}
            onClick={() => setActiveTab('messages')}
            className={`min-w-[120px] ${
              activeTab === 'messages' 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'border-white text-white bg-transparent hover:bg-white/10'
            }`}
          >
            <Mail className="mr-2 h-4 w-4" />
            Messages
          </Button>
          <Button
            variant={activeTab === 'confessions' ? 'default' : 'outline'}
            onClick={() => setActiveTab('confessions')}
            className={`min-w-[120px] ${
              activeTab === 'confessions' 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'border-white text-white bg-transparent hover:bg-white/10'
            }`}
          >
            <Heart className="mr-2 h-4 w-4" />
            Confessions
          </Button>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full max-w-lg md:max-w-xl"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}

        {/* Confessions Tab */}
        {activeTab === 'confessions' && (
          <div className="w-full max-w-2xl space-y-4">
            <div className="flex justify-between items-center mb-4">
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
        )}
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2023 True Feedback. All rights reserved.
      </footer>
    </>
  );
}