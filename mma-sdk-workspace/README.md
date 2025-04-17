# MMA SDK Workspace

This workspace contains a TypeScript SDK for interacting with the Korean Military Manpower Administration (MMA) website and a demo web application.

## Project Structure

- `packages/mma-sdk`: TypeScript SDK for the MMA website
- `packages/ui`: Shared UI components using shadcn/ui
- `apps/web`: Next.js web application demo

## Getting Started

### Prerequisites

- Node.js 16+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Development

```bash
# Start development server
pnpm dev
```

Visit `http://localhost:3000` to see the web application.

## MMA SDK Features

The SDK provides an interface to interact with the MMA website, specifically for searching military service-designated companies:

- Get service types (복무형태)
- Get company sizes (기업별)
- Get industry types (업종선택)
- Get provinces/regions (시도)
- Get cities/districts (시군구)
- Search companies with various filters
- Parse HTML responses into structured data

## Web Demo Features

The web application demonstrates the use of the MMA SDK with a user-friendly interface:

- Search form with all available filters
- Results display with pagination
- Responsive design

## Technologies

- TypeScript
- React/Next.js
- Turborepo
- pnpm
- Tailwind CSS
- shadcn/ui
- Vitest 