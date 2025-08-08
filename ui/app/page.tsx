import LandingPage from '@/components/LandingPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perplexica - AI-Powered Search & Chat',
  description: 'Search, chat, and discover with AI-powered intelligence. Perplexica combines web search with conversational AI.',
};

const Home = () => {
  return <LandingPage />;
};

export default Home;
