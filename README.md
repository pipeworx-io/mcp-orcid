# mcp-orcid

ORCID public researcher records (works, employment, education)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `record` | Full public record by ORCID iD (e.g. "0000-0001-5109-3700"). |
| `works` | Works (publication) summaries with put-codes. |
| `work` | Single work record by put-code. |
| `employment` | Employment summary. |
| `education` | Education summary. |
| `search` | Expanded search (Solr-style query) across the ORCID Registry. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "orcid": {
      "url": "https://gateway.pipeworx.io/orcid/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Orcid data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
