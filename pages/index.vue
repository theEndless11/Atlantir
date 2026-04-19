<template>
  <div class="landing">
    <canvas ref="webglCanvas" class="bg-canvas" />

    <!-- Nav -->
    <nav class="nav">
      <div class="nav-logo">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
          <path d="M16 3L28 9.5V22.5L16 29L4 22.5V9.5L16 3Z" fill="rgba(52,211,153,0.12)" stroke="rgba(52,211,153,0.55)" stroke-width="1.2"/>
          <path d="M16 8L24 12.5V20L16 24L8 20V12.5L16 8Z" fill="rgba(16,185,129,0.18)" stroke="rgba(16,185,129,0.75)" stroke-width="0.8"/>
          <circle cx="16" cy="16" r="2.5" fill="#34d399"/>
        </svg>
        <span class="logo-text">Atlantir</span>
      </div>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#performance">Performance</a>
        <a href="#pricing">Pricing</a>
        <a href="#about">About</a>
      </div>
      <div class="nav-cta">
        <a href="/login" class="nav-signin">Sign in</a>
        <a href="/register" class="nav-signup">Get started free</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-left">
        <div class="hero-eyebrow">
          <span class="eyebrow-dot" />
          AI workspace · Built for teams
        </div>
        <h1 class="hero-title">
          The workspace where<br/>
          <em class="hero-accent">agents get things done.</em>
        </h1>
        <p class="hero-sub">
          Atlantir connects your meetings, tools and AI agents in one unified space.
          Speak a goal — your team researches, writes, executes and integrates automatically.
        </p>
        <div class="hero-btns">
          <a href="/register" class="btn-primary">
            Start building free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a href="/login" class="btn-ghost">Sign in →</a>
        </div>
        <div class="hero-proof">
          <div class="proof-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            No credit card
          </div>
          <span class="proof-sep" />
          <div class="proof-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Enterprise-ready
          </div>
          <span class="proof-sep" />
          <div class="proof-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Up in 5 minutes
          </div>
        </div>
      </div>

      <!-- Hero right — live stats panel -->
      <div class="hero-right">
        <div class="hero-panel">
          <div class="panel-header">
            <span class="panel-dot" />
            <span class="panel-title">Live agent activity</span>
            <span class="panel-badge">LIVE</span>
          </div>
          <div class="panel-agents">
            <div v-for="a in agents" :key="a.name" class="panel-agent">
              <div class="pa-left">
                <span class="pa-dot" :style="{'background': a.color, 'box-shadow': `0 0 8px ${a.color}80`}" />
                <div>
                  <div class="pa-name">{{ a.name }}</div>
                  <div class="pa-role">{{ a.role }}</div>
                </div>
              </div>
              <div class="pa-bar-wrap">
                <div class="pa-bar" :style="{'width': a.pct + '%', 'background': a.color}" />
              </div>
              <span class="pa-pct">{{ a.pct }}%</span>
            </div>
          </div>
          <div class="panel-stats">
            <div class="ps-item" v-for="s in panelStats" :key="s.label">
              <span class="ps-num">{{ s.num }}</span>
              <span class="ps-label">{{ s.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Agents row -->
    <section class="agents-section">
      <p class="agents-label">Five agents. One unified workspace.</p>
      <div class="agents-row">
        <div v-for="a in agents" :key="a.name" class="agent-pill" :style="{'--ac': a.color}">
          <span class="agent-dot" />
          <span class="agent-name">{{ a.name }}</span>
          <span class="agent-role">{{ a.role }}</span>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="page-section">
      <div class="eyebrow-tag">Capabilities</div>
      <h2 class="section-title">Everything connected.<br/><em class="title-accent">Everything automated.</em></h2>
      <div class="features-grid">
        <div v-for="f in features" :key="f.title" class="feat-card" :class="{wide: f.wide}">
          <div class="feat-icon-wrap" :style="{background: f.iconBg, borderColor: f.iconBorder}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="f.icon" />
          </div>
          <h3 class="feat-title">{{ f.title }}</h3>
          <p class="feat-desc">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Performance charts -->
    <section id="performance" class="page-section">
      <div class="eyebrow-tag">Performance</div>
      <h2 class="section-title">Real results.<br/><em class="title-accent">Measurable impact.</em></h2>
      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-meta">
            <h4 class="chart-title">Task Completion Rate</h4>
            <p class="chart-sub">Average across all agent runs</p>
            <div class="chart-stat">
              <span class="big-num">94%</span>
              <span class="big-delta">+38%</span>
            </div>
          </div>
          <div class="chart-wrap"><canvas ref="chartBar" /></div>
        </div>
        <div class="chart-card">
          <div class="chart-meta">
            <h4 class="chart-title">Time Saved per Week</h4>
            <p class="chart-sub">Per team member on average</p>
            <div class="chart-stat">
              <span class="big-num">14h</span>
              <span class="big-delta">+210%</span>
            </div>
          </div>
          <div class="chart-wrap"><canvas ref="chartLine" /></div>
        </div>
        <div class="chart-card chart-wide">
          <div class="chart-meta">
            <h4 class="chart-title">Agent Runs Over Time</h4>
            <p class="chart-sub">Monthly executions across all workspaces</p>
            <div class="chart-stat">
              <span class="big-num">2.4M</span>
              <span class="big-delta">+320% YoY</span>
            </div>
            <!-- Custom legend -->
            <div class="chart-legend">
              <span class="legend-item">
                <span class="legend-line solid" />
                With Atlantir
              </span>
              <span class="legend-item">
                <span class="legend-line dashed" />
                Without Atlantir
              </span>
            </div>
          </div>
          <div class="chart-wrap"><canvas ref="chartArea" /></div>
        </div>
      </div>
    </section>

    <!-- Integrations -->
    <section class="page-section">
      <div class="eyebrow-tag">Integrations</div>
      <p class="int-sub">22 integrations. More every week.</p>
      <div class="int-grid">
        <span v-for="name in integrations" :key="name" class="int-chip">{{ name }}</span>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="page-section">
      <div class="eyebrow-tag">Pricing</div>
      <h2 class="section-title">Simple, honest pricing.</h2>
      <div class="pricing-grid">
        <div v-for="plan in plans" :key="plan.name" class="price-card" :class="{featured: plan.featured}">
          <div v-if="plan.badge" class="price-badge">{{ plan.badge }}</div>
          <div class="price-tier">{{ plan.name }}</div>
          <div class="price-amount">{{ plan.price }}<span v-if="plan.sub" class="price-sub">{{ plan.sub }}</span></div>
          <ul class="price-list">
            <li v-for="item in plan.items" :key="item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ item }}
            </li>
          </ul>
          <a v-if="plan.href" :href="plan.href" class="price-btn" :class="{primary: plan.featured}">{{ plan.cta }}</a>
          <button v-else class="price-btn" disabled>{{ plan.cta }}</button>
        </div>
      </div>
    </section>

    <!-- About -->
    <section id="about" class="page-section">
      <div class="eyebrow-tag">Company</div>
      <h2 class="section-title">Built for builders.</h2>
      <div class="about-grid">
        <div v-for="c in aboutCards" :key="c.title" class="about-card">
          <div class="about-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="c.icon" />
          </div>
          <h3 class="about-title">{{ c.title }}</h3>
          <p class="about-body">{{ c.body }}</p>
          <span class="soon-tag">Coming soon</span>
        </div>
      </div>
    </section>

    <footer class="footer" style="margin-left: 30%;">
      <div class="footer-brand">
        <svg width="16" height="16" viewBox="0 0 32 32" fill="none"><path d="M16 3L28 9.5V22.5L16 29L4 22.5V9.5L16 3Z" fill="rgba(52,211,153,0.15)" stroke="rgba(52,211,153,0.4)" stroke-width="1"/></svg>
        <span>Atlantir</span>
      </div>
      <p>© {{ year }} Atlantir. All rights reserved.</p>
      <div class="footer-links">
  
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

definePageMeta?.({ auth: false })

const webglCanvas = ref<HTMLCanvasElement>()
const chartBar    = ref<HTMLCanvasElement>()
const chartLine   = ref<HTMLCanvasElement>()
const chartArea   = ref<HTMLCanvasElement>()

const year = computed(() => new Date().getFullYear())

const agents = [
  { name: 'Scout', role: 'Researcher',  color: '#34d399', pct: 92 },
  { name: 'Bolt',  role: 'Executor',    color: '#6ee7b7', pct: 87 },
  { name: 'Sage',  role: 'Analyst',     color: '#10b981', pct: 95 },
  { name: 'Quill', role: 'Writer',      color: '#a7f3d0', pct: 78 },
  { name: 'Link',  role: 'Synthesizer', color: '#059669', pct: 83 },
]

const panelStats = [
  { num: '2.4M', label: 'Runs this month' },
  { num: '94%',  label: 'Success rate' },
  { num: '14h',  label: 'Avg time saved' },
]

const features = [
  {
    title: 'AI Command Center',
    desc: 'Type or speak any goal. Agents plan, delegate, and execute the full pipeline automatically.',
    icon: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    iconBg: 'rgba(52,211,153,0.1)', iconBorder: 'rgba(52,211,153,0.2)', wide: true,
  },
  {
    title: 'Voice Mode',
    desc: 'Deepgram STT + ElevenLabs TTS. Speak instructions, get spoken answers.',
    icon: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/>',
    iconBg: 'rgba(110,231,183,0.1)', iconBorder: 'rgba(110,231,183,0.2)', wide: false,
  },
  {
    title: 'Meeting Intelligence',
    desc: 'Auto summaries, action items and GitHub issues created in real time.',
    icon: '<rect x="3" y="8" width="12" height="8" rx="2"/><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.894L15 14"/>',
    iconBg: 'rgba(16,185,129,0.1)', iconBorder: 'rgba(16,185,129,0.2)', wide: false,
  },
  {
    title: '22 Integrations',
    desc: 'Slack, GitHub, Jira, HubSpot, Notion and more. Real actions, not just mentions.',
    icon: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
    iconBg: 'rgba(5,150,105,0.1)', iconBorder: 'rgba(5,150,105,0.2)', wide: false,
  },
  {
    title: 'Automated Workflows',
    desc: 'Define pipelines once, run on a schedule or by voice command.',
    icon: '<polygon points="5 3 19 12 5 21 5 3"/>',
    iconBg: 'rgba(52,211,153,0.08)', iconBorder: 'rgba(52,211,153,0.18)', wide: false,
  },
  {
    title: 'Knowledge Base',
    desc: 'Upload docs and SOPs. Agents inject relevant context into every task.',
    icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    iconBg: 'rgba(167,243,208,0.08)', iconBorder: 'rgba(167,243,208,0.18)', wide: false,
  },
]

const integrations = ['Slack','GitHub','Gmail','Jira','Linear','HubSpot','Notion','Stripe','Trello','Asana','Twilio','Vercel','Sentry','Zapier','Airtable','Zendesk','PagerDuty','Intercom','Cloudflare','Google Cal','Excel','Web Search']

const plans = [
  { name: 'Starter', price: 'Free', sub: ' forever', items: ['1 workspace','50 agent runs / month','2 integrations','1 GB knowledge base','Meeting transcripts'], cta: 'Get started free', href: '/register', featured: false, badge: null },
  { name: 'Pro', price: 'Coming soon', sub: null, items: ['Unlimited workspaces','Unlimited agent runs','All 22 integrations','25 GB knowledge base','Voice mode','Full analytics'], cta: 'Notify me', href: null, featured: true, badge: 'Most popular' },
  { name: 'Enterprise', price: 'Custom', sub: null, items: ['Everything in Pro','SSO / SAML','Custom integrations','SLA & uptime guarantee','Dedicated support'], cta: 'Contact us', href: null, featured: false, badge: null },
]

const aboutCards = [
  { title: 'About Atlantir', body: 'Built for teams who want AI to do real work — take actions, write code, send messages and get things done.', icon: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>' },
  { title: 'Privacy policy', body: 'Your workspace data is isolated and never used to train models. Your data stays yours.', icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  { title: 'Terms of service', body: 'By using Atlantir you agree to use it responsibly. We reserve the right to suspend accounts that violate our usage policies.', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },
  { title: 'Help & support', body: 'Documentation, integration guides and FAQs coming soon. Reach us directly in the meantime.', icon: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
]

//  WebGL─
function buildWebGL() {
  const canvas = webglCanvas.value
  if (!canvas) return
  const T = (window as any).THREE
  if (!T) return

  const W = window.innerWidth, H = window.innerHeight
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setSize(W, H)
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setClearColor(0x020d07, 1)

  const scene  = new T.Scene()
  const camera = new T.PerspectiveCamera(60, W / H, 0.1, 800)
  camera.position.z = 95

  const makeCircleTex = () => {
    const s = 32, c = document.createElement('canvas')
    c.width = s; c.height = s
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2)
    g.addColorStop(0,    'rgba(255,255,255,1)')
    g.addColorStop(0.4,  'rgba(255,255,255,0.4)')
    g.addColorStop(1,    'rgba(255,255,255,0)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, s, s)
    return new T.CanvasTexture(c)
  }

  const N = 120
  const pos = new Float32Array(N * 3)
  const col = new Float32Array(N * 3)
  const greens = [[0.20,0.82,0.60],[0.06,0.73,0.51],[0.65,0.95,0.82]]
  for (let i = 0; i < N; i++) {
    const r = 100 + Math.random() * 130
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)
    pos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
    pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.4
    pos[i*3+2] = r * Math.cos(phi) - 80
    const c = greens[Math.floor(Math.random() * greens.length)]
    const b = 0.12 + Math.random() * 0.35
    col[i*3]=c[0]*b; col[i*3+1]=c[1]*b; col[i*3+2]=c[2]*b
  }
  const pGeo = new T.BufferGeometry()
  pGeo.setAttribute('position', new T.BufferAttribute(pos, 3))
  pGeo.setAttribute('color',    new T.BufferAttribute(col, 3))
  const pMat = new T.PointsMaterial({
    size: 1.6, map: makeCircleTex(), vertexColors: true,
    transparent: true, opacity: 0.45, sizeAttenuation: true,
    blending: T.AdditiveBlending, depthWrite: false, alphaTest: 0.001,
  })
  scene.add(new T.Points(pGeo, pMat))

  const kGeo = new T.TorusKnotGeometry(20, 3.8, 160, 14, 2, 3)
  const kMat = new T.MeshBasicMaterial({ color: 0x34d399, wireframe: true, transparent: true, opacity: 0.11, blending: T.AdditiveBlending, depthWrite: false })
  const knot = new T.Mesh(kGeo, kMat)
  knot.position.set(260, 0, -40)
  scene.add(knot)

  const rGeo = new T.TorusGeometry(34, 0.3, 6, 80)
  const rMat = new T.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.07, blending: T.AdditiveBlending, depthWrite: false })
  const ring = new T.Mesh(rGeo, rMat)
  ring.rotation.x = Math.PI * 0.42; ring.position.set(260, 0, -40)
  scene.add(ring)

  let mx = 0, my = 0
  window.addEventListener('mousemove', e => { mx=(e.clientX/window.innerWidth-.5)*2; my=(e.clientY/window.innerHeight-.5)*2 })
  const onResize = () => { const w=window.innerWidth,h=window.innerHeight; renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix() }
  window.addEventListener('resize', onResize)

  const clock = new T.Clock(); let frame: number
  const tick = () => {
    frame = requestAnimationFrame(tick)
    const t = clock.getElapsedTime()
    knot.rotation.x = t*0.12; knot.rotation.y = t*0.08
    ring.rotation.z = t*0.05
    camera.position.x += (mx*8 - camera.position.x)*0.02
    camera.position.y += (-my*5 - camera.position.y)*0.02
    camera.lookAt(0,0,0)
    renderer.render(scene, camera)
  }
  tick()

  const obs = new MutationObserver(() => { if (!document.contains(canvas)) { cancelAnimationFrame(frame); window.removeEventListener('resize', onResize); renderer.dispose(); obs.disconnect() } })
  obs.observe(document.body, { childList: true, subtree: true })
}

//  Charts
function buildCharts(Chart: any) {
  const gridColor  = 'rgba(52,211,153,0.06)'
  const tickColor  = 'rgba(220,252,231,0.55)'
  const tickFont   = { size: 11, family: 'Outfit' }
  const axisOpts   = {
    grid:   { color: gridColor, drawBorder: false },
    ticks:  { color: tickColor, font: tickFont, padding: 8 },
    border: { color: 'rgba(52,211,153,0.08)', dash: [4, 4] },
  }

  const base = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(2,13,7,0.97)',
        borderColor: 'rgba(52,211,153,0.2)', borderWidth: 1,
        titleColor: '#a7f3d0', bodyColor: 'rgba(220,252,231,0.8)',
        cornerRadius: 10, padding: 12,
        titleFont: { family: 'Outfit', size: 12, weight: '400' },
        bodyFont:  { family: 'Outfit', size: 11 },
      },
    },
    animation: { duration: 1400, easing: 'easeOutQuart' },
  }

  // Bar — slim bars with generous spacing, rounded pill tops
  if (chartBar.value) new Chart(chartBar.value, {
    type: 'bar',
    data: {
      labels: ['Manual', 'Basic AI', 'Atlantir'],
      datasets: [{
        label: 'Completion %',
        data: [56, 68, 94],
        backgroundColor: [
          'rgba(5,150,105,0.25)',
          'rgba(16,185,129,0.35)',
          'rgba(52,211,153,0.55)',
        ],
        borderColor:  ['#059669', '#10b981', '#34d399'],
        borderWidth:  1.5,
        borderRadius: 3,
        borderSkipped: false,
        barThickness: 32,   // ← slim bars, not full-width blobs
      }],
    },
    options: {
      ...base,
      scales: {
        x: { ...axisOpts },
        y: { ...axisOpts, min: 0, max: 110, ticks: { ...axisOpts.ticks, callback: (v: number) => v + '%', stepSize: 20 } },
      },
    },
  })

  // Line — thin stroke, visible data points with contrasting ring
  if (chartLine.value) new Chart(chartLine.value, {
    type: 'line',
    data: {
      labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'],
      datasets: [{
        label: 'Hours saved',
        data: [2, 4, 6, 9, 11, 14],
        borderColor:       '#6ee7b7',
        backgroundColor:   'rgba(110,231,183,0.05)',
        borderWidth:       1.5,
        pointBackgroundColor: '#6ee7b7',
        pointBorderColor:     'rgba(2,13,7,0.9)',
        pointBorderWidth:  1.5,
        pointRadius:       5,
        pointHoverRadius:  7,
        fill: true, tension: 0.4,
      }],
    },
    options: {
      ...base,
      scales: {
        x: { ...axisOpts },
        y: { ...axisOpts, min: 0, max: 16, ticks: { ...axisOpts.ticks, callback: (v: number) => v + 'h', stepSize: 4 } },
      },
    },
  })

  // Area — two series: solid vs dashed, research-paper style
  if (chartArea.value) new Chart(chartArea.value, {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [
        {
          label: 'With Atlantir',
          data: [80,120,180,250,340,480,640,820,1100,1500,1950,2400],
          borderColor:     '#34d399',
          backgroundColor: 'rgba(52,211,153,0.06)',
          borderWidth:     1.5,
          pointBackgroundColor: '#34d399',
          pointBorderColor:     'rgba(2,13,7,0.9)',
          pointBorderWidth: 1.5,
          pointRadius:  4,
          pointHoverRadius: 6,
          fill: true, tension: 0.4,
        },
        {
          label: 'Without Atlantir',
          data: [80,90,100,105,110,118,122,128,134,140,148,155],
          borderColor:     'rgba(52,211,153,0.4)',
          backgroundColor: 'rgba(52,211,153,0.02)',
          borderWidth:     1.2,
          borderDash:      [6, 4],
          pointBackgroundColor: 'rgba(52,211,153,0.5)',
          pointRadius:  3,
          pointHoverRadius: 5,
          fill: true, tension: 0.4,
        },
      ],
    },
    options: {
      ...base,
      scales: {
        x: { ...axisOpts, ticks: { ...axisOpts.ticks, maxTicksLimit: 6 } },
        y: { ...axisOpts, min: 0, ticks: { ...axisOpts.ticks, callback: (v: number) => v >= 1000 ? (v/1000).toFixed(1)+'M' : v+'K' } },
      },
    },
  })
}

function loadScript(src: string): Promise<void> {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) { res(); return }
    const s = document.createElement('script'); s.src = src; s.onload = () => res(); s.onerror = rej
    document.head.appendChild(s)
  })
}

onMounted(async () => {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js')
  buildWebGL()
  await loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js')
  buildCharts((window as any).Chart)
})
</script>

<!-- ADD a separate unscoped style block -->
<style>
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #020d07; }
::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.18); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: rgba(52,211,153,0.32); }
html, body { scrollbar-width: thin; scrollbar-color: rgba(52,211,153,0.2) #020d07; }
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap');

/*  Violet scrollbar ─ */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: #020d07; }
::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.55); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: rgba(167,139,250,0.75); }

:root {
  --g0: #34d399;
  --g1: #10b981;
  --g2: #059669;
  --g3: #a7f3d0;
  --g4: #6ee7b7;
  --dark:  #020d07;
  --dark2: #041209;
  --border: rgba(52,211,153,0.12);
  --border-hi: rgba(52,211,153,0.28);
  --text: #e8f5e9;
  --text-dim: #a7f3d0;
  --text-faint: #6ee7b7;
  --r: 14px;
}

* { margin:0; padding:0; box-sizing:border-box; }
html, body {
  background:#020d07 !important;
  scrollbar-width: thin;
  scrollbar-color: rgba(139,92,246,0.55) #020d07;
}

.landing {
    min-height:100vh; background:#020d07;
  color:var(--text);
  font-family:'Inter',sans-serif; font-weight:300;
  overflow-x:hidden; position:relative;
  --text-1: #e8f5e9;          /* global uses --text-1 for color: , remap it */
  --text-2: #a7f3d0;          /* muted text */
  --text-3: #6ee7b7;          /* faint/hint text */
  --bg:     #020d07;          /* prevent global bg bleed */
  --surface: rgba(4,18,9,0.85);
  --border:  rgba(52,211,153,0.14);
  color: #e8f5e9 !important;  /* hard-reset body color inheritance */
}

.bg-canvas {
  position:fixed; inset:0; width:100%; height:100%;
  z-index:0; pointer-events:none; display:block; background:#020d07;
}

/* Nav */
.nav {
  position:fixed; top:0; left:0; right:0; z-index:200;
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 52px;
  background:rgba(2,13,7,0.9); backdrop-filter:blur(20px);
  border-bottom:1px solid var(--border);
}
.nav-logo {
  display:flex; align-items:center; gap:10px;
  font-family:'Playfair Display',serif; font-size:19px; font-weight:600;
  color:var(--text);
}
.nav-links { display:flex; gap:28px; }
.nav-links a {
  font-size:13px; font-weight:400; color:var(--text-dim);
  text-decoration:none; transition:color .15s; letter-spacing:0.01em;
}
.nav-links a:hover { color:var(--g0); }
.nav-cta { display:flex; align-items:center; gap:12px; }
.nav-signin {
  font-size:13px; font-weight:400; color:var(--text-dim);
  text-decoration:none; transition:color .15s;
}
.nav-signin:hover { color:var(--text); }
.nav-signup {
  font-size:13px; font-weight:600; padding:8px 20px;
  border-radius:40px; background:var(--g0); color:var(--dark);
  text-decoration:none; transition:all .2s; letter-spacing:0.01em;
}
.nav-signup:hover { background:var(--g3); transform:translateY(-1px); box-shadow:0 6px 28px rgba(52,211,153,0.28); }

/* Hero */
.hero {
  position:relative; z-index:10;
  min-height:100vh;
  display:flex; align-items:center; justify-content:space-between;
  gap:48px; padding:100px 60px 60px;
  max-width:1280px; margin:0 auto;
}
.hero-left { flex:1; max-width:580px; }
.hero-eyebrow {
  display:flex; align-items:center; gap:10px;
  font-size:11px; letter-spacing:0.14em; text-transform:uppercase;
  color:var(--g0); margin-bottom:20px; font-weight:500;
}
.eyebrow-dot {
  width:7px; height:7px; border-radius:50%; background:var(--g0);
  animation:pulse 2.4s ease-in-out infinite;
}
@keyframes pulse {
  0%,100% { box-shadow:0 0 0 0 rgba(52,211,153,0.6); }
  50%      { box-shadow:0 0 0 9px rgba(52,211,153,0); }
}
.hero-title {
  font-family:'Playfair Display',serif;
  font-size:clamp(38px,4.8vw,68px); font-weight:700;
  line-height:1.08; letter-spacing:-0.02em;
  color:#ffffff; margin-bottom:18px;
}
.hero-accent { font-style:italic; font-weight:500; color:var(--g0); display:block; }
.hero-sub {
  font-size:15.5px; font-weight:300; line-height:1.75;
  color:var(--text-dim); max-width:480px; margin-bottom:32px;
}
.hero-btns { display:flex; align-items:center; gap:14px; margin-bottom:28px; }
.btn-primary {
  display:inline-flex; align-items:center; gap:9px;
  padding:13px 28px; border-radius:40px; background:var(--g0); color:var(--dark);
  font-size:14px; font-weight:600; text-decoration:none; transition:all .22s;
  letter-spacing:0.01em;
}
.btn-primary:hover { background:var(--g3); transform:translateY(-2px); box-shadow:0 10px 36px rgba(52,211,153,0.26); }
.btn-ghost {
  font-size:14px; font-weight:400; color:var(--text-dim);
  text-decoration:none; transition:color .15s;
}
.btn-ghost:hover { color:var(--text); }
.hero-proof { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.proof-item { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--text-dim); }
.proof-item svg { color:var(--g2); flex-shrink:0; }
.proof-sep { width:3px; height:3px; border-radius:50%; background:var(--text-faint); }

/* Hero Right Panel */
.hero-right { flex-shrink:0; width:320px; }
.hero-panel {
  background:rgba(4,18,9,0.9); border:1px solid var(--border-hi);
  border-radius:20px; padding:24px;
  backdrop-filter:blur(24px);
  box-shadow:0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(52,211,153,0.08);
}
.panel-header { display:flex; align-items:center; gap:8px; margin-bottom:18px; }
.panel-dot { width:6px; height:6px; border-radius:50%; background:var(--g0); animation:pulse 2s infinite; flex-shrink:0; }
.panel-title { font-size:11.5px; font-weight:400; color:var(--text-dim); letter-spacing:0.04em; flex:1; }
.panel-badge {
  font-size:9px; font-weight:600; letter-spacing:0.1em;
  background:rgba(52,211,153,0.15); color:var(--g0);
  border:1px solid rgba(52,211,153,0.25); border-radius:40px; padding:3px 9px;
}
.panel-agents { display:flex; flex-direction:column; gap:12px; margin-bottom:20px; }
.panel-agent { display:flex; align-items:center; gap:12px; }
.pa-left { display:flex; align-items:center; gap:10px; width:120px; flex-shrink:0; }
.pa-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.pa-name { font-size:12.5px; font-weight:500; color:var(--text); line-height:1.2; }
.pa-role { font-size:10px; color:var(--text-faint); }
.pa-bar-wrap { flex:1; height:3px; background:rgba(52,211,153,0.08); border-radius:4px; overflow:hidden; }
.pa-bar { height:100%; border-radius:4px; transition:width 1.2s ease; }
.pa-pct { font-size:11px; color:var(--text-dim); width:28px; text-align:right; flex-shrink:0; }
.panel-stats {
  display:grid; grid-template-columns:repeat(3,1fr); gap:10px;
  padding-top:16px; border-top:1px solid var(--border);
}
.ps-item { display:flex; flex-direction:column; gap:3px; }
.ps-num { font-family:'Playfair Display',serif; font-size:18px; font-weight:600; color:var(--g0); line-height:1; }
.ps-label { font-size:9px; color:var(--text-dim); letter-spacing:0.04em; }

/* Agents row */
.agents-section {
  position:relative; z-index:10;
  display:flex; flex-direction:column; align-items:center;
  padding:0 24px 48px; gap:14px;
}
.agents-label { font-size:10.5px; letter-spacing:0.12em; text-transform:uppercase; color:var(--text-faint); font-weight:500; }
.agents-row { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; }
.agent-pill {
  display:flex; align-items:center; gap:9px;
  padding:9px 18px; border-radius:40px;
  border:1px solid var(--border); background:rgba(4,18,9,0.7);
  backdrop-filter:blur(10px); transition:border-color .2s;
}
.agent-pill:hover { border-color:var(--border-hi); }
.agent-dot { width:7px; height:7px; border-radius:50%; background:var(--ac); box-shadow:0 0 8px var(--ac); flex-shrink:0; }
.agent-name { font-family:'Playfair Display',serif; font-size:13.5px; font-weight:600; color:var(--text); }
.agent-role { font-size:11px; color:var(--text-dim); }

/* Page sections */
.page-section {
  position:relative; z-index:10;
  padding:64px 60px; max-width:1200px; margin:0 auto;
}
.eyebrow-tag {
  font-size:10px; font-weight:600; text-transform:uppercase;
  letter-spacing:0.18em; color:var(--g1); margin-bottom:12px;
}
.section-title {
  font-family:'Playfair Display',serif;
  font-size:clamp(26px,3vw,44px); font-weight:700;
  line-height:1.12; letter-spacing:-0.02em;
  color:var(--text); margin-bottom:36px;
}
.title-accent { font-style:italic; font-weight:500; color:var(--g0); }

/*  Features */
.features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
.feat-card {
  background:rgba(4,18,9,0.8); border:1px solid var(--border);
  border-radius:var(--r); padding:24px 20px;
  transition:border-color .2s, background .2s;
  position:relative; overflow:hidden;
}
.feat-card::before {
  content:''; position:absolute; top:0; left:16px; right:16px; height:1px;
  background:linear-gradient(90deg,transparent,rgba(52,211,153,0.15),transparent);
}
.feat-card:hover { border-color:var(--border-hi); background:rgba(52,211,153,0.03); }
.feat-card.wide { grid-column:span 2; }
.feat-icon-wrap {
  width:38px; height:38px; border-radius:10px;
  display:flex; align-items:center; justify-content:center;
  color:var(--g0); margin-bottom:14px; border:1px solid;
}
.feat-title {
  font-family:'Playfair Display',serif; font-size:17px; font-weight:600;
  color:var(--text); margin-bottom:7px;
}
.feat-desc { font-size:13px; color:var(--text-dim); line-height:1.65; }

/*  Charts */
.charts-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.chart-card {
  background:rgba(4,18,9,0.85); border:1px solid var(--border);
  border-radius:var(--r); padding:24px 22px;
  display:flex; flex-direction:column;
}
.chart-wide { grid-column:span 2; }
.chart-title {
  font-family:'Playfair Display',serif; font-size:17px; font-weight:600;
  color:var(--text); margin-bottom:3px;
}
.chart-sub { font-size:12px; color:var(--text-dim); margin-bottom:12px; }
.chart-stat { display:flex; align-items:baseline; gap:10px; margin-bottom:16px; }
.big-num { font-family:'Playfair Display',serif; font-size:34px; font-weight:700; color:var(--g0); line-height:1; }
.big-delta {
  font-size:11.5px; font-weight:500; color:var(--g1);
  background:rgba(16,185,129,0.1); padding:3px 10px;
  border-radius:40px; border:1px solid rgba(16,185,129,0.18);
}
.chart-legend { display:flex; gap:16px; margin-bottom:16px; flex-wrap:wrap; }
.legend-item { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--text-dim); }
.legend-line { width:20px; height:2px; border-radius:1px; flex-shrink:0; }
.legend-line.solid  { background:#34d399; }
.legend-line.dashed { background:transparent; border-top:2px dashed rgba(52,211,153,0.45); }
.chart-wrap { height:200px; position:relative; }
.chart-wide .chart-wrap { height:220px; }

/*  Integrations ─ */
.int-sub { font-size:13px; color:var(--text-dim); margin-bottom:16px; }
.int-grid { display:flex; flex-wrap:wrap; gap:7px; }
.int-chip {
  font-size:12px; padding:6px 14px; border-radius:40px;
  border:1px solid var(--border); color:var(--text-dim);
  background:rgba(4,18,9,0.7); transition:all .15s;
}
.int-chip:hover { border-color:var(--border-hi); color:var(--g0); }

/*  Pricing─ */
.pricing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
.price-card {
  background:rgba(4,18,9,0.8); border:1px solid var(--border);
  border-radius:var(--r); padding:28px 24px;
  display:flex; flex-direction:column; gap:9px; position:relative;
}
.price-card.featured { border-color:rgba(52,211,153,0.28); background:rgba(52,211,153,0.04); }
.price-badge {
  position:absolute; top:-1px; left:50%; transform:translateX(-50%);
  font-size:9px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;
  background:var(--g0); color:var(--dark); padding:4px 14px; border-radius:0 0 10px 10px;
}
.price-tier {
  font-size:10.5px; letter-spacing:0.12em; text-transform:uppercase;
  color:var(--text-dim); font-weight:500; margin-top:8px;
}
.price-amount {
  font-family:'Playfair Display',serif; font-size:32px; font-weight:700;
  color:var(--text); line-height:1.1; margin:4px 0 10px;
}
.price-sub { font-family:'Inter',sans-serif; font-size:13px; color:var(--text-dim); }
.price-list { list-style:none; display:flex; flex-direction:column; gap:8px; margin-bottom:14px; }
.price-list li { font-size:13px; color:var(--text-dim); display:flex; align-items:center; gap:9px; }
.price-list li svg { color:var(--g2); flex-shrink:0; }
.price-btn {
  display:block; text-align:center; text-decoration:none;
  padding:11px; border-radius:40px; font-size:13px; font-weight:500;
  border:1px solid var(--border-hi); color:var(--g0); background:transparent;
  cursor:pointer; transition:all .2s; margin-top:auto; letter-spacing:0.02em;
}
.price-btn:hover:not(:disabled) { background:rgba(52,211,153,0.08); border-color:var(--g0); }
.price-btn.primary { background:var(--g0); color:var(--dark); border-color:var(--g0); }
.price-btn.primary:hover { background:var(--g3); }
.price-btn:disabled { opacity:0.25; cursor:not-allowed; }

/*  About─ */
.about-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
.about-card {
  background:rgba(4,18,9,0.8); border:1px solid var(--border);
  border-radius:var(--r); padding:24px 20px; transition:border-color .2s;
}
.about-card:hover { border-color:var(--border-hi); }
.about-icon {
  width:36px; height:36px; border-radius:9px;
  background:rgba(52,211,153,0.08); border:1px solid var(--border);
  display:flex; align-items:center; justify-content:center;
  color:var(--g0); margin-bottom:12px;
}
.about-title {
  font-family:'Playfair Display',serif; font-size:16px; font-weight:600;
  color:var(--text); margin-bottom:7px;
}
.about-body { font-size:13px; color:var(--text-dim); line-height:1.65; margin-bottom:12px; }
.soon-tag {
  display:inline-block; font-size:10px; font-weight:500; letter-spacing:0.08em;
  text-transform:uppercase; color:var(--g2); background:rgba(5,150,105,0.1);
  border:1px solid rgba(5,150,105,0.2); padding:3px 10px; border-radius:40px;
}

/*  Footer */
.footer {
  position:relative; z-index:10;
  border-top:1px solid var(--border); padding:20px 52px;
  display:flex; align-items:center; gap:20px; flex-wrap:wrap;
}
.footer-brand {
  display:flex; align-items:center; gap:8px;
  font-family:'Playfair Display',serif; font-size:14px; font-weight:600;
  color:var(--text-faint);
}
.footer > p { font-size:11.5px; color:var(--text-faint); flex:1; }
.footer-links { display:none; }

/*  Responsive ─ */
@media (max-width:1024px) {
  .hero { flex-direction:column; align-items:flex-start; }
  .hero-right { width:100%; max-width:440px; }
}
@media (max-width:768px) {
  .nav { padding:12px 20px; }
  .nav-links { display:none; }
  .hero { padding:90px 20px 48px; gap:32px; }
  .page-section { padding:48px 20px; }
  .features-grid { grid-template-columns:1fr; }
  .feat-card.wide { grid-column:span 1; }
  .charts-grid { grid-template-columns:1fr; }
  .chart-wide { grid-column:span 1; }
  .pricing-grid { grid-template-columns:1fr; }
  .about-grid { grid-template-columns:1fr; }
  .footer { padding:16px 20px; flex-direction:column; align-items:flex-start; }
}
</style>