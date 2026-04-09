import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { readFile } from 'fs/promises';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import pdfParse from 'pdf-parse';
import XLSX from 'xlsx';
import { MANAGEMENT_REPORT_PROMPT } from './prompts/managementReport.js';
import { RENT_ROLL_PROMPT } from './prompts/rentRoll.js';
import { BUDGET_PROMPT } from './prompts/budget.js';

const app = express();
const PORT = process.env.PORT || 3333;

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// ── Multer (25 MB limit) ────────────────────────────────────
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// ── Anthropic client ────────────────────────────────────────
let claude = null;
if (process.env.ANTHROPIC_API_KEY) {
  claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// ── Supabase admin client ───────────────────────────────────
let supabaseAdmin = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// ── Helpers ─────────────────────────────────────────────────
async function extractWithClaude(systemPrompt, content) {
  if (!claude) throw new Error('ANTHROPIC_API_KEY not configured');
  const response = await claude.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content }],
  });
  const text = response.content[0]?.text || '';
  // Try to parse JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]); } catch { /* return raw */ }
  }
  return { raw: text };
}

async function parsePDF(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

function parseExcel(buffer) {
  const wb = XLSX.read(buffer, { type: 'buffer' });
  const sheets = {};
  wb.SheetNames.forEach(name => {
    sheets[name] = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1 });
  });
  return JSON.stringify(sheets, null, 2);
}

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    anthropic: !!claude,
    supabase: !!supabaseAdmin,
    timestamp: new Date().toISOString(),
  });
});

// ── API key status ──────────────────────────────────────────
app.get('/api/status', (req, res) => {
  res.json({ status: claude ? 'ok' : 'missing_key' });
});

// ── Extract: Management Report (PDF) ────────────────────────
app.post('/api/extract/management-report', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const text = await parsePDF(req.file.buffer);
    const result = await extractWithClaude(MANAGEMENT_REPORT_PROMPT, text);
    res.json(result);
  } catch (err) {
    console.error('Management report extraction error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Extract: Rent Roll (PDF or Excel) ───────────────────────
app.post('/api/extract/rent-roll', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const isPDF = req.file.originalname.toLowerCase().endsWith('.pdf');
    const content = isPDF
      ? await parsePDF(req.file.buffer)
      : parseExcel(req.file.buffer);
    const result = await extractWithClaude(RENT_ROLL_PROMPT, content);
    res.json(result);
  } catch (err) {
    console.error('Rent roll extraction error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Extract: Budget (Excel) ─────────────────────────────────
app.post('/api/extract/budget', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const content = parseExcel(req.file.buffer);
    const result = await extractWithClaude(BUDGET_PROMPT, content);
    res.json(result);
  } catch (err) {
    console.error('Budget extraction error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Chat endpoint ───────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    if (!claude) return res.status(503).json({ error: 'AI not configured — set ANTHROPIC_API_KEY' });
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'No message provided' });

    // Build conversation with fund context
    const systemPrompt = `You are an AI assistant for the MHC Fund Dashboard (NAI Merin Hunter Codman).
You help users understand their commercial real estate fund performance data.

Fund I (MHCREF): Vintage 2019, Value-Add Office — 5 properties in FL and SC
Fund II (MHCREF II): Vintage 2022, Value-Add Office — 4 properties in FL and CT
Sidecar: 2 co-invest properties (1 East Broward, Sawgrass International Place)

Answer questions about NOI, revenue, occupancy, distributions, year-over-year growth, and budget variance.
Be concise but accurate. Reference specific numbers when available.`;

    const messages = [
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];

    const response = await claude.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    });

    res.json({ response: response.content[0]?.text || 'No response' });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Auth: Get current user profile ──────────────────────────
app.get('/api/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !supabaseAdmin) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'Invalid token' });

    // Check user_roles table for role
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    res.json({
      id: user.id,
      email: user.email,
      role: roleData?.role || 'read',
      created_at: user.created_at,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin: List users ───────────────────────────────────────
app.get('/api/admin/users', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.json([]);
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    // Fetch roles
    const { data: roles } = await supabaseAdmin.from('user_roles').select('user_id, role');
    const roleMap = {};
    (roles || []).forEach(r => { roleMap[r.user_id] = r.role; });

    res.json(users.map(u => ({
      id: u.id,
      email: u.email,
      role: roleMap[u.id] || 'read',
      created_at: u.created_at,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin: Create user ──────────────────────────────────────
app.post('/api/admin/users', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Supabase not configured' });
    const { email, password, role = 'read' } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) return res.status(400).json({ error: error.message });

    // Set role
    await supabaseAdmin.from('user_roles').upsert({ user_id: data.user.id, role });

    res.json({ id: data.user.id, email, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin: Update user role ─────────────────────────────────
app.patch('/api/admin/users/:id', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Supabase not configured' });
    const { role } = req.body;
    await supabaseAdmin.from('user_roles').upsert({ user_id: req.params.id, role });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin: Delete user ──────────────────────────────────────
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Supabase not configured' });
    await supabaseAdmin.from('user_roles').delete().eq('user_id', req.params.id);
    await supabaseAdmin.auth.admin.deleteUser(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start server (only when running directly, not as Vercel serverless) ──
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`\n  MHC Dashboard API running on http://localhost:${PORT}`);
    console.log(`  Anthropic: ${claude ? '✓ Connected' : '✗ Not configured'}`);
    console.log(`  Supabase:  ${supabaseAdmin ? '✓ Connected' : '✗ Not configured'}\n`);
  });
}

export default app;
