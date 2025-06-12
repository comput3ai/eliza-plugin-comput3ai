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
- ElizaOS CLI
- Comput3AI API credentials

## Installation

### Method 1: Using ElizaOS CLI (Recommended)

1. Install the ElizaOS CLI if you haven't already:
```bash
bun install -g @elizaos/cli
```

2. Create a new ElizaOS project or navigate to your existing project:
```bash
elizaos create my-agent --type project
cd my-agent
```

3. Install the plugin:
```bash
bun install @elizaos/plugin-comput3ai
```

### Method 2: Development Setup

1. Clone this repository into your ElizaOS workspace:
```bash
# From your ElizaOS root directory
git clone https://github.com/comput3ai/eliza-plugin-comput3ai.git packages/plugin-comput3ai
```

2. Install dependencies from the ElizaOS root:
```bash
bun install
```

3. Build the plugin:
```bash
bun run build
```

## Configuration

### Environment Variables

Create or update your `.env` file with the following required variables:

```bash
# Comput3AI Credentials
COMPUT3AI_API_KEY=your_comput3ai_api_key
COMPUT3AI_WALLET_ADDRESS=your_comput3ai_wallet_address

# LLM Configuration (using Comput3AI's API)
OPENAI_API_KEY=your_comput3ai_api_key
OPENAI_API_URL=https://api.comput3.ai/v1
SMALL_OPENAI_MODEL=llama3:70b
MEDIUM_OPENAI_MODEL=llama3:70b
LARGE_OPENAI_MODEL=llama3:70b
DEFAULT_MODEL=llama3:70b
MODEL_PROVIDER=openai
```

### Character Configuration

Add the plugin to your character configuration file (e.g., `characters/your-agent.character.json`):

```json
{
  "name": "YourAgent",
  "plugins": [
    "@elizaos/plugin-comput3ai"
  ],
  "modelProvider": "openai",
  "settings": {
    "secrets": {}
  }
}
```

## Usage

### Starting Your Agent

1. Start your agent using the ElizaOS CLI:
```bash
elizaos start --character="characters/your-agent.character.json"
```

2. Access the web interface:
```
http://localhost:3000
```

3. Interact with your agent through the chat interface or supported clients (Discord, Telegram, etc.)

### Example Commands

You can interact with the plugin through natural language commands:

- "What's my current balance on Comput3?"
- "What's my Comput3 profile?"
- "What workload types are available on Comput3?"
- "Launch a new GPU workload of type media:fast that expires in 60 minutes"
- "List all my Comput3 workloads"
- "Stop my workload {workload_id}"

### Development and Testing

For development purposes, you can run the agent in debug mode:

```bash
LOG_LEVEL=debug elizaos start --character="characters/your-agent.character.json"
```

To test the plugin actions directly:
```bash
elizaos test
```

## Plugin Architecture

This plugin follows the standard ElizaOS plugin architecture:

- **Actions**: Define specific behaviors the agent can perform
- **Providers**: Supply contextual information to the agent
- **Services**: Handle external API integrations
- **Types**: Define TypeScript interfaces for type safety

## Available Actions

- `GET_USER_BALANCE`: Retrieve Comput3AI wallet balance
- `GET_USER_PROFILE`: Get user profile information
- `GET_WORKLOAD_TYPES`: List available workload types
- `LIST_WORKLOADS`: Show user's workloads
- `LAUNCH_WORKLOAD`: Start a new GPU workload
- `STOP_WORKLOAD`: Stop a running workload

## Troubleshooting

### Common Issues

1. **Plugin not found**: Ensure the plugin is properly installed and listed in your character's plugins array
2. **API key errors**: Verify your `COMPUT3AI_API_KEY` is correct and has proper permissions
3. **Build errors**: Run `bun install` and `bun run build` from the ElizaOS root directory

### Debug Mode

Enable detailed logging:
```bash
LOG_LEVEL=debug elizaos start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the terms specified in the repository.

## Support

For support and questions, please refer to the Comput3AI documentation or open an issue in the repository. 