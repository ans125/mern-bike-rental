// Generates client/public/commit-report.html from the git history.
// Run from the repo root:  node scripts/generate-commit-report.mjs
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const SEP = "@@C@@";
const raw = execFileSync("git", ["log", "--reverse", "--numstat", `--format=${SEP}%h|%aI|%s`], { encoding: "utf8", maxBuffer: 1e8 });

const commits = raw.split(SEP).filter((x) => x.trim()).map((chunk) => {
  const [head, ...rest] = chunk.trim().split("\n");
  const [hash, date, ...subj] = head.split("|");
  let add = 0, del = 0, files = 0;
  for (const l of rest) {
    const m = l.match(/^(\d+|-)\t(\d+|-)\t/);
    if (m) { files++; add += +m[1] || 0; del += +m[2] || 0; }
  }
  return { hash, date: date.slice(0, 10), time: date.slice(11, 16), subject: subj.join("|"), add, del, files };
});

const days = [...new Set(commits.map((c) => c.date))];
const first = commits[0].date, last = commits.at(-1).date;
const span = Math.round((new Date(last) - new Date(first)) / 864e5) + 1;
const totAdd = commits.reduce((a, c) => a + c.add, 0), totDel = commits.reduce((a, c) => a + c.del, 0);
const perMonth = {};
commits.forEach((c) => (perMonth[c.date.slice(0, 7)] = (perMonth[c.date.slice(0, 7)] || 0) + 1));
const maxM = Math.max(...Object.values(perMonth));
const today = new Date().toISOString().slice(0, 10);
const repo = "https://github.com/ans125/mern-bike-rental";

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>RideRent FYP Documentation & Commit Report</title>
<meta name="description" content="Final Year Project documentation and Git commit report for RideRent.">
<style>
:root{--bg:#f6f8f7;--surface:#fff;--text:#14211b;--muted:#5b6b63;--line:#dde5e0;--brand:#198754;--soft:#e6f4ec}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#0f1613;--surface:#17211c;--text:#e6efe9;--muted:#9fb2a8;--line:#2a3a32;--brand:#3fbf7f;--soft:#1b3226}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.6 system-ui,"Segoe UI",sans-serif}
.wrap{max-width:960px;margin:0 auto;padding:32px 16px 64px}h1{font-size:clamp(1.7rem,4vw,2.3rem);margin:8px 0}h2{margin:40px 0 12px;font-size:1.3rem;border-bottom:2px solid var(--brand);padding-bottom:4px}
.muted{color:var(--muted)}a{color:var(--brand)}.brand{font-weight:800}.brand span{color:var(--brand)}
.card{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:16px 20px}
.grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}.stat b{display:block;font-size:1.8rem;color:var(--brand)}
table{width:100%;border-collapse:collapse;background:var(--surface);font-size:.92rem}th,td{border:1px solid var(--line);padding:6px 10px;text-align:left;vertical-align:top}th{background:var(--soft)}
td.n{text-align:right;white-space:nowrap}.bar{height:14px;background:var(--brand);border-radius:4px}ul{padding-left:20px}
.btn{font:inherit;padding:8px 16px;border-radius:8px;border:0;background:var(--brand);color:#fff;cursor:pointer}
@media(max-width:600px){.scroll{overflow-x:auto}}
@media print{:root{--bg:#fff;--surface:#fff;--text:#000;--muted:#444;--line:#999;--soft:#eee}.noprint{display:none}.wrap{padding:0}h2{break-after:avoid}tr{break-inside:avoid}}
</style></head><body><div class="wrap">
<div class="brand">Ride<span>Rent</span></div>
<h1>Final Year Project: Documentation &amp; Commit Report</h1>
<p class="muted">BS Computer Science (V), Batch F24 &middot; Generated ${today} &middot; Source: <a href="${repo}">${repo}</a></p>
<p class="noprint"><button class="btn" onclick="window.print()">Print / Save as PDF</button>
 &nbsp;<a href="/project-overview.html">Project overview</a></p>

<h2>1. Project team</h2>
<table><tr><th>Roll no.</th><th>Name</th><th>Role</th></tr>
<tr><td>BSCS(V)-F24-75</td><td>Muhammad Anas</td><td>Team leader</td></tr>
<tr><td>BSCS(V)-F24-65</td><td>Muhammad Ameen</td><td>Team member</td></tr></table>

<h2>2. Project summary</h2>
<div class="card"><p><b>RideRent</b> is a MERN-stack bike rental marketplace. Owners (providers) list bikes, renters book them,
and an admin oversees the platform.</p><ul>
<li><b>Roles:</b> user (renter), provider (bike owner, needs admin approval), admin.</li>
<li><b>Booking flow:</b> request, provider approval, renter/owner chat, hand-over and return marked by the owner.</li>
<li><b>Money:</b> the platform keeps a 10% commission on each booking.</li>
<li><b>Trust &amp; safety:</b> CNIC (KYC) verification reviewed by admin; images are stored privately.</li>
<li><b>Support:</b> AI customer support chat (Google Gemini) and a Contact/support inbox for admins.</li></ul></div>

<h2>3. Technology</h2>
<table><tr><th>Layer</th><th>Technology</th></tr>
<tr><td>Frontend</td><td>React 19, Vite 7, React Router 7, React Bootstrap</td></tr>
<tr><td>Backend</td><td>Node 22, Express 5, JWT authentication, Multer uploads, Swagger API docs</td></tr>
<tr><td>Database</td><td>MongoDB with Mongoose 9 (local for development, MongoDB Atlas live)</td></tr>
<tr><td>Hosting</td><td>Vercel (frontend), Render (backend), Atlas (database); auto-deploy from <code>main</code></td></tr></table>
<p>Server flow: <b>Route &rarr; Middleware (auth / role checks) &rarr; Controller &rarr; Model</b>. Access control is enforced on the server.</p>

<h2>4. Live links &amp; documentation</h2>
<ul><li>Live site: <a href="https://riderent-tawny.vercel.app/">riderent-tawny.vercel.app</a></li>
<li>API (Swagger): <a href="https://riderent-api.onrender.com/api-docs">riderent-api.onrender.com/api-docs</a></li>
<li>Non-technical overview: <a href="/project-overview.html">project-overview.html</a></li>
<li>Source code &amp; developer docs (<code>agent-docs/</code>): <a href="${repo}">GitHub repository</a></li></ul>

<h2>5. Git &amp; GitHub usage</h2>
<ul><li>All code and documentation are version-controlled in a local repository and pushed to the remote GitHub repository above.</li>
<li>Deployment is automatic from the <code>main</code> branch.</li>
<li>This report is generated directly from <code>git log</code> by <code>scripts/generate-commit-report.mjs</code>.</li></ul>

<h2>6. Commit summary</h2>
<div class="grid">
<div class="card stat"><b>${commits.length}</b>commits</div>
<div class="card stat"><b>${days.length}</b>days with commits</div>
<div class="card stat"><b>${span}</b>days, first to last</div>
<div class="card stat"><b>+${totAdd.toLocaleString("en")}</b>lines added</div>
<div class="card stat"><b>-${totDel.toLocaleString("en")}</b>lines removed</div></div>
<p class="muted">Period: ${first} to ${last}. Committer: Muhammad Anas (team leader), ${commits.length} commits.</p>

<h3>Commits per month</h3>
<table>${Object.entries(perMonth).map(([m, n]) => `<tr><td>${m}</td><td class="n">${n}</td><td style="width:60%"><div class="bar" style="width:${(n / maxM) * 100}%"></div></td></tr>`).join("")}</table>

<h2>7. Full commit log</h2>
<div class="scroll"><table><tr><th>#</th><th>Date</th><th>Time</th><th>Hash</th><th>Message</th><th>Files</th><th>+</th><th>&minus;</th></tr>
${commits.map((c, i) => `<tr><td class="n">${i + 1}</td><td>${c.date}</td><td>${c.time}</td><td><a href="${repo}/commit/${c.hash}"><code>${c.hash}</code></a></td><td>${esc(c.subject)}</td><td class="n">${c.files}</td><td class="n">${c.add}</td><td class="n">${c.del}</td></tr>`).join("\n")}
</table></div>
<p class="muted">Re-run <code>node scripts/generate-commit-report.mjs</code> before the presentation to refresh this page.</p>
</div></body></html>`;

writeFileSync("client/public/commit-report.html", html);
console.log(`Wrote client/public/commit-report.html (${commits.length} commits, ${days.length} days)`);
