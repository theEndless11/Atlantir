<template>
  <div class="page-shell int-shell">
    <div class="page-header">
      <div>
        <h1>Integrations</h1>
        <p>Connect your tools — agents use them automatically to complete tasks.</p>
      </div>
      <div class="header-stats">
        <span class="connected-count">
          <span class="count-num">{{ connectedCount }}</span> connected
        </span>
        <span class="available-count">{{ integrations.length }} available</span>
      </div>
    </div>

    <!-- Category filter -->
    <div class="category-bar">
      <button
        v-for="cat in categories"
        :key="cat"
        class="cat-btn"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Integration grid -->
    <div v-for="(group, category) in groupedIntegrations" :key="category" class="int-category-group">
      <div class="category-label">{{ category }}</div>
      <div class="int-grid">
        <div
          v-for="int in group"
          :key="int.type"
          class="int-card"
          :class="{ connected: int.status === 'connected' }"
        >
          <div class="int-card-top">
            <div class="int-icon" :style="{ background: intMeta(int.type)?.color || '#6366f1' }">
              <svg v-html="intSvg(int.type)" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" />
            </div>
            <div class="int-info">
              <span class="int-name">{{ intMeta(int.type)?.name || int.type }}</span>
              <div class="int-status-row">
                <span class="status-dot" :class="int.status" />
                <span class="status-label" :class="int.status">
                  {{ int.status === 'connected' ? 'Connected' : 'Not connected' }}
                </span>
              </div>
            </div>
          </div>

          <p class="int-desc">{{ intMeta(int.type)?.desc || '' }}</p>

          <div class="int-tools-preview" v-if="intTools(int.type).length">
            <span v-for="tool in intTools(int.type).slice(0, 3)" :key="tool.id" class="tool-chip">
              {{ tool.name }}
            </span>
            <span v-if="intTools(int.type).length > 3" class="tool-chip more">
              +{{ intTools(int.type).length - 3 }} more
            </span>
          </div>

          <div class="int-actions">
            <button v-if="int.status !== 'connected'" class="btn btn-primary int-connect-btn" @click="openPanel(int.type)">
              Connect
            </button>
            <template v-else>
              <button class="btn btn-green int-action-btn" :disabled="testing === int.type" @click="testIntegration(int.type)">
                <svg v-if="testing !== int.type" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                <div v-else class="spinner spinner-dark" />
                {{ testing === int.type ? 'Testing…' : 'Test' }}
              </button>
              <button class="btn btn-ghost int-action-btn" @click="openPanel(int.type)">Configure</button>
              <button class="btn-icon disconnect-btn" title="Disconnect" @click="disconnect(int.type)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </template>
          </div>

          <div v-if="testResults[int.type]" class="test-result" :class="{ 'test-error': testResults[int.type].includes('❌') }">
            {{ testResults[int.type] }}
          </div>
        </div>
      </div>
    </div>

    <!-- Always-on tools -->
    <div class="builtin-section">
      <div class="category-label">Always available · no setup required</div>
      <div class="builtin-grid">
        <div class="builtin-card">
          <div class="builtin-icon excel"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
          <div class="builtin-info">
            <span class="builtin-name">Excel / Spreadsheets</span>
            <span class="builtin-desc">Generate real <code>.xlsx</code> files with formatted tables and charts. Ask: "Create a spreadsheet of…"</span>
          </div>
          <span class="always-on">Always on</span>
        </div>
        <div class="builtin-card">
          <div class="builtin-icon search"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
          <div class="builtin-info">
            <span class="builtin-name">Web Search</span>
            <span class="builtin-desc">Agents search the web for current information. Add <code>SERPER_API_KEY</code> for live results.</span>
          </div>
          <span class="always-on">Always on</span>
        </div>
      </div>
    </div>

    <!-- Side panel -->
    <Teleport to="body">
      <div v-if="panel.open" class="overlay" @click.self="closePanel">
        <div class="side-panel">
          <!-- Colored top accent bar -->
          <div class="panel-color-bar" :style="{ background: intMeta(panel.type)?.color || '#6366f1' }" />

          <div class="panel-head">
            <div class="panel-icon" :style="{ background: intMeta(panel.type)?.color || '#6366f1' }">
              <svg v-html="intSvg(panel.type)" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" />
            </div>
            <div class="panel-title-wrap">
              <h2>{{ intMeta(panel.type)?.name || panel.type }}</h2>
              <p>{{ intMeta(panel.type)?.desc || '' }}</p>
            </div>
            <button class="btn-icon" @click="closePanel">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Available tools list -->
          <div v-if="intTools(panel.type).length" class="panel-tools">
            <div class="panel-tools-label">Agent capabilities after connecting</div>
            <div class="panel-tools-list">
              <div v-for="tool in intTools(panel.type)" :key="tool.id" class="panel-tool-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {{ tool.name }}
              </div>
            </div>
          </div>

          <div class="panel-tabs">
            <button class="panel-tab" :class="{ active: panel.tab === 'guide' }"   @click="panel.tab = 'guide'">Setup guide</button>
            <button class="panel-tab" :class="{ active: panel.tab === 'connect' }" @click="panel.tab = 'connect'">Connect</button>
          </div>

          <!-- Guide -->
          <div v-if="panel.tab === 'guide'" class="panel-body">
            <div v-if="!intMeta(panel.type)?.steps?.length" class="no-steps">
              <p>No setup guide available. Switch to the Connect tab to enter credentials directly.</p>
            </div>
            <div v-for="(step, i) in intMeta(panel.type)?.steps || []" :key="i" class="guide-step">
              <div class="step-num">{{ i + 1 }}</div>
              <div class="step-body">
                <strong>{{ step.title }}</strong>
                <p v-html="step.body" />
              </div>
            </div>
            <button class="btn btn-primary full-btn" @click="panel.tab = 'connect'">
              I'm ready — connect now →
            </button>
          </div>

          <!-- Connect form -->
          <div v-else class="panel-body">
            <div v-for="field in intMeta(panel.type)?.fields || []" :key="field.key" class="field">
              <label>{{ field.label }}</label>
              <input
                v-model="configValues[field.key]"
                class="input"
                :type="field.secret ? 'password' : 'text'"
                :placeholder="field.placeholder"
              />
              <span v-if="field.hint" class="field-hint">{{ field.hint }}</span>
            </div>

            <div v-if="saveError" class="field-error-msg">{{ saveError }}</div>
            <div v-if="saveSuccess" class="save-success">✅ {{ saveSuccess }}</div>

            <div class="form-footer">
              <button class="btn btn-ghost" @click="panel.tab = 'guide'">← Guide</button>
              <button
                class="btn btn-connect"
                :style="{ background: intMeta(panel.type)?.color || 'var(--accent)' }"
                :disabled="saving"
                @click="saveIntegration(panel.type)">
                <span v-if="saving" class="spinner" />
                <span v-else>Connect {{ intMeta(panel.type)?.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <div v-if="toast" class="toast" :class="{ 'toast-error': toastError }">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'workspace' })

const route = useRoute()
const workspaceId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id as string

// ─── State ─────────────────────────────────────────────────────────────────────
const integrations   = ref<{ type: string; status: string; config: Record<string, string> }[]>([])
const panel          = ref({ open: false, type: '', tab: 'guide' })
const configValues   = ref<Record<string, string>>({})
const testing        = ref<string | null>(null)
const testResults    = ref<Record<string, string>>({})
const saving         = ref(false)
const saveError      = ref('')
const saveSuccess    = ref('')
const toast          = ref('')
const toastError     = ref(false)
const activeCategory = ref('All')

// ─── Integration metadata (matches server/utils/tool-registry.ts INTEGRATION_META) ────
const INT_META: Record<string, any> = {
  slack:           { name: 'Slack',           desc: 'Post messages and summaries to channels.',            category: 'Communication', color: '#4a154b', fields: [{ key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://hooks.slack.com/services/…', secret: true, hint: 'From Slack App → Incoming Webhooks' }, { key: 'channel', label: 'Default channel', placeholder: '#general' }], steps: [{ title: 'Create a Slack app', body: 'Visit <a href="https://api.slack.com/apps" target="_blank">api.slack.com/apps</a> → <b>Create New App → From scratch</b>.' }, { title: 'Enable Incoming Webhooks', body: 'In the sidebar click <b>Incoming Webhooks</b> and toggle it on.' }, { title: 'Add webhook to workspace', body: 'Click <b>Add New Webhook to Workspace</b>, choose a channel, and approve.' }, { title: 'Copy and paste the URL', body: 'Copy the URL starting with <b>https://hooks.slack.com/services/…</b> and paste it below.' }] },
  gmail:           { name: 'Gmail',           desc: 'Send emails from your Gmail account.',                category: 'Communication', color: '#ea4335', fields: [{ key: 'sender_email', label: 'Gmail address', placeholder: 'you@gmail.com' }, { key: 'app_password', label: 'App password', placeholder: 'xxxx xxxx xxxx xxxx', secret: true, hint: 'From myaccount.google.com/apppasswords' }], steps: [{ title: 'Enable 2-Step Verification', body: 'Go to <a href="https://myaccount.google.com/security" target="_blank">myaccount.google.com/security</a> and enable 2-Step Verification.' }, { title: 'Generate App Password', body: 'Go to <a href="https://myaccount.google.com/apppasswords" target="_blank">myaccount.google.com/apppasswords</a>. Select <b>Mail → Other</b>, generate and copy the 16-character password.' }] },
  google_calendar: { name: 'Google Calendar', desc: 'Create calendar events automatically.',               category: 'Communication', color: '#4285f4', fields: [{ key: 'webhook_url', label: 'Make.com webhook URL', placeholder: 'https://hook.make.com/…', secret: true }], steps: [{ title: 'Open Make.com', body: 'Create a scenario with a <b>Webhooks → Custom webhook</b> trigger and Google Calendar action.' }, { title: 'Connect Google account', body: 'Click the Google Calendar module and sign in.' }, { title: 'Copy webhook URL', body: 'Copy the webhook URL and paste it below, then turn the scenario On.' }] },
  github:          { name: 'GitHub',          desc: 'Create issues, commit files, and manage repos.',       category: 'Development', color: '#24292e', fields: [{ key: 'token', label: 'Personal access token', placeholder: 'github_pat_…', secret: true, hint: 'Settings → Developer settings → Fine-grained tokens' }, { key: 'repo', label: 'Default repository', placeholder: 'owner/repo-name', hint: 'Optional — agents auto-detect if blank' }], steps: [{ title: 'Create a fine-grained token', body: 'Go to <b>GitHub Settings → Developer settings → Fine-grained tokens</b> and click <b>Generate new token</b>.' }, { title: 'Set permissions', body: 'Under Repository permissions, set <b>Issues</b>, <b>Pull requests</b>, and <b>Contents</b> to <b>Read & write</b>.' }, { title: 'Copy the token', body: 'Copy the token starting with <b>github_pat_</b> and paste it below.' }] },
  notion:          { name: 'Notion',          desc: 'Write docs and research to Notion pages.',             category: 'Productivity', color: '#1a1a1a', fields: [{ key: 'api_key', label: 'Integration token', placeholder: 'secret_…', secret: true }, { key: 'database_id', label: 'Database ID', placeholder: 'Paste from your Notion page URL' }], steps: [{ title: 'Create a Notion integration', body: 'Go to <a href="https://www.notion.so/my-integrations" target="_blank">notion.so/my-integrations</a> and click <b>+ New integration</b>.' }, { title: 'Copy the token', body: 'Copy the <b>Internal Integration Token</b> starting with <b>secret_…</b>.' }, { title: 'Share your database', body: 'Open your Notion database, click <b>Share</b>, and invite your integration.' }] },
  zapier:          { name: 'Zapier',          desc: 'Trigger any automation via webhooks.',                 category: 'Automation', color: '#ff4a00', fields: [{ key: 'webhook_url', label: 'Zapier webhook URL', placeholder: 'https://hooks.zapier.com/hooks/catch/…' }], steps: [{ title: 'Create a Zap', body: 'Go to <a href="https://zapier.com" target="_blank">zapier.com</a> → Create Zap → <b>Webhooks → Catch Hook</b> as trigger.' }, { title: 'Copy webhook URL', body: 'Zapier generates a URL starting with <b>hooks.zapier.com</b> — copy it.' }, { title: 'Publish the Zap', body: 'Add your action app, test, and publish.' }] },
  jira:            { name: 'Jira',            desc: 'Create and manage issues in Jira.',                    category: 'Development', color: '#0052cc', fields: [{ key: 'host', label: 'Jira URL', placeholder: 'https://yourcompany.atlassian.net' }, { key: 'email', label: 'Account email', placeholder: 'you@company.com' }, { key: 'api_token', label: 'API token', placeholder: 'Paste from id.atlassian.com', secret: true }, { key: 'project_key', label: 'Default project key', placeholder: 'PROJ' }], steps: [{ title: 'Get an API token', body: 'Visit <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank">id.atlassian.com</a> → Security → API tokens → Create API token.' }, { title: 'Find your project key', body: 'Open Jira → your project. The key is the prefix in issue IDs (e.g. "PROJ" in PROJ-42).' }] },
  linear:          { name: 'Linear',          desc: 'Create and track Linear issues.',                      category: 'Development', color: '#5e6ad2', fields: [{ key: 'api_key', label: 'API key', placeholder: 'lin_api_…', secret: true, hint: 'From Linear Settings → API' }, { key: 'team_id', label: 'Default team ID', placeholder: 'From team URL', hint: 'Optional' }], steps: [{ title: 'Get your Linear API key', body: 'In Linear go to <b>Settings → API → Personal API keys</b> and create a key.' }, { title: 'Find your team ID', body: 'Go to your team. The team ID is in the URL: linear.app/org/<b>team-id</b>/issues.' }] },
  hubspot:         { name: 'HubSpot',         desc: 'Manage contacts and deals in HubSpot CRM.',            category: 'CRM & Sales', color: '#ff7a59', fields: [{ key: 'access_token', label: 'Private app access token', placeholder: 'pat-na1-…', secret: true }], steps: [{ title: 'Create a HubSpot private app', body: 'In HubSpot go to <b>Settings → Integrations → Private Apps</b> and create a new app.' }, { title: 'Set scopes', body: 'Enable <b>crm.objects.contacts</b> and <b>crm.objects.deals</b> (read + write).' }, { title: 'Copy access token', body: 'Copy the token starting with <b>pat-</b> and paste it below.' }] },
  twilio:          { name: 'Twilio',          desc: 'Send SMS messages to any phone number.',               category: 'Communication', color: '#f22f46', fields: [{ key: 'account_sid', label: 'Account SID', placeholder: 'ACxxxx…', hint: 'From Twilio Console Dashboard' }, { key: 'auth_token', label: 'Auth token', placeholder: '…', secret: true }, { key: 'from_number', label: 'From number', placeholder: '+1234567890', hint: 'Your Twilio number in E.164 format' }], steps: [{ title: 'Get credentials', body: 'Log in to <a href="https://console.twilio.com" target="_blank">console.twilio.com</a>. Find Account SID and Auth Token on the dashboard.' }, { title: 'Get a phone number', body: 'In Console → Phone Numbers, buy or verify a number to send from.' }] },
  stripe:          { name: 'Stripe',          desc: 'Query customers, revenue, and subscriptions.',         category: 'CRM & Sales', color: '#635bff', fields: [{ key: 'secret_key', label: 'Secret key', placeholder: 'sk_live_… or sk_test_…', secret: true, hint: 'From Stripe Dashboard → Developers → API keys' }], steps: [{ title: 'Get API key', body: 'Go to <a href="https://dashboard.stripe.com/apikeys" target="_blank">dashboard.stripe.com/apikeys</a> and copy your Secret key.' }] },
  airtable:        { name: 'Airtable',        desc: 'Create and query records in Airtable bases.',          category: 'Productivity', color: '#18bfff', fields: [{ key: 'api_key', label: 'Personal access token', placeholder: 'pat…', secret: true, hint: 'From airtable.com/create/tokens' }], steps: [{ title: 'Create access token', body: 'Go to <a href="https://airtable.com/create/tokens" target="_blank">airtable.com/create/tokens</a>, create a token with <b>data.records:read</b> and <b>data.records:write</b>.' }] },
  asana:           { name: 'Asana',           desc: 'Create and assign tasks in Asana projects.',           category: 'Productivity', color: '#fc636b', fields: [{ key: 'access_token', label: 'Personal access token', placeholder: '1/…', secret: true, hint: 'From app.asana.com/0/developer-console' }, { key: 'project_id', label: 'Default project ID', placeholder: 'From Asana project URL', hint: 'Optional' }], steps: [{ title: 'Get your token', body: 'Go to <a href="https://app.asana.com/0/developer-console" target="_blank">app.asana.com/0/developer-console</a> and create a personal access token.' }] },
  trello:          { name: 'Trello',          desc: 'Create cards in Trello boards.',                       category: 'Productivity', color: '#0052cc', fields: [{ key: 'api_key', label: 'API key', placeholder: '…', hint: 'From trello.com/app-key' }, { key: 'token', label: 'Token', placeholder: '…', secret: true }], steps: [{ title: 'Get API key and token', body: 'Go to <a href="https://trello.com/app-key" target="_blank">trello.com/app-key</a> to get your API key, then click the token link.' }] },
  intercom:        { name: 'Intercom',        desc: 'Message users via Intercom.',                          category: 'CRM & Sales', color: '#286efa', fields: [{ key: 'access_token', label: 'Access token', placeholder: 'dG9rZ…', secret: true, hint: 'From Intercom Developer Hub → Your App → Authentication' }], steps: [{ title: 'Create an Intercom app', body: 'Go to <a href="https://developers.intercom.com" target="_blank">developers.intercom.com</a>, create an app, and copy the Access Token.' }] },
  zendesk:         { name: 'Zendesk',         desc: 'Create and manage support tickets.',                   category: 'CRM & Sales', color: '#03363d', fields: [{ key: 'subdomain', label: 'Subdomain', placeholder: 'yourcompany', hint: 'From yourcompany.zendesk.com' }, { key: 'email', label: 'Agent email', placeholder: 'you@company.com' }, { key: 'api_token', label: 'API token', placeholder: '…', secret: true, hint: 'From Admin → Apps & Integrations → APIs' }], steps: [{ title: 'Get your API token', body: 'In Zendesk Admin Center go to <b>Apps and Integrations → APIs → Zendesk API</b> and create a token.' }] },
  vercel:          { name: 'Vercel',          desc: 'Monitor deployments and project status.',              category: 'DevOps', color: '#000000', fields: [{ key: 'token', label: 'Access token', placeholder: '…', secret: true, hint: 'From vercel.com/account/tokens' }, { key: 'team_id', label: 'Team ID', placeholder: 'team_…', hint: 'Optional — for team accounts' }], steps: [{ title: 'Create a token', body: 'Go to <a href="https://vercel.com/account/tokens" target="_blank">vercel.com/account/tokens</a> and create a new token.' }] },
  pagerduty:       { name: 'PagerDuty',       desc: 'Trigger and manage incidents.',                        category: 'DevOps', color: '#06ac38', fields: [{ key: 'routing_key', label: 'Events API v2 routing key', placeholder: 'R…', hint: 'From PagerDuty Service → Integrations → Events API v2' }], steps: [{ title: 'Get routing key', body: 'In PagerDuty go to your Service → Integrations → Add Events API v2. Copy the Integration Key.' }] },
  sentry:          { name: 'Sentry',          desc: 'Query errors and issues from Sentry.',                 category: 'DevOps', color: '#362d59', fields: [{ key: 'auth_token', label: 'Auth token', placeholder: 'sntrys_…', secret: true, hint: 'From sentry.io/settings/auth-tokens' }, { key: 'org_slug', label: 'Organization slug', placeholder: 'my-org', hint: 'From your Sentry organization URL' }], steps: [{ title: 'Create auth token', body: 'Go to <a href="https://sentry.io/settings/auth-tokens/" target="_blank">sentry.io/settings/auth-tokens</a> and create a token with org:read and project:read scopes.' }] },
  cloudflare:      { name: 'Cloudflare',      desc: 'Manage zones, DNS records, and cache.',               category: 'DevOps', color: '#f48120', fields: [{ key: 'api_token', label: 'API token', placeholder: '…', secret: true, hint: 'From dash.cloudflare.com/profile/api-tokens' }], steps: [{ title: 'Create API token', body: 'Go to <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank">dash.cloudflare.com/profile/api-tokens</a> and create a token with Zone permissions.' }] },
}

// Tool descriptions per integration (subset for display)
const INT_TOOLS: Record<string, { id: string; name: string }[]> = {
  slack:           [{ id: 'slack_post_message', name: 'Post message' }],
  gmail:           [{ id: 'gmail_send', name: 'Send email' }],
  google_calendar: [{ id: 'calendar_create_event', name: 'Create event' }],
  github:          [{ id: 'github_list_repos', name: 'List repos' }, { id: 'github_list_files', name: 'List files' }, { id: 'github_create_issue', name: 'Create issue' }, { id: 'github_commit_file', name: 'Commit file' }, { id: 'github_create_pr', name: 'Create PR' }],
  notion:          [{ id: 'notion_create_page', name: 'Create page' }, { id: 'notion_append_block', name: 'Append content' }],
  zapier:          [{ id: 'zapier_trigger', name: 'Trigger webhook' }],
  jira:            [{ id: 'jira_create_issue', name: 'Create issue' }, { id: 'jira_list_issues', name: 'List issues' }],
  linear:          [{ id: 'linear_create_issue', name: 'Create issue' }, { id: 'linear_list_issues', name: 'List issues' }],
  hubspot:         [{ id: 'hubspot_create_contact', name: 'Create contact' }, { id: 'hubspot_create_deal', name: 'Create deal' }, { id: 'hubspot_search_contacts', name: 'Search contacts' }],
  twilio:          [{ id: 'twilio_send_sms', name: 'Send SMS' }],
  stripe:          [{ id: 'stripe_list_customers', name: 'List customers' }, { id: 'stripe_get_revenue', name: 'Revenue summary' }],
  airtable:        [{ id: 'airtable_create_record', name: 'Create record' }, { id: 'airtable_list_records', name: 'List records' }],
  asana:           [{ id: 'asana_create_task', name: 'Create task' }],
  trello:          [{ id: 'trello_create_card', name: 'Create card' }],
  intercom:        [{ id: 'intercom_send_message', name: 'Send message' }],
  zendesk:         [{ id: 'zendesk_create_ticket', name: 'Create ticket' }],
  vercel:          [{ id: 'vercel_list_deployments', name: 'List deployments' }, { id: 'vercel_get_project', name: 'Get project info' }],
  pagerduty:       [{ id: 'pagerduty_create_incident', name: 'Trigger incident' }],
  sentry:          [{ id: 'sentry_list_issues', name: 'List issues' }],
  cloudflare:      [{ id: 'cloudflare_list_zones', name: 'List zones' }, { id: 'cloudflare_purge_cache', name: 'Purge cache' }],
}

const ICON_SVGS: Record<string, string> = {
  slack:           '<path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5zm6 0H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-14 4c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S4 21.33 4 20.5v-5c0-.83.67-1.5 1.5-1.5zm-6 0H2v1.5C2 16.33 1.33 17 .5 17S-1 16.33-1 15.5-.33 14 .5 14zm14-4c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5zm1.5 5H15v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5zM8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/>',
  gmail:           '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="22,6 12,13 2,6" fill="none" stroke="currentColor" stroke-width="2"/>',
  google_calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>',
  github:          '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" fill="none" stroke="currentColor" stroke-width="2"/>',
  notion:          '<rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="9" x2="9" y2="21" stroke="currentColor" stroke-width="1.5"/>',
  zapier:          '<path d="M12 2L2 7l10 5 10-5-10-5z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 17l10 5 10-5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 12l10 5 10-5" fill="none" stroke="currentColor" stroke-width="2"/>',
  jira:            '<path d="M20.32 4.37L13 11.67 9.37 8.04a1 1 0 0 0-1.41 0L3.68 12.3a1 1 0 0 0 0 1.41l6.32 6.32a1 1 0 0 0 1.41 0L20.32 5.78a1 1 0 0 0 0-1.41z" fill="none" stroke="currentColor" stroke-width="2"/>',
  linear:          '<path d="M4.5 19.5L12 12m0 0l7.5-7.5M12 12L4.5 4.5M12 12l7.5 7.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  hubspot:         '<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3v3m0 12v3M3 12h3m12 0h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  twilio:          '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/><path d="M8 15s1.5 2 4 2 4-2 4-2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  stripe:          '<rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" stroke-width="2"/>',
  airtable:        '<path d="M12 2L2 7l10 5 10-5-10-5z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 12v5l10 5 10-5v-5" fill="none" stroke="currentColor" stroke-width="2"/>',
  asana:           '<circle cx="12" cy="5" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="5" cy="17" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="19" cy="17" r="3" fill="none" stroke="currentColor" stroke-width="2"/>',
  trello:          '<rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="7" y="7" width="3" height="9" fill="currentColor" rx="1"/><rect x="14" y="7" width="3" height="5" fill="currentColor" rx="1"/>',
  intercom:        '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 10h8M8 14h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  zendesk:         '<path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="12" x2="12" y2="22" stroke="currentColor" stroke-width="1.5"/>',
  vercel:          '<path d="M12 3L1 21h22L12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  pagerduty:       '<path d="M4 14.5V21h2v-6.5c0-.28.22-.5.5-.5s.5.22.5.5V21h2V10.5c0-.28.22-.5.5-.5s.5.22.5.5V21h2V7.5c0-.28.22-.5.5-.5s.5.22.5.5V21h2V5.5c0-.28.22-.5.5-.5s.5.22.5.5V21h2V14.5c0-.28.22-.5.5-.5s.5.22.5.5V21h1V3H3v18h1v-6.5c0-.28.22-.5.5-.5s.5.22.5.5z" fill="currentColor"/>',
  sentry:          '<path d="M14.5 2L23 17H18l-3.5-6-3.5 6H1L9.5 2h5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  cloudflare:      '<path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
}

// ─── Computed ───────────────────────────────────────────────────────────────────
const connectedCount = computed(() => integrations.value.filter(i => i.status === 'connected').length)

const categories = computed(() => {
  const cats = new Set(['All'])
  Object.values(INT_META).forEach(m => cats.add(m.category))
  return Array.from(cats)
})

const groupedIntegrations = computed(() => {
  const filtered = activeCategory.value === 'All'
    ? integrations.value
    : integrations.value.filter(i => INT_META[i.type]?.category === activeCategory.value)

  const groups: Record<string, typeof filtered> = {}
  for (const int of filtered) {
    const cat = INT_META[int.type]?.category || 'Other'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(int)
  }

  // Sort: connected first within each group
  for (const cat in groups) {
    groups[cat].sort((a, b) => (a.status === 'connected' ? -1 : 1) - (b.status === 'connected' ? -1 : 1))
  }

  return groups
})

// ─── Helpers ───────────────────────────────────────────────────────────────────
function intMeta(type: string) { return INT_META[type] }
function intTools(type: string) { return INT_TOOLS[type] || [] }
function intSvg(type: string) { return ICON_SVGS[type] || '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/>' }

// ─── Panel ─────────────────────────────────────────────────────────────────────
function openPanel(type: string) {
  const existing = integrations.value.find(i => i.type === type)
  configValues.value = existing?.config ? { ...existing.config } : {}
  saveError.value = ''
  saveSuccess.value = ''
  panel.value = { open: true, type, tab: 'guide' }
}
function closePanel() { panel.value.open = false }

// ─── Save ──────────────────────────────────────────────────────────────────────
async function saveIntegration(type: string) {
  saving.value = true
  saveError.value = ''
  saveSuccess.value = ''
  try {
    await $fetch('/api/integrations/save', {
      method: 'POST',
      body: { workspace_id: workspaceId, type, config: { ...configValues.value }, status: 'connected' }
    })
    saveSuccess.value = 'Connected successfully!'
    setTimeout(closePanel, 1200)
    await load()
  } catch (e: any) {
    saveError.value = e?.data?.message || 'Failed to save. Check your credentials.'
  } finally {
    saving.value = false
  }
}

// ─── Disconnect ────────────────────────────────────────────────────────────────
async function disconnect(type: string) {
  if (!confirm(`Disconnect ${intMeta(type)?.name || type}? Agents will no longer be able to use it.`)) return
  await $fetch('/api/integrations/disconnect', { method: 'POST', body: { workspace_id: workspaceId, type } })
  showToast(`${intMeta(type)?.name || type} disconnected`)
  await load()
}

// ─── Test ──────────────────────────────────────────────────────────────────────
async function testIntegration(type: string) {
  testing.value = type
  testResults.value[type] = ''
  try {
    const res = await $fetch<any>('/api/integrations/test', { method: 'POST', body: { workspace_id: workspaceId, type } })
    testResults.value[type] = res.result || res.error || 'Unknown result'
  } catch (e: any) {
    testResults.value[type] = e?.data?.message || '❌ Test failed'
  } finally {
    testing.value = null
  }
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg: string, error = false) {
  toast.value = msg; toastError.value = error
  setTimeout(() => toast.value = '', 3000)
}

// ─── Load ──────────────────────────────────────────────────────────────────────
async function load() {
  const data = await $fetch<typeof integrations.value>(`/api/integrations?workspace_id=${workspaceId}`)
  // Ensure every known integration appears, even if not yet connected
  const connected = new Map((data || []).map(i => [i.type, i]))
  const allTypes = Object.keys(INT_META)
  integrations.value = allTypes.map(type => connected.get(type) || { type, status: 'disconnected', config: {} })
}

onMounted(load)
</script>

<style scoped>
.int-shell { padding-bottom: 40px; }
.header-stats { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.connected-count { font-size: 13px; color: var(--green-text); background: var(--green-soft); padding: 4px 12px; border-radius: 20px; }
.count-num { font-weight: 700; }
.available-count { font-size: 13px; color: var(--text-3); }

/* Category bar */
.category-bar { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 24px; }
.cat-btn { padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; border: 1px solid var(--border); background: var(--surface); color: var(--text-2); cursor: pointer; transition: all .15s; }
.cat-btn:hover  { border-color: var(--accent); color: var(--accent); }
.cat-btn.active { background: var(--accent-soft); border-color: var(--accent-border); color: var(--accent); }

/* Groups */
.int-category-group { margin-bottom: 28px; }
.category-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-3); margin-bottom: 12px; }

/* Grid */
.int-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }

.int-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  display: flex; flex-direction: column; gap: 10px;
  transition: border-color .15s, box-shadow .15s;
}
.int-card:hover { border-color: var(--text-3); box-shadow: var(--shadow); }
.int-card.connected { border-color: rgba(16,185,129,.3); }

.int-card-top { display: flex; align-items: center; gap: 10px; }
.int-icon { width: 38px; height: 38px; border-radius: 9px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
.int-info { flex: 1; }
.int-name { font-size: 13px; font-weight: 600; color: var(--text-1); display: block; margin-bottom: 3px; }
.int-status-row { display: flex; align-items: center; gap: 5px; }
.status-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--border); flex-shrink: 0; }
.status-dot.connected  { background: var(--green); }
.status-label { font-size: 11px; color: var(--text-3); }
.status-label.connected { color: var(--green-text); }

.int-desc { font-size: 12px; color: var(--text-2); line-height: 1.5; }

.int-tools-preview { display: flex; flex-wrap: wrap; gap: 4px; }
.tool-chip { font-size: 10px; padding: 2px 7px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 4px; color: var(--text-2); }
.tool-chip.more { color: var(--text-3); }

.int-actions { display: flex; gap: 6px; align-items: center; }
.int-connect-btn { font-size: 12px; padding: 6px 14px; flex: 1; justify-content: center; }
.int-action-btn  { font-size: 11px; padding: 5px 10px; }
.disconnect-btn { width: 28px; height: 28px; flex-shrink: 0; border-radius: 6px; }

.test-result { font-size: 11px; padding: 6px 9px; background: var(--green-soft); color: var(--green-text); border-radius: 6px; line-height: 1.4; }
.test-result.test-error { background: var(--red-soft); color: var(--red-text); }

/* Built-in */
.builtin-section { margin-top: 8px; }
.builtin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 10px; }
.builtin-card { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
.builtin-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.builtin-icon.excel  { background: var(--green-soft); color: var(--green-text); }
.builtin-icon.search { background: var(--accent-soft); color: var(--accent); }
.builtin-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.builtin-name { font-size: 13px; font-weight: 600; color: var(--text-1); }
.builtin-desc { font-size: 12px; color: var(--text-2); }
.builtin-desc code { background: var(--surface-2); padding: 0 4px; border-radius: 3px; font-family: var(--mono); font-size: 11px; }
.always-on { font-size: 10px; font-weight: 700; padding: 3px 8px; background: var(--green-soft); color: var(--green-text); border-radius: 10px; white-space: nowrap; }

/* Side panel */
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 16px; }
.side-panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); width: 500px; max-width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg); display: flex; flex-direction: column; }

.panel-head { display: flex; align-items: center; gap: 12px; padding: 18px 20px 14px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.panel-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
.panel-title-wrap { flex: 1; }
.panel-title-wrap h2 { font-size: 15px; font-weight: 600; color: var(--text-1); margin-bottom: 2px; }
.panel-title-wrap p  { font-size: 12px; color: var(--text-2); }

.panel-tools { padding: 14px 20px; background: var(--surface-2); border-bottom: 1px solid var(--border-soft); }
.panel-tools-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--text-3); margin-bottom: 8px; }
.panel-tools-list { display: flex; flex-wrap: wrap; gap: 6px; }
.panel-tool-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-1); background: var(--surface); border: 1px solid var(--border); padding: 3px 9px; border-radius: 6px; }

.panel-tabs { display: flex; border-bottom: 1px solid var(--border); padding: 0 20px; flex-shrink: 0; }
.panel-tab { padding: 10px 14px; font-size: 13px; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; color: var(--text-3); margin-bottom: -1px; transition: all .15s; }
.panel-tab:hover { color: var(--text-1); }
.panel-tab.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 500; }

.panel-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.no-steps { font-size: 13px; color: var(--text-2); padding: 12px; background: var(--surface-2); border-radius: 8px; }

.guide-step { display: flex; gap: 12px; }
.step-num { width: 22px; height: 22px; border-radius: 50%; background: var(--surface-2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: var(--text-2); flex-shrink: 0; margin-top: 2px; }
.step-body strong { font-size: 13px; font-weight: 600; color: var(--text-1); display: block; margin-bottom: 4px; }
.step-body p { font-size: 13px; color: var(--text-2); line-height: 1.55; margin: 0; }
.step-body :deep(a) { color: var(--accent); }
.step-body :deep(b) { font-weight: 600; color: var(--text-1); }

.full-btn { width: 100%; justify-content: center; padding: 10px; }
.save-success { font-size: 13px; color: var(--green-text); background: var(--green-soft); padding: 8px 12px; border-radius: 8px; }
.form-footer { display: flex; justify-content: flex-end; gap: 8px; padding-top: 4px; }
.btn-connect { padding: 10px 18px; border-radius: 8px; border: none; cursor: pointer; font-size: 14px; font-weight: 500; color: #fff; transition: filter .15s, transform .15s; }
.btn-connect:hover:not(:disabled) { filter: brightness(1.12); transform: translateY(-1px); }
.btn-connect:disabled { opacity: .4; cursor: not-allowed; }

/* Toast */
.toast { position: fixed; bottom: 100px; right: 24px; background: var(--text-1); color: var(--text-inv); padding: 9px 18px; border-radius: 8px; font-size: 13px; z-index: 999; box-shadow: var(--shadow-lg); }
.toast-error { background: var(--red); }
</style>
