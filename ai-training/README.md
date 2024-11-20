# 🎯 Cursor Training App

[![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.46-3ECF8E?logo=supabase)](https://supabase.io/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-black)](https://ui.shadcn.com/)

A modern web application for managing API keys with a sleek dashboard interface, built with Next.js and Supabase.

## ✨ Features

- 🔐 Secure authentication with Supabase Auth
- 📊 Interactive dashboard for API key management
- 🔄 Real-time updates and state management
- 📱 Responsive design with Tailwind CSS
- 🎨 Beautiful UI components from shadcn/ui
- 🚀 Server-side rendering with Next.js App Router

## 🚀 Getting Started

1. Clone the repository:
bash
git clone https://github.com/yourusername/cursor-training-app.git
cd cursor-training-app

2. Install dependencies:
bash
npm install
or
yarn install

3. Set up environment variables:
Create a `.env.local` file with the following:
env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

4. Run the development server:
bash
npm run dev
or
yarn dev

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure
src/
├── app/ # Next.js App Router pages
├── components/ # Reusable UI components
├── services/ # API services and business logic
├── lib/ # Utility functions and configurations
└── types/ # TypeScript type definitions

## 🔧 Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **State Management**: React Hooks + Context
- **Deployment**: Vercel (recommended)

## 📦 Deployment

The easiest way to deploy is using the [Vercel Platform](https://vercel.com):

1. Push your code to a Git repository
2. Import your project to Vercel
3. Add your environment variables
4. Deploy!

## 🛠️ Development

- Run tests: `npm test`
- Build for production: `npm run build`
- Lint code: `npm run lint`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, email your-email@example.com or open an issue in this repository.