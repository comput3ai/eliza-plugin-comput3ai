# @elizaos/plugin-comput3ai

A plugin for Comput3AI GPU Services API that integrates with the ElizaOS platform.

## Description

This plugin enables interaction with Comput3AI's GPU services through the ElizaOS platform. It provides a seamless interface for managing GPU workloads, checking balances, and accessing Comput3AI services.

## Features

- Check Comput3AI wallet balance
- View Comput3AI profile
- List available workload types
- Launch new GPU workloads
- Manage existing workloads
- Stop running workloads

## Prerequisites

- Node.js >= 18.0.0
- Bun package manager
- ElizaOS platform
- Comput3AI API credentials

## Installation

1. Clone the repository:
```bash
git clone github:comput3ai/plugin-compute3ai
```

2. Install dependencies:
```bash
bun install
```

3. Build the plugin:
```bash
bun run build
```

## Configuration

The plugin requires the following environment variables:

- `COMPUT3AI_API_KEY`: Your Comput3AI API key
- `COMPUT3AI_WALLET_ADDRESS`: Your Comput3AI wallet address

## Usage

1. Start the plugin:
```bash
bun start
```

2. Access the UI at `http://localhost:3000`

### Example Commands

You can interact with the plugin through Eliza using natural language commands:

- "What's my current balance on Comput3?"
- "What's my Comput3 profile?"
- "What workload types are available on Comput3?"
- "Launch a new GPU workload of type media:fast that expires in 60 minutes"
- "List all my Comput3 workloads"
- "Stop my workload {workload_id}"

## Development

- Run in development mode:
```bash
bun run dev
```

- Format code:
```bash
bun run format
```

- Check formatting:
```bash
bun run format:check
```

## Building

```bash
bun run build
```

## Publishing

```bash
bun run publish
```

## License

This project is licensed under the terms specified in the repository.

## Support

For support and questions, please refer to the Comput3AI documentation or open an issue in the repository. 