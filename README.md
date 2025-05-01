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

https://github.com/elizaOS/eliza/tree/v2-develop

1. Clone the repository into your eliza project packages folder:

```bash
git clone https://github.com/comput3ai/eliza-plugin-comput3ai.git 
```
2. Install dependencies:
add to your agent package.json 

"@compute3ai/plugin-comput3ai": "workspace:*"

3. Install dependencies:
```bash
bun install
```

4. Build the plugin:
```bash
bun run build
```

## Configuration

The plugin requires the following environment variables:

- `COMPUT3AI_API_KEY`: Your Comput3AI API key
- `COMPUT3AI_WALLET_ADDRESS`: Your Comput3AI wallet address
- `OPENAI_API_KEY=c3_api_key`
- `OPENAI_API_URL`= https://api.comput3.ai/v1
- `SMALL_OPENAI_MODEL`=llama3:70b

MEDIUM_OPENAI_MODEL=llama3:70b
LARGE_OPENAI_MODEL=llama3:70b
DEFAULT_MODEL=llama3:70b
MODEL_PROVIDER=openai
## Usage

1. add the plugin @compute3ai/plugin-comput3ai to the ai agent charater.json file 

2. Start the agent:

bun start --characters="path/to/your/character.json"

3. Access the UI 

pnpm start:client

### Example Commands

You can interact with the plugin through Eliza using natural language commands:

- "What's my current balance on Comput3?"
- "What's my Comput3 profile?"
- "What workload types are available on Comput3?"
- "Launch a new GPU workload of type media:fast that expires in 60 minutes"
- "List all my Comput3 workloads"
- "Stop my workload {workload_id}"


## License

This project is licensed under the terms specified in the repository.

## Support

For support and questions, please refer to the Comput3AI documentation or open an issue in the repository. 