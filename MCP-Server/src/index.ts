#!/usr/bin/env node

/**
 * Revit MCP Server
 * Provides MCP protocol bridge between AI and Revit
 *
 * Environment Variables:
 * - REVIT_VERSION: Target Revit version (2022, 2023, 2024, 2025, 2026)
 * - MCP_PORT: WebSocket port (default: 8964)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { RevitSocketClient } from "./socket.js";
import { registerRevitTools, executeRevitTool } from "./tools/revit-tools.js";

// Configuration from environment
const REVIT_VERSION = process.env.REVIT_VERSION || "2025";
const MCP_PORT = parseInt(process.env.MCP_PORT || "8964", 10);

// MCP Server instance
const server = new Server(
    {
        name: "revit-mcp-server",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Revit Socket client with configurable port
const revitClient = new RevitSocketClient("localhost", MCP_PORT);

/**
 * 處理工具列表請求
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools = registerRevitTools();
    console.error(`[MCP Server] 已註冊 ${tools.length} 個 Revit 工具`);
    return { tools };
});

/**
 * 處理工具呼叫請求
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    console.error(`[MCP Server] 執行工具: ${request.params.name}`);
    console.error(`[MCP Server] 參數:`, JSON.stringify(request.params.arguments, null, 2));

    try {
        // 檢查 Revit 連線狀態
        if (!revitClient.isConnected()) {
            console.error("[MCP Server] Revit 未連線，嘗試連線...");
            await revitClient.connect();
        }

        // 執行 Revit 工具
        const result = await executeRevitTool(
            request.params.name,
            request.params.arguments || {},
            revitClient
        );

        console.error(`[MCP Server] 工具執行成功`);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[MCP Server] 工具執行失敗: ${errorMessage}`);

        return {
            content: [
                {
                    type: "text",
                    text: `錯誤: ${errorMessage}`,
                },
            ],
            isError: true,
        };
    }
});

/**
 * Start the server
 */
async function main() {
    console.error("=".repeat(60));
    console.error("Revit MCP Server Starting...");
    console.error(`Target Revit Version: ${REVIT_VERSION}`);
    console.error(`WebSocket Port: ${MCP_PORT}`);
    console.error("=".repeat(60));
    console.error("Waiting for Revit Plugin connection...");

    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error("MCP Server Ready");
    console.error(`Listening on: localhost:${MCP_PORT}`);
}

main().catch((error) => {
    console.error("Server startup failed:", error);
    process.exit(1);
});
