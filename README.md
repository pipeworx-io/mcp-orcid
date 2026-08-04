# @pipeworx/orcid

[ORCID](https://orcid.org) MCP — public researcher records (works, education, employment). Uses the public ORCID REST API (no key required for read access to public data).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `record(orcid_id)` — full public record (works, employments, education, …)
- `works(orcid_id)` — publication list with put-codes
- `work(orcid_id, put_code)` — single work record
- `employment(orcid_id)` — employment summary
- `education(orcid_id)` — education summary
- `search(query, rows?, start?)` — expanded search across ORCID (lucene-style)

## Data source

`https://pub.orcid.org/v3.0/` and the expanded search `https://pub.orcid.org/v3.0/expanded-search`.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
