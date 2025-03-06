import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { TodoProvider } from '../context/TodoContext';
import Todo from '../components/Todo';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <TodoProvider>
        <Todo />
      </TodoProvider>
    </main>
  );
}
