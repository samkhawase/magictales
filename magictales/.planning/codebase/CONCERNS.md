# Codebase Concerns

**Analysis Date:** 2026-06-27

## Tech Debt

**Single-file agent will not scale indefinitely:**
- Issue: `src/agent.py` contains assistant instructions, model configuration, session setup, logging context, optional examples, and CLI registration.
- Why: This is a starter project optimized for a simple agent.
- Impact: Adding tools, handoffs, tasks, domain prompts, or model switching directly in this file can make voice latency and behavior harder to reason about.
- Fix approach: Keep `src/agent.py` as the entrypoint, but extract tools, workflow-specific agents, and prompt fragments into focused modules under `src/` as complexity grows.

**Template workflow still present:**
- Issue: `.github/workflows/template-check.yml` is designed for the upstream starter template and checks that `uv.lock` and `livekit.toml` are not tracked.
- Why: The README says cloned projects should delete this template-only check.
- Impact: Because this project currently tracks `uv.lock` and `livekit.toml`, CI can fail until the template check is removed or adjusted.
- Fix approach: Remove `.github/workflows/template-check.yml` or update it to match this project’s desired tracking policy.

**Version tagging workflow expects exact dependency pins:**
- Issue: `.github/workflows/tag-version.yml` extracts only `livekit-agents==...`, but `pyproject.toml` uses `livekit-agents>=1.6.1`.
- Why: The workflow is inherited from a template that may pin exact SDK versions.
- Impact: The tag workflow will skip current dependency changes and may give a false sense that SDK version tags are automated.
- Fix approach: Either pin `livekit-agents` exactly if tag automation matters, or remove/update the workflow.

## Known Bugs

**No application bugs confirmed from static scan:**
- Symptoms: Not applicable.
- Trigger: Not applicable.
- Workaround: Not applicable.
- Root cause: No failing behavior observed during mapping.

## Security Considerations

**Credential handling relies on environment discipline:**
- Risk: LiveKit credentials are required for local, CI, and production use.
- Current mitigation: `.env.local` is ignored by `.gitignore`; `.env.example` contains empty placeholders; tests read CI secrets.
- Recommendations: Keep real values out of `README.md`, `.planning/`, and committed config. Review generated docs before commit when adding integrations.

**Voice assistant has prompt-level safety but no tool boundaries yet:**
- Risk: Future tools can introduce data access, external actions, or privacy-sensitive behavior.
- Current mitigation: Assistant instructions include safe-use, privacy, and professional-advice guardrails; tests cover harmful-request refusal and unknown personal data.
- Recommendations: For every new tool, write tests for authorization, bad inputs, external failures, and user-facing summaries before implementation.

**LiveKit API signatures must be verified before changes:**
- Risk: LiveKit Agents evolves quickly, and stale API assumptions can break runtime behavior.
- Current mitigation: `AGENTS.md` and the LiveKit project skill require current docs verification.
- Recommendations: Use LiveKit docs MCP or `lk docs` before modifying SDK usage, handoffs, tasks, model configuration, deployment config, or testing helpers.

## Performance Bottlenecks

**Long monolithic instructions can increase voice latency:**
- Problem: `Assistant` currently embeds a substantial instruction prompt in `src/agent.py`.
- Measurement: No latency measurements captured.
- Cause: Larger prompts and broad instructions increase LLM context size for a realtime voice interface.
- Improvement path: Keep future instructions short and task-specific. Use handoffs/tasks for complex flows rather than accumulating all behavior in the base assistant.

**Model choices are high-capability and may affect cost/latency:**
- Problem: The assistant uses `openai/gpt-5.2-chat-latest`; tests use `openai/gpt-4.1-mini` as judge.
- Measurement: No runtime cost or latency data captured.
- Cause: LiveKit Inference model choice directly affects response timing and cost.
- Improvement path: Measure production latency and evaluate smaller/faster models for simple phases or task-specific agents.

## Fragile Areas

**`src/agent.py` import-time dotenv loading:**
- Why fragile: `load_dotenv(".env.local")` runs at module import, including during tests.
- Common failures: Tests or import-only tools can pick up local env unexpectedly; missing credentials are not obvious until inference or LiveKit calls happen.
- Safe modification: Keep env loading simple, but document required env vars and avoid reading `.env.local` contents in tooling.
- Test coverage: Tests exercise import and assistant startup, but not missing/invalid credential behavior.

**Deployment entrypoint coupling:**
- Why fragile: `Dockerfile` assumes `src/agent.py start`, and `AGENTS.md` requires retaining `agent.py` as the entrypoint.
- Common failures: Moving or renaming `src/agent.py` without updating Docker and docs breaks deployment.
- Safe modification: Preserve `src/agent.py` as a thin entrypoint even if implementation moves to other modules.
- Test coverage: CI tests import `Assistant` but do not validate Docker startup.

**Behavior tests depend on live inference:**
- Why fragile: Tests use LiveKit Inference judge/model calls, requiring credentials and network/service availability.
- Common failures: Missing CI secrets, provider outage, model behavior drift, or account limits can fail tests.
- Safe modification: Keep high-value behavior evals, and add deterministic unit tests for pure helpers or tools where possible.
- Test coverage: Good starter behavior coverage, but no deterministic tests yet.

## Scaling Limits

**No persistent data layer:**
- Current capacity: Suitable for stateless voice assistant behavior.
- Limit: Cannot store user profiles, history, preferences, or workflow state outside LiveKit session context.
- Symptoms at limit: Repeated questions, no personalization, inability to resume workflows.
- Scaling path: Add an explicit storage integration and tests when persistent memory becomes a requirement.

**No workflow decomposition:**
- Current capacity: Suitable for a general assistant with no active tools.
- Limit: Complex multi-phase conversations can bloat prompts and tool lists.
- Symptoms at limit: Slower responses, worse tool selection, less reliable phase transitions.
- Scaling path: Introduce LiveKit handoffs/tasks around natural conversation boundaries.

## Dependencies at Risk

**LiveKit Agents version range:**
- Risk: `livekit-agents>=1.6.1` permits future compatible versions, but fast-moving SDKs can still change behavior.
- Impact: API or model behavior shifts can affect runtime and tests after dependency updates.
- Migration plan: Keep `uv.lock` committed, review changelogs/docs before `uv lock --upgrade`, and run tests after upgrades.

**Python version mismatch across local and CI:**
- Risk: CI lint uses Python 3.12 in `.github/workflows/ruff.yml`; CI tests and Docker use Python 3.14; project allows 3.10 through 3.14.
- Impact: Version-specific behavior or dependency resolution issues may appear in one environment but not another.
- Migration plan: Standardize CI lint/test Python versions if version-specific issues emerge.

## Missing Critical Features

**No project-specific Magic Tales behavior yet:**
- Problem: The current assistant is a generic starter voice assistant despite the LiveKit agent name `magictales`.
- Current workaround: Generic helpful assistant instructions.
- Blocks: Product-specific roadmap, requirements, and behavior verification.
- Implementation complexity: Medium; requires project definition, tailored instructions/workflows, and tests.

**No active tools:**
- Problem: The code contains only a commented weather-tool example.
- Current workaround: The assistant answers with model knowledge and guidance only.
- Blocks: Any task requiring external actions, retrieval, account data, content generation pipelines, or persistence.
- Implementation complexity: Depends on the first real tool; must begin with tests.

## Test Coverage Gaps

**Session startup with voice pipeline:**
- What's not tested: `my_agent`, `AgentSession` STT/TTS/turn detector setup, room options, and `ctx.connect()`.
- Risk: Runtime-only failures in LiveKit Cloud may not be caught by text-only evals.
- Priority: Medium.
- Difficulty to test: Requires mocking `JobContext` or higher-level integration tests.

**Tool behavior:**
- What's not tested: Not applicable yet because no tools exist.
- Risk: Future tools can silently call wrong actions without tests.
- Priority: High once tools are added.
- Difficulty to test: Moderate; LiveKit testing helpers support tool call assertions and mocks.

**Deployment image:**
- What's not tested: Docker build and `uv run src/agent.py start` container startup.
- Risk: Docker-only dependency, build-cache, or entrypoint issues.
- Priority: Medium before production deployment changes.
- Difficulty to test: Moderate; add a Docker build workflow or local release check.

---

*Concerns audit: 2026-06-27*
*Update as issues are fixed or new risks are discovered*
