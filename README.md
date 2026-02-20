# Apexo Bot

A Telegram bot built with Grammy and deployed on Cloudflare Workers for managing patient and staff interactions in the Apexo app.

## Features

- **Multi-language Support**: English, Spanish, and Arabic
- **QR Code Registration**: Users can register by scanning QR codes containing their ID and server
- **Role-based Commands**: Different command sets for patients and staff
- **Session Management**: Persistent user sessions using Cloudflare KV
- **Type-safe**: Built with TypeScript for type safety

## Architecture

- **Runtime**: Cloudflare Workers
- **Framework**: Grammy (Telegram Bot framework)
- **Storage**: Cloudflare KV for session persistence
- **Language**: TypeScript
- **Deployment**: Wrangler CLI

## Setup

### Prerequisites

- Node.js (latest LTS version)
- Cloudflare account
- Telegram Bot token
- Wrangler CLI installed globally

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd apexo-bot
```

2. Install dependencies:
```bash
npm install
```

3. Set up Cloudflare Workers:
```bash
npx wrangler login
```

### Configuration

1. **Bot Token**: Set your Telegram bot token as a Cloudflare secret:
```bash
npx wrangler secret put BOT_TOKEN
```

2. **Bot Info & Bindings**: Bot information and KV bindings are pre-configured in `wrangler.jsonc` under `vars.BOT_INFO` and `kv_namespaces`.

## Development

### Local Development

Start the development server:
```bash
npm run dev
# or
npm start
```

This will start the bot in development mode with hot reloading.

### Testing

Run the test suite:
```bash
npm test
```

### Type Generation

Generate TypeScript types for Cloudflare Workers:
```bash
npm run cf-typegen
```

## Deployment

Deploy to Cloudflare Workers:
```bash
npm run deploy
```

## Usage

Users can register by sending a QR code image to the bot. The QR code should contain:
- User ID
- Name
- Server URL
- Language code (en/es/ar)

## Supported Languages

- English (`en`)
- Spanish (`es`) 
- Arabic (`ar`)

## API Integration

The bot integrates with PocketBase for:
- User data management
- Settings and configuration
- Healthcare records

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Roadmap

The project currently implements the core bot functionality but I'm planning to add the following features:

### For patients
- Patients should be able to schedule or at least ask for a new appointment.
- Patients should receive reminders for their appointments.
- Patients should be able to ask for the latest prescription.
- Patients should receive notifications once they are scheduled for an appointment or an appointment change.

### For staff
- Staff should be able to view their appointments for the day
- Staff Should receive notifications for new appointment requests
- Staff Should receive daily summaries of their upcoming appointments for the day

## License

MIT License.