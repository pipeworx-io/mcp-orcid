interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * ORCID MCP — public records.
 *
 * Auth: none for the /v3.0/ public API. Docs:
 *   https://info.orcid.org/documentation/api-tutorials/api-tutorial-read-data-on-a-record/
 */


const BASE = 'https://pub.orcid.org/v3.0';
const UA = 'pipeworx-mcp-orcid/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'record',
    description: 'Full public record by ORCID iD (e.g. "0000-0001-5109-3700").',
    inputSchema: {
      type: 'object',
      properties: { orcid_id: { type: 'string' } },
      required: ['orcid_id'],
    },
  },
  {
    name: 'works',
    description: 'Works (publication) summaries with put-codes.',
    inputSchema: {
      type: 'object',
      properties: { orcid_id: { type: 'string' } },
      required: ['orcid_id'],
    },
  },
  {
    name: 'work',
    description: 'Single work record by put-code.',
    inputSchema: {
      type: 'object',
      properties: { orcid_id: { type: 'string' }, put_code: { type: 'string' } },
      required: ['orcid_id', 'put_code'],
    },
  },
  {
    name: 'employment',
    description: 'Employment summary.',
    inputSchema: {
      type: 'object',
      properties: { orcid_id: { type: 'string' } },
      required: ['orcid_id'],
    },
  },
  {
    name: 'education',
    description: 'Education summary.',
    inputSchema: {
      type: 'object',
      properties: { orcid_id: { type: 'string' } },
      required: ['orcid_id'],
    },
  },
  {
    name: 'search',
    description: 'Expanded search (Solr-style query) across the ORCID Registry.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'e.g. "family-name:Lovelace AND given-names:Ada"' },
        rows: { type: 'number', description: '1-1000 (default 25)' },
        start: { type: 'number', description: '0-based offset' },
      },
      required: ['query'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'record':
      return orcidGet(`/${oid(args)}/record`);
    case 'works':
      return orcidGet(`/${oid(args)}/works`);
    case 'work':
      return orcidGet(`/${oid(args)}/work/${encodeURIComponent(reqStr(args, 'put_code', '"12345"'))}`);
    case 'employment':
      return orcidGet(`/${oid(args)}/employments`);
    case 'education':
      return orcidGet(`/${oid(args)}/educations`);
    case 'search': {
      const params = new URLSearchParams({
        q: reqStr(args, 'query', '"family-name:Lovelace"'),
        rows: String(Math.min(1000, Math.max(1, (args.rows as number) ?? 25))),
        start: String(Math.max(0, (args.start as number) ?? 0)),
      });
      return orcidGet(`/expanded-search/?${params}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function oid(args: Record<string, unknown>): string {
  const id = reqStr(args, 'orcid_id', '"0000-0001-5109-3700"');
  if (!/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(id)) {
    throw new Error(`Invalid ORCID iD "${id}". Format: 0000-0001-5109-3700.`);
  }
  return id;
}

async function orcidGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('ORCID: not found');
  if (!res.ok) throw new Error(`ORCID: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
