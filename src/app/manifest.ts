import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CreatorAI Pro',
    short_name: 'CreatorAI',
    description: 'The AI Content Engine for Indian Creators',
    start_url: '/',
    display: 'standalone',
    background_color: '#06070B',
    theme_color: '#6C47FF',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
