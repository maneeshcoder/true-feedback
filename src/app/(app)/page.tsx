'use client';

import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <main className="flex-grow flex flex-col items-center justify-start px-6 md:px-24 py-10">
        {/* Header Section */}
        <section className="text-center mb-10 mt-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Dive into the World of{' '}
            <span className="text-indigo-400">Anonymous Feedback</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300">
            True Feedback — Where your identity remains a secret.
          </p>
        </section>

        {/* Carousel */}
        <div className="relative w-full max-w-2xl">
          <Carousel plugins={[Autoplay({ delay: 3000 })]}>
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-6">
                  <Card className="bg-gray-100 text-gray-900 shadow-lg transition-transform duration-300 hover:scale-[1.01]">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start gap-4">
                      <Mail className="text-indigo-500 w-5 h-5" />
                      <div>
                        <p className="text-base font-medium">{message.content}</p>
                        <p className="mt-2 text-xs text-gray-500">{message.received}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Carousel Controls */}
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 text-white" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 text-white" />
          </Carousel>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 border-t">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Maneesh Rawat. All rights reserved.</p>
          <div className="flex justify-center mt-4 space-x-6">
            <a href="https://github.com/maneeshcoder" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
              <FaGithub size={20} />
            </a>
            <a href="https://www.linkedin.com/in/maneesh-rawat-461a76251" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaLinkedin size={20} />
            </a>
            <a href="https://instagram.com/mr_maneesh07" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
