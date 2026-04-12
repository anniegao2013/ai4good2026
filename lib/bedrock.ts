import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

function bedrockRegion() {
  return process.env.BEDROCK_REGION?.trim() || process.env.AWS_REGION?.trim() || 'us-east-1'
}

/**
 * Sonnet 4.6 often must be invoked via a regional inference profile (the base model id
 * `anthropic.claude-sonnet-4-6` can return ValidationException for on-demand throughput).
 * Override with BEDROCK_MODEL_ID if your console shows a different profile id or ARN.
 */
function defaultInferenceProfileId(region: string): string {
  if (region.startsWith('eu-')) return 'eu.anthropic.claude-sonnet-4-6'
  if (region === 'ap-southeast-2') return 'au.anthropic.claude-sonnet-4-6'
  return 'us.anthropic.claude-sonnet-4-6'
}

function resolveModelId(): string {
  const fromEnv = process.env.BEDROCK_MODEL_ID?.trim()
  if (fromEnv) return fromEnv
  return defaultInferenceProfileId(bedrockRegion())
}

/** Bedrock console “API keys” use Bearer auth, not SigV4. AWS documents `AWS_BEARER_TOKEN_BEDROCK`; we also accept `BEDROCK_API_KEY` for convenience. */
function bedrockBearerToken(): string | undefined {
  const a = process.env.AWS_BEARER_TOKEN_BEDROCK?.trim()
  const b = process.env.BEDROCK_API_KEY?.trim()
  return a || b || undefined
}

async function invokeClaudeWithBearer(
  prompt: string,
  systemPrompt: string,
  token: string
): Promise<string> {
  const region = bedrockRegion()
  const modelId = resolveModelId()
  const url = `https://bedrock-runtime.${region}.amazonaws.com/model/${encodeURIComponent(modelId)}/invoke`

  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  })

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body,
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Bedrock invoke failed (${res.status}): ${detail}`)
  }

  const parsed = (await res.json()) as { content?: { text?: string }[] }
  const text = parsed.content?.[0]?.text
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Bedrock returned no text in content[0].text')
  }
  return text
}

function bedrockClient() {
  const region = bedrockRegion()
  const key = process.env.AWS_ACCESS_KEY_ID
  const secret = process.env.AWS_SECRET_ACCESS_KEY
  const token = process.env.AWS_SESSION_TOKEN

  // If keys are omitted, use the SDK default chain (~/.aws/credentials, env, SSO, IAM role).
  if (key && secret) {
    return new BedrockRuntimeClient({
      region,
      credentials: {
        accessKeyId: key,
        secretAccessKey: secret,
        ...(token ? { sessionToken: token } : {}),
      },
    })
  }

  return new BedrockRuntimeClient({ region })
}

export async function invokeClaude(prompt: string, systemPrompt: string): Promise<string> {
  const bearer = bedrockBearerToken()
  if (bearer) {
    return invokeClaudeWithBearer(prompt, systemPrompt, bearer)
  }

  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  })

  const command = new InvokeModelCommand({
    modelId: resolveModelId(),
    contentType: 'application/json',
    accept: 'application/json',
    body,
  })

  const response = await bedrockClient().send(command)
  const decoded = new TextDecoder().decode(response.body)
  const parsed = JSON.parse(decoded) as { content?: { text?: string }[] }
  const text = parsed.content?.[0]?.text
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Bedrock returned no text in content[0].text')
  }
  return text
}
