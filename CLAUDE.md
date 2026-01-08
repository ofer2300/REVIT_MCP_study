# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

**Revit MCP** - AI-Powered Revit Control via Model Context Protocol (MCP). This project enables AI language models to directly control Autodesk Revit, achieving AI-driven BIM workflows.

**Tech Stack:**
- **MCP Server:** Node.js + TypeScript + @modelcontextprotocol/sdk
- **Revit Add-in:** C# + .NET Framework 4.8 + Revit API
- **Communication:** WebSocket on localhost:8964

## Quick Start

### Build MCP Server (Node.js)
```bash
cd MCP-Server
npm install
npm run build
```

### Build Revit Add-in (C#)
```powershell
# For Revit 2025
cd MCP
dotnet build RevitMCP.2025.csproj -c Release

# For Revit 2026
dotnet build RevitMCP.2026.csproj -c Release

# Multi-version install
powershell -ExecutionPolicy Bypass -File scripts/install-addon-all.ps1
```

## Project Structure

| Path | Purpose |
|------|---------|
| `MCP/` | Revit Add-in (C# WebSocket server) |
| `MCP-Server/` | MCP Server (TypeScript tool definitions) |
| `MCP-Server/src/tools/revit-tools.ts` | All MCP tool definitions |
| `MCP-Server/src/socket.ts` | WebSocket client to Revit |
| `scripts/` | PowerShell install scripts |
| `domain/` | Workflow protocols and domain knowledge |

## Supported Revit Versions

| Version | Project File | Output Path |
|---------|--------------|-------------|
| 2022/2023 | RevitMCP.csproj | bin/Release/ |
| 2024 | RevitMCP.2024.csproj | bin/Release.2024/ |
| 2025 | RevitMCP.2025.csproj | bin/Release.2025/ |
| 2026 | RevitMCP.2026.csproj | bin/Release.2026/ |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REVIT_VERSION` | 2025 | Target Revit version |
| `MCP_PORT` | 8964 | WebSocket port for Revit connection |

## Available MCP Tools (45 Total)

### Core BIM Tools (1-28)
- `create_wall`, `create_floor`, `create_door`, `create_window`
- `get_project_info`, `query_elements`, `get_element_info`
- `modify_element_parameter`, `delete_element`
- `get_all_levels`, `get_all_grids`, `get_all_views`
- `create_column`, `place_furniture`
- `get_room_info`, `get_rooms_by_level`
- `select_element`, `zoom_to_element`, `measure_distance`
- `create_dimension`, `get_wall_info`, `query_walls_by_location`
- `override_element_graphics`, `clear_element_override`

### MEP / Fire Protection Tools (29-45)
- **Piping:** `get_pipe_types`, `query_pipes`, `get_pipe_info`, `create_pipe`, `update_pipe_diameter`
- **Sprinklers:** `get_sprinkler_types`, `query_sprinklers`, `create_sprinkler`
- **Systems:** `get_mep_system_info`, `query_mep_systems`, `route_branch_pipes`
- **Coordination:** `check_mep_clashes`, `get_linked_models`, `query_linked_elements`
- **Fire Protection:** `calculate_hydraulic_flow`, `validate_sprinkler_coverage`, `get_fire_protection_summary`

## Claude Code Integration

### MCP Configuration (~/.claude/mcp.json)
```json
{
  "revit-mcp-2025": {
    "command": "node",
    "args": ["/mnt/c/DEV/REVIT_MCP_study/MCP-Server/build/index.js"],
    "env": {
      "REVIT_VERSION": "2025",
      "MCP_PORT": "8964"
    }
  }
}
```

### Usage in Claude Code
```
# List all Revit tools
/mcp list

# Example prompts
"Show me all levels in the Revit project"
"Create a 5 meter wall at coordinates (0,0) to (5000,0)"
"Query all sprinklers on Level 1"
"Check for MEP clashes between pipes and structural elements"
```

## Workflow Protocols

See `domain/` folder for specialized workflows:
- `fire-rating-check.md` - Fire rating validation
- `corridor-analysis-protocol.md` - Corridor code review
- `qa-checklist.md` - Quality assurance checklist

## Development Guidelines

### After Git Pull
If C# code changed, rebuild and reinstall:
```powershell
cd MCP
dotnet build RevitMCP.2025.csproj -c Release
# Then restart Revit
```

### Adding New Tools
1. Add tool definition in `MCP-Server/src/tools/revit-tools.ts`
2. Implement handler in `MCP/Core/CommandExecutor.cs`
3. Rebuild both MCP Server and Add-in

### Port Management
- Default port: 8964
- If port is busy, change via `MCP_PORT` environment variable
- Multiple Revit versions can run on different ports (8964, 8965, etc.)

## Testing

1. **Start Revit** and click "MCP Service (ON/OFF)" in MCP Tools panel
2. **Connect Claude Code** with revit-mcp server
3. **Test basic tools:**
   - `get_all_levels` - Should return project levels
   - `get_project_info` - Should return project metadata
   - `query_elements` with category "Walls" - Should return wall elements

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "MCP Tools" panel missing | Check .addin file in `%APPDATA%\Autodesk\Revit\Addins\2025` |
| Port 8964 in use | Change `MCP_PORT` or kill existing process |
| Connection timeout | Ensure Revit MCP service is ON before starting Claude Code |
| Build fails | Check Revit API DLL references in .csproj |

## License

MIT License
