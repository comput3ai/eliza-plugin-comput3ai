/**
 * Stop Workload Action
 * 
 * This action stops a running workload on the Comput3AI platform.
 */
import {
  type Action,
  type ActionExample,
  type Content,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  type State,
  ModelType,
  composePrompt,
  logger,
  parseJSONObjectFromText,
} from "@elizaos/core";
import dotenv from "dotenv";
import { createComput3ApiClient } from "../utils/apiClient";
import type { StopWorkloadRequest, StopWorkloadResponse } from "../types";
import { ERROR_MESSAGES } from "../constants";
import { ENHANCED_STOP_WORKLOAD_TEMPLATE, validateStopWorkloadFromText } from "../utils/validation";

// Load environment variables
dotenv.config();

/**
 * Interface for stop workload content extracted from user message
 */
interface StopWorkloadContent extends Content {
  workload: string;
}

/**
 * Validates if the content is valid for stopping a workload
 * 
 * @param content - Content to validate
 * @returns Whether the content is valid
 */
function isStopWorkloadContent(content: StopWorkloadContent): boolean {
  logger.debug("Validating stop workload content:", content);
  
  if (!content.workload || typeof content.workload !== 'string') {
    logger.debug("Invalid content: Missing or invalid workload ID");
    return false;
  }
  
  return true;
}

/**
 * Template for extracting stop workload parameters from user messages
 */
const stopWorkloadTemplate = ENHANCED_STOP_WORKLOAD_TEMPLATE;

/**
 * Action to stop a running workload on Comput3AI
 */
export const stopWorkloadAction: Action = {
  /**
   * Action identifier
   */
  name: "STOP_WORKLOAD",
  
  /**
   * Alternative action names
   */
  similes: [
    "TERMINATE_WORKLOAD",
    "END_WORKLOAD",
    "SHUTDOWN_WORKLOAD",
    "STOP_GPU",
    "TERMINATE_GPU",
  ],
  
  /**
   * Validate action prerequisites
   * 
   * @param runtime - ElizaOS agent runtime
   * @param message - Triggering message
   * @returns Whether the action can be executed
   */
  validate: async (runtime: IAgentRuntime, _message: Memory): Promise<boolean> => {
    logger.debug("Validating STOP_WORKLOAD action");
    
    const apiKey = runtime.getSetting("COMPUT3AI_API_KEY") || process.env.COMPUT3AI_API_KEY;
    
    if (!apiKey) {
      logger.error("STOP_WORKLOAD validation failed: Missing API key");
      return false;
    }
    
    logger.debug("STOP_WORKLOAD validation successful");
    return true;
  },
  
  /**
   * Human-readable description of the action
   */
  description: "Stops a running GPU workload on Comput3AI",
  
  /**
   * Main action handler
   * 
   * @param runtime - ElizaOS agent runtime
   * @param message - Triggering message
   * @param state - State object
   * @param options - Additional options
   * @param callback - Callback for sending response
   * @returns Success status
   */
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: Record<string, unknown>,
    callback: HandlerCallback
  ): Promise<boolean> => {
    logger.info("Executing STOP_WORKLOAD action");
    
    try {
      // Create API client
      logger.debug("Creating Comput3AI API client");
      const apiClient = createComput3ApiClient(runtime);
      
      // Extract stop parameters from message
      logger.debug("Extracting stop parameters from message");
      let stopParams: StopWorkloadContent;
      
      // Log the entire message content for debugging
      logger.debug("Message content:", JSON.stringify(message.content, null, 2));
      
      if (message.content && typeof message.content === 'object' && 'workload' in message.content && typeof message.content.workload === 'string') {
        // Parameters were directly provided in structured content
        stopParams = {
          workload: message.content.workload,
          ...message.content
        };
        logger.debug("Using directly provided workload ID:", stopParams.workload);
      } else if (message.content && typeof message.content === 'object' && 'text' in message.content && typeof message.content.text === 'string') {
        // Need to extract parameters from text
        logger.debug("Attempting to extract workload ID from text:", message.content.text);
        
        // First try direct text extraction before using LLM
        const extractedParams = validateStopWorkloadFromText(message.content.text);
        
        if (extractedParams) {
          logger.debug("Direct text extraction successful:", extractedParams);
          stopParams = extractedParams;
        } else {
          // If direct extraction fails, use LLM
          const prompt = composePrompt({
            template: stopWorkloadTemplate,
            state: { recentMessages: formatRecentMessages(state) },
          });
          
          logger.debug("Extracting workload ID using LLM");
          const result = await runtime.useModel(ModelType.TEXT_SMALL, {
            prompt,
          });
          
          logger.debug("LLM extraction result:", result);
          stopParams = parseJSONObjectFromText(result) as StopWorkloadContent;
          
          if (!isStopWorkloadContent(stopParams)) {
            logger.error("LLM extraction failed to produce valid workload ID");
            
            callback({
              text: "Failed to identify a workload ID to stop. Please provide a specific workload ID like '7b69314d-c88d-47d9-920c-ae827f6b7844' or 'name-name-name-gpu.comput3.ai'.",
              content: { 
                success: false, 
                error: "Could not extract workload ID" 
              },
            });
            
            return false;
          }
        }
      } else {
        // No valid content found
        const errorMessage = "No valid message content to extract workload ID from";
        logger.error(`STOP_WORKLOAD failed: ${errorMessage}`);
        
        callback({
          text: `Failed to stop workload: ${errorMessage}. Please specify a valid workload ID (either UUID format like "7b69314d-c88d-47d9-920c-ae827f6b7844" or domain format like "name-name-name-gpu.comput3.ai").`,
          content: { 
            success: false, 
            error: errorMessage 
          },
        });
        
        return false;
      }
      
      // Validate parameters
      if (!isStopWorkloadContent(stopParams)) {
        const errorMessage = ERROR_MESSAGES.INVALID_WORKLOAD_ID || "Invalid workload ID";
        logger.error(`STOP_WORKLOAD failed: ${errorMessage}`);
        
        callback({
          text: `Failed to stop workload: ${errorMessage}. Please specify a valid workload ID (either UUID format like "7b69314d-c88d-47d9-920c-ae827f6b7844" or domain format like "name-name-name-gpu.comput3.ai").`,
          content: { 
            success: false, 
            error: errorMessage 
          },
        });
        
        return false;
      }
      
      // Prepare stop request
      const request: StopWorkloadRequest = {
        workload: stopParams.workload,
      };
      
      logger.debug("Stopping workload with ID:", stopParams.workload);
      logger.debug("Full stop request parameters:", request);
      
      // Initial response to user confirming which workload is being stopped
      callback({
        text: `Stopping your workload with ID '${stopParams.workload}' now...`,
        content: { 
          processing: true,
          workload: stopParams.workload
        },
      });
      
      // Stop workload
      const response = await apiClient.stopWorkload(request);
      
      // Check for success
      if (!response.success || !response.data) {
        const errorMessage = response.error || "Failed to stop workload";
        logger.error(`STOP_WORKLOAD failed: ${errorMessage}`);
        logger.debug("Full error response:", JSON.stringify(response, null, 2));
        
        let userMessage = `Failed to stop workload ${stopParams.workload}: ${errorMessage}`;
        
        // Add more helpful context for 502 errors
        if (response.statusCode === 502) {
          userMessage = `Failed to stop workload ${stopParams.workload}: Server error (502 Bad Gateway). The Comput3AI service is currently experiencing issues. Please try again later or contact Comput3AI support if the problem persists.`;
        }
        
        callback({
          text: userMessage,
          content: { 
            success: false, 
            error: errorMessage,
            statusCode: response.statusCode,
            workload: stopParams.workload
          },
        });
        
        return false;
      }
      
      // Process successful response
      const stopResponse = response.data;
      logger.info(`Successfully stopped workload: ${stopParams.workload}`);
      logger.debug("Stop response:", stopResponse);
      
      // Format user-friendly response
      const formattedResponse = formatStopResponse(stopResponse, request);
      
      callback({
        text: formattedResponse,
        content: { 
          success: true, 
          data: stopResponse,
          request: request,
          workload: stopParams.workload
        },
      });
      
      return true;
    } catch (error) {
      // Handle unexpected errors
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`STOP_WORKLOAD error: ${errorMessage}`);
      
      if (error instanceof Error && error.stack) {
        logger.debug(`Error stack: ${error.stack}`);
      }
      
      // Try to log more details about the error
      if (typeof error === 'object' && error !== null) {
        try {
          logger.debug("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        } catch (e) {
          logger.debug("Could not stringify full error object");
        }
      }
      
      // Check for 502 errors in the catch block too
      let userMessage = `Failed to stop workload: ${errorMessage}`;
      if (errorMessage.includes("502") || errorMessage.includes("Bad Gateway")) {
        userMessage = 'Failed to stop workload: Server error (502 Bad Gateway). The Comput3AI service is currently experiencing issues. Please try again later or contact Comput3AI support if the problem persists.';
      }
      
      callback({
        text: userMessage,
        content: { 
          success: false, 
          error: errorMessage 
        },
      });
      
      return false;
    }
  },
  
  /**
   * Example conversations for action usage
   */
  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: "Stop my workload {{workload_id}}",
        },
      },
      {
        name: "{{name2}}",
        content: {
          text: "Stopping your workload with ID '{{workload_id}}' now...",
          actions: ["STOP_WORKLOAD"],
        },
      },
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "Terminate the GPU instance {{workload_domain}}",
        },
      },
      {
        name: "{{name2}}",
        content: {
          text: "Terminating the workload with ID '{{workload_domain}}' now...",
          actions: ["STOP_WORKLOAD"],
        },
      },
    ],
  ] as ActionExample[][],
} as Action;

/**
 * Format recent messages for context in the LLM prompt
 * 
 * @param state - State object containing messages
 * @returns Formatted messages string
 */
function formatRecentMessages(state: State): string {
  const messages = state.messages || [];
  return messages.slice(-3).map((msg: { role?: string; content: string | { text: string } }) => {
    if (typeof msg.content === 'string') {
      return `${msg.role || 'user'}: ${msg.content}`;
    }
    if (msg.content && typeof msg.content.text === 'string') {
      return `${msg.role || 'user'}: ${msg.content.text}`;
    }
    return '';
  }).join('\n\n');
}

/**
 * Format stop response into a user-friendly message
 * 
 * @param response - Stop response from API
 * @param request - Original stop request
 * @returns Formatted response message
 */
function formatStopResponse(response: StopWorkloadResponse, request: StopWorkloadRequest): string {
  const workloadId = request.workload;
  
  return [
    "Successfully stopped workload!",
    "",
    `Workload ID: ${workloadId}`,
    "Status: Stopped",
  ].join('\n');
} 