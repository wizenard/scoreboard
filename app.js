const STORAGE_KEY = "basketball-scorekeeper-demo-v1";
const PLAYER_CONFIG =
  typeof window !== "undefined" && window.BASKETBALL_PLAYER_CONFIG ? window.BASKETBALL_PLAYER_CONFIG : {};
const ROSTER_VERSION = Number(PLAYER_CONFIG.version) || 1;
const MAX_HISTORY = 30;
const FOUL_LIMIT = 5;
const ACTION_FEEDBACK_MS = 420;
const TEAM_SCORE_FEEDBACK_MS = 780;
const CONFIG_PRESET_ID = "demo-roster";
const CONFIG_PRESET_NAME = "示例阵容";
const FALLBACK_TEAM_NAMES = ["队伍A", "队伍B"];
const BUILT_IN_PRESETS = buildConfigPresets(PLAYER_CONFIG.presets);
const DEFAULT_TEAM_NAMES = buildDefaultTeamNames(BUILT_IN_PRESETS[0]);
const LEGACY_DEFAULT_TEAM_NAMES = [
  ["主队", "队伍A", "队A", DEFAULT_TEAM_NAMES[0]],
  ["客队", "队伍B", "队B", DEFAULT_TEAM_NAMES[1]],
];
const ICONS = {
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
  "undo-2": '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  "rotate-ccw": '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  flag: '<path d="M4 22V4"/><path d="M4 4h12l-1 5 1 5H4"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  "clipboard-paste": '<path d="M15 2H9a2 2 0 0 0-2 2v2h10V4a2 2 0 0 0-2-2Z"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"/><path d="M8 14h8"/><path d="M12 10v8"/>',
  "file-text": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v6h6"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  "trash-2": '<path d="M3 6h18"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><path d="M19 6l-1 14c-.1 1-1 2-2 2H8c-1 0-1.9-1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  "user-plus": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/>',
  "user-minus": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11h-6"/>',
  "bookmark-plus": '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h8"/><path d="M17 3v6"/><path d="M20 6h-6"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  "arrow-left-right": '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
  "list-plus": '<path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v6"/><path d="M21 12h-6"/>',
  "folder-open": '<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6A2 2 0 0 1 18.47 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2A2 2 0 0 0 12.09 6H20a2 2 0 0 1 2 2v2"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>',
  hand: '<path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v8"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M6 14v-2a2 2 0 0 0-4 0v2c0 4.4 3.6 8 8 8h2a8 8 0 0 0 8-8v-3a2 2 0 0 0-4 0v1"/>',
  minus: '<path d="M5 12h14"/>',
  "shield-minus": '<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z"/><path d="M9 12h6"/>',
  "user-x": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m17 8 5 5"/><path d="m22 8-5 5"/>',
  circle: '<circle cx="12" cy="12" r="9"/>',
};

const $ = (selector) => document.querySelector(selector);
function normalizeConfigPlayer(player = {}) {
  const name = String(player?.name || "").trim();
  if (!name) return null;
  return {
    name,
    avatar: typeof player?.avatar === "string" ? player.avatar : "",
  };
}

function buildFallbackPreset() {
  return {
    id: CONFIG_PRESET_ID,
    name: CONFIG_PRESET_NAME,
    createdAt: new Date().toISOString(),
    teams: [
      { id: "home", name: FALLBACK_TEAM_NAMES[0], players: [] },
      { id: "away", name: FALLBACK_TEAM_NAMES[1], players: [] },
    ],
  };
}

function buildConfigPresets(presets) {
  const normalized = (Array.isArray(presets) ? presets : [])
    .map((preset, presetIndex) => {
      if (!Array.isArray(preset?.teams) || !preset.teams.length) return null;
      const teams = [0, 1].map((teamIndex) => {
        const sourceTeam = preset.teams[teamIndex] || {};
        return {
          id: teamIndex === 0 ? "home" : "away",
          name: String(sourceTeam.name || FALLBACK_TEAM_NAMES[teamIndex]).trim() || FALLBACK_TEAM_NAMES[teamIndex],
          players: (Array.isArray(sourceTeam.players) ? sourceTeam.players : [])
            .map(normalizeConfigPlayer)
            .filter(Boolean),
        };
      });
      return {
        id: String(preset.id || `${CONFIG_PRESET_ID}-${presetIndex + 1}`),
        name: String(preset.name || CONFIG_PRESET_NAME).trim() || CONFIG_PRESET_NAME,
        createdAt: preset.createdAt || new Date().toISOString(),
        teams,
      };
    })
    .filter(Boolean);
  return normalized.length ? normalized : [buildFallbackPreset()];
}

function buildDefaultTeamNames(preset) {
  return [preset?.teams?.[0]?.name || FALLBACK_TEAM_NAMES[0], preset?.teams?.[1]?.name || FALLBACK_TEAM_NAMES[1]];
}

const defaultState = () => ({
  game: {
    title: "篮球记分牌",
    date: new Date().toISOString().slice(0, 10),
    venue: "默认场地",
    phase: "赛前",
    finalized: false,
  },
  teams: teamsFromBuiltInPreset(),
  savedAt: "",
  rosterVersion: ROSTER_VERSION,
  presets: builtInPresets(),
  log: [],
  history: [],
});

let state = loadState();
let toastTimer = null;
const uiState = {
  removeTeamId: null,
  activeTeamId: "home",
  selectedPlayerIds: new Set(),
};

function normalizeDefaultTeamNames(teams) {
  return teams.map((team, index) => ({
    ...team,
    name: isDefaultTeamName(team.name, index) ? DEFAULT_TEAM_NAMES[index] : team.name,
  }));
}

function isDefaultTeamName(name, index) {
  const value = String(name || "").trim();
  return !value || value === DEFAULT_TEAM_NAMES[index] || LEGACY_DEFAULT_TEAM_NAMES[index].includes(value);
}

function clampFouls(value) {
  return Math.min(FOUL_LIMIT, Math.max(0, Number(value) || 0));
}

function normalizeTeamStats(teams = []) {
  return teams.map((team) => ({
    ...team,
    players: (team.players || []).map((player) => ({
      ...player,
      points: Math.max(0, Number(player.points) || 0),
      fouls: clampFouls(player.fouls),
    })),
  }));
}

function normalizeLoadedTeams(teams, rosterVersion = 0) {
  const normalized = normalizeTeamStats(normalizeDefaultTeamNames(teams));
  if (rosterVersion >= ROSTER_VERSION) return normalized;
  return normalized.map((team, index) => {
    if (!isDefaultTeamName(team.name, index)) return team;
    const templatePlayers = BUILT_IN_PRESETS[0]?.teams[index]?.players || [];
    const existingPlayers = Array.isArray(team.players) ? team.players : [];
    const existingByName = new Map(
      existingPlayers
        .map((player) => [String(player.name || "").trim().toLowerCase(), player])
        .filter(([name]) => Boolean(name))
    );
    if (index === 0) {
      return {
        ...team,
        name: DEFAULT_TEAM_NAMES[index],
        players: templatePlayers.map((player) => {
          const existing = existingByName.get(String(player.name || "").trim().toLowerCase());
          return {
            id: uid(),
            name: player.name,
            avatar: player.avatar || existing?.avatar || "",
            points: Math.max(0, Number(existing?.points) || 0),
            fouls: clampFouls(existing?.fouls),
          };
        }),
      };
    }
    const existingNames = new Set(existingPlayers.map((player) => String(player.name || "").trim().toLowerCase()).filter(Boolean));
    const missingPlayers = templatePlayers
      .filter((player) => !existingNames.has(String(player.name || "").trim().toLowerCase()))
      .map((player) => ({
        id: uid(),
        name: player.name,
        avatar: player.avatar || "",
        points: 0,
        fouls: 0,
      }));
    return {
      ...team,
      name: DEFAULT_TEAM_NAMES[index],
      players: [...existingPlayers, ...missingPlayers],
    };
  });
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultState();
    const parsed = JSON.parse(saved);
    const fallback = defaultState();
    const savedTeams = parsed.teams?.length === 2 ? parsed.teams : null;
    const teams = normalizeLoadedTeams(savedTeams && hasRoster(savedTeams) ? savedTeams : fallback.teams, parsed.rosterVersion || 0);
    const presets = mergePresets(parsed.presets, teams);
    return {
      ...fallback,
      ...parsed,
      game: {
        ...fallback.game,
        ...(parsed.game || {}),
        title: parsed.game?.title || "篮球记分牌",
        venue: parsed.game?.venue || "默认场地",
      },
      teams,
      savedAt: parsed.savedAt || "",
      rosterVersion: ROSTER_VERSION,
      presets,
      log: Array.isArray(parsed.log) ? parsed.log : [],
      history: Array.isArray(parsed.history) ? parsed.history.map(compactHistoryEntry) : [],
    };
  } catch {
    return defaultState();
  }
}

function saveState() {
  state.savedAt = new Date().toISOString();
  const persist = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(compactStateForStorage(state)));
  try {
    persist();
  } catch {
    state.history = state.history.slice(0, 8).map(compactHistoryEntry);
    try {
      persist();
    } catch {
      state.history = [];
      try {
        persist();
      } catch {
        // Keep scoring usable even when the browser refuses more local storage.
      }
    }
  }
}

function uid() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function compactTeamsForHistory(teams = []) {
  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    players: (team.players || []).map((player) => ({
      id: player.id,
      name: player.name,
      points: Number(player.points) || 0,
      fouls: clampFouls(player.fouls),
    })),
  }));
}

function compactSnapshot(source) {
  return {
    game: clone(source.game || {}),
    teams: compactTeamsForHistory(source.teams || []),
    savedAt: source.savedAt || "",
    rosterVersion: source.rosterVersion || ROSTER_VERSION,
  };
}

function compactHistoryEntry(entry) {
  if (!entry?.snapshot) return entry;
  return {
    label: entry.label,
    at: entry.at,
    snapshot: compactSnapshot(entry.snapshot),
  };
}

function compactStateForStorage(source) {
  return {
    ...source,
    history: (source.history || []).map(compactHistoryEntry),
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function avatarInitial(name) {
  const cleanName = String(name || "").trim();
  const chinese = cleanName.match(/[\u4e00-\u9fff]/g);
  if (chinese?.length) return chinese[chinese.length - 1];
  const letters = cleanName.match(/[A-Za-z0-9]+/g) || [];
  if (!letters.length) return "?";
  return letters
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function playerAvatarHtml(player) {
  if (player.avatar) {
    return `<img src="${escapeHtml(player.avatar)}" alt="" loading="lazy" />`;
  }
  return `<span>${escapeHtml(avatarInitial(player.name))}</span>`;
}

function encodeText(value) {
  return btoa(unescape(encodeURIComponent(value)));
}

function decodeText(value) {
  return decodeURIComponent(escape(atob(value)));
}

function getTeam(teamId) {
  return state.teams.find((team) => team.id === teamId);
}

function getPlayer(teamId, playerId) {
  return getTeam(teamId)?.players.find((player) => player.id === playerId);
}

function teamScore(team) {
  return team.players.reduce((sum, player) => sum + player.points, 0);
}

function teamFouls(team) {
  return team.players.reduce((sum, player) => sum + clampFouls(player.fouls), 0);
}

function ensureActiveTeamId() {
  if (!state.teams.some((team) => team.id === uiState.activeTeamId)) {
    uiState.activeTeamId = state.teams[0]?.id || "home";
  }
  return uiState.activeTeamId;
}

function teamsFromBuiltInPreset() {
  const preset = BUILT_IN_PRESETS[0];
  if (!preset) {
    return [
      { id: "home", name: DEFAULT_TEAM_NAMES[0], players: [] },
      { id: "away", name: DEFAULT_TEAM_NAMES[1], players: [] },
    ];
  }

  return preset.teams.map((team, index) => ({
    id: index === 0 ? "home" : "away",
    name: team.name || DEFAULT_TEAM_NAMES[index],
    players: (team.players || []).map((player) => ({
      id: uid(),
      name: player.name,
      avatar: player.avatar || "",
      points: 0,
      fouls: 0,
    })),
  }));
}

function builtInPresets() {
  return JSON.parse(JSON.stringify(BUILT_IN_PRESETS));
}

function mergePresets(savedPresets, teams) {
  const merged = [];
  const addPreset = (preset) => {
    if (!preset?.name || !Array.isArray(preset.teams)) return;
    const key = preset.id || preset.name;
    if (merged.some((item) => (item.id || item.name) === key || item.name === preset.name)) return;
    merged.push(preset);
  };

  builtInPresets().forEach(addPreset);
  (Array.isArray(savedPresets) ? savedPresets : []).forEach(addPreset);
  if (!merged.length) seedPresetFromTeams(teams).forEach(addPreset);
  return merged;
}

function hasRoster(teams = state.teams) {
  return teams.some((team) => Array.isArray(team.players) && team.players.length > 0);
}

function rosterFromTeams(teams = state.teams) {
  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    players: team.players.map((player) => ({
      name: player.name,
      avatar: player.avatar || "",
    })),
  }));
}

function avatarMapFromTeams(teams = []) {
  const lookup = new Map();
  teams.forEach((team) => {
    (team.players || []).forEach((player) => {
      const name = String(player.name || "").trim().toLowerCase();
      if (name && player.avatar && !lookup.has(name)) lookup.set(name, player.avatar);
    });
  });
  return lookup;
}

function hydrateTeamAvatars(teams, fallbackTeams = state.teams) {
  const lookup = avatarMapFromTeams([
    ...fallbackTeams,
    ...(BUILT_IN_PRESETS[0]?.teams || []),
  ]);
  return teams.map((team) => ({
    ...team,
    players: (team.players || []).map((player) => {
      if (player.avatar) return player;
      const name = String(player.name || "").trim().toLowerCase();
      return {
        ...player,
        avatar: lookup.get(name) || "",
      };
    }),
  }));
}

function seedPresetFromTeams(teams) {
  if (!hasRoster(teams)) return [];
  return [
    {
      id: uid(),
      name: "当前阵容预设",
      teams: rosterFromTeams(teams),
      createdAt: new Date().toISOString(),
    },
  ];
}

function pushHistory(label) {
  const snapshot = compactSnapshot(state);
  state.history.unshift({ label, snapshot, at: new Date().toISOString() });
  state.history = state.history.slice(0, MAX_HISTORY);
}

function addLog(text) {
  state.log.unshift({
    id: uid(),
    text,
    at: new Date().toISOString(),
  });
}

function commit(label, mutate) {
  pushHistory(label);
  mutate();
  addLog(label);
  saveState();
  render();
}

function vibrateTap(success = true) {
  if (!navigator.vibrate) return;
  navigator.vibrate(success ? 18 : [18, 24, 18]);
}

function actionSelector(action, points) {
  if (action === "score") return `[data-action="score"][data-points="${points}"]`;
  return `[data-action="${action}"]`;
}

function triggerActionFeedback(teamId, playerId, action, points) {
  const card = document.querySelector(`.player-card[data-team-id="${teamId}"][data-player-id="${playerId}"]`);
  const button = card?.querySelector(actionSelector(action, points));
  const isFoul = action.toLowerCase().includes("foul");
  const isScore = action.toLowerCase().includes("score");
  const scoreStat = isScore ? card?.querySelector(".stat-box") : null;
  const scoreNumber = scoreStat?.querySelector("strong");
  card?.classList.add("is-action-feedback", isFoul ? "is-foul-feedback" : "is-score-feedback");
  button?.classList.add("is-click-feedback");
  scoreStat?.classList.add(points < 0 || action === "scoreMinus" ? "is-personal-score-minus" : "is-personal-score-plus");
  scoreNumber?.classList.add("is-personal-score-pop");
  vibrateTap(true);
  window.setTimeout(() => {
    card?.classList.remove("is-action-feedback", "is-score-feedback", "is-foul-feedback");
    button?.classList.remove("is-click-feedback");
    scoreStat?.classList.remove("is-personal-score-plus", "is-personal-score-minus");
    scoreNumber?.classList.remove("is-personal-score-pop");
  }, ACTION_FEEDBACK_MS);
}

function triggerTeamScoreFeedback(teamId, delta) {
  const teamCard = document.querySelector(`.team-score.${teamId === "home" ? "home" : "away"}`);
  const tab = document.querySelector(`[data-team-tab="${teamId}"]`);
  const container = teamCard?.offsetParent ? teamCard : tab;
  const score = container?.querySelector(teamCard?.offsetParent ? "strong" : ".team-tab-score");
  if (!container || !score) return;
  const previousBurst = container.querySelector(".score-burst");
  previousBurst?.remove();
  const burst = document.createElement("span");
  burst.className = `score-burst ${delta < 0 ? "is-minus" : "is-plus"}`;
  burst.textContent = `${delta > 0 ? "+" : ""}${delta}`;
  container.appendChild(burst);
  container.classList.add("is-score-celebrate", delta < 0 ? "is-score-minus" : "is-score-plus");
  score.classList.add("is-score-number-pop");
  window.setTimeout(() => {
    burst.remove();
    container.classList.remove("is-score-celebrate", "is-score-plus", "is-score-minus");
    score.classList.remove("is-score-number-pop");
  }, TEAM_SCORE_FEEDBACK_MS);
}

function triggerDeniedFeedback(button, card, message) {
  showToast(message);
  card?.classList.add("is-denied-feedback");
  button?.classList.add("is-denied-feedback");
  vibrateTap(false);
  window.setTimeout(() => {
    card?.classList.remove("is-denied-feedback");
    button?.classList.remove("is-denied-feedback");
  }, ACTION_FEEDBACK_MS);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function formatTime(iso) {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(iso));
}

function formatDateTime(iso) {
  if (!iso) return "尚未保存";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(iso));
}

function formatFullDateTime(iso) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(iso));
}

function fileTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    "-",
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

function leaderText() {
  const [home, away] = state.teams;
  const homeScore = teamScore(home);
  const awayScore = teamScore(away);
  if (homeScore === awayScore) return `当前 ${homeScore}:${awayScore}，双方战平`;
  const leader = homeScore > awayScore ? home : away;
  const lead = Math.abs(homeScore - awayScore);
  return `当前 ${homeScore}:${awayScore}，${leader.name} 领先 ${lead} 分`;
}

function finalText() {
  const [home, away] = state.teams;
  const homeScore = teamScore(home);
  const awayScore = teamScore(away);
  if (!state.game.finalized) return leaderText();
  if (homeScore === awayScore) return `比赛结束：${home.name} ${homeScore}:${awayScore} ${away.name}，平局`;
  const winner = homeScore > awayScore ? home : away;
  const loser = homeScore > awayScore ? away : home;
  return `比赛结束：${winner.name} ${Math.max(homeScore, awayScore)}:${Math.min(homeScore, awayScore)} ${loser.name}，${winner.name} 获胜`;
}

function topScorer() {
  const players = state.teams.flatMap((team) =>
    team.players.map((player) => ({ ...player, teamName: team.name })),
  );
  const sorted = players.sort((a, b) => b.points - a.points);
  return sorted[0]?.points > 0 ? `${sorted[0].teamName} · ${sorted[0].name} ${sorted[0].points} 分` : "暂无";
}

function foulWarning() {
  const players = state.teams.flatMap((team) =>
    team.players
      .filter((player) => clampFouls(player.fouls) >= FOUL_LIMIT - 1)
      .map((player) => `${team.name} · ${player.name} ${clampFouls(player.fouls)} 犯`),
  );
  return players.length ? players.join("；") : "暂无";
}

function buildSummaryText() {
  const [home, away] = state.teams;
  const lines = [
    `${state.game.title}`,
    `日期：${state.game.date || "未填写"}`,
    `场地：${state.game.venue || "未填写"}`,
    `比分：${home.name} ${teamScore(home)}:${teamScore(away)} ${away.name}`,
    `结果：${finalText()}`,
    "",
    "球员统计：",
  ];

  state.teams.forEach((team) => {
    lines.push(`${team.name}：`);
    if (!team.players.length) {
      lines.push("  暂无球员");
      return;
    }
    team.players.forEach((player) => {
      lines.push(`  ${player.name}：${player.points} 分，${player.fouls} 犯规`);
    });
  });

  return lines.join("\n");
}

function buildOperationLogText() {
  const [home, away] = state.teams;
  const lines = [
    `${state.game.title}`,
    `日期：${state.game.date || "未填写"}`,
    `场地：${state.game.venue || "未填写"}`,
    `比分：${home.name} ${teamScore(home)}:${teamScore(away)} ${away.name}`,
    `操作记录：${state.log.length} 条`,
    "",
  ];

  if (!state.log.length) {
    lines.push("暂无操作记录");
    return lines.join("\n");
  }

  state.log
    .slice()
    .reverse()
    .forEach((entry, index) => {
      lines.push(`${index + 1}. ${formatFullDateTime(entry.at)}　${entry.text}`);
    });

  return lines.join("\n");
}

function showOperationLog() {
  const dialog = createRecordDialog(
    "操作记录",
    "本场操作记录会跟随记录码和比赛记录文件一起保存，也可以手动复制下面内容。",
  );
  const area = dialog.querySelector(".record-code-area");
  area.classList.add("operation-log-area");
  area.readOnly = true;
  area.value = buildOperationLogText();
  dialog.querySelector(".record-dialog-actions").innerHTML = `
    <button class="primary-btn" type="button" data-dialog-action="copy-log">复制记录</button>
    <button class="secondary-btn" type="button" data-dialog-action="close">关闭</button>
  `;
  dialog.querySelector('[data-dialog-action="copy-log"]').addEventListener("click", async () => {
    const ok = await copyText(area.value);
    showToast(ok ? "操作记录已复制" : "请长按操作记录手动复制");
  });
  showToast("操作记录已打开");
}

function renderScoreboard() {
  const [home, away] = state.teams;
  const activeTeamId = ensureActiveTeamId();
  $("#homeName").value = home.name;
  $("#awayName").value = away.name;
  $("#homeScore").textContent = teamScore(home);
  $("#awayScore").textContent = teamScore(away);
  $("#homeMeta").textContent = `${home.players.length} 名球员 · ${teamFouls(home)} 次犯规`;
  $("#awayMeta").textContent = `${away.players.length} 名球员 · ${teamFouls(away)} 次犯规`;

  $("#gameTitle").value = state.game.title;
  $("#gameDate").value = state.game.date;
  $("#gameVenue").value = state.game.venue;
  $("#finishBtn span").textContent = state.game.finalized ? "继续修改" : "结束比赛";

  const resultStrip = $("#resultStrip");
  resultStrip.textContent = finalText();
  resultStrip.classList.toggle("is-live", !state.game.finalized);
  $("#undoBtn").disabled = state.history.length === 0;

  document.querySelectorAll("[data-team-tab]").forEach((tab) => {
    const team = state.teams.find((item) => item.id === tab.dataset.teamTab);
    if (!team) return;
    tab.classList.toggle("is-active", team.id === activeTeamId);
    tab.setAttribute("aria-selected", String(team.id === activeTeamId));
    tab.querySelector(".team-tab-name").textContent = team.name;
    tab.querySelector(".team-tab-score").textContent = teamScore(team);
  });
}

function selectedPlayersForTeam(team) {
  if (uiState.removeTeamId !== team.id) return [];
  return team.players.filter((player) => uiState.selectedPlayerIds.has(player.id));
}

function playerCard(team, player) {
  const fouls = clampFouls(player.fouls);
  const fouledOut = fouls >= FOUL_LIMIT;
  const selecting = uiState.removeTeamId === team.id;
  const selected = selecting && uiState.selectedPlayerIds.has(player.id);
  return `
    <article class="player-card ${fouledOut ? "fouled-out" : ""} ${selected ? "is-selected" : ""}" data-team-id="${team.id}" data-player-id="${player.id}">
      <div class="player-main">
        <div class="player-name">
          <label class="player-select-control" title="选择删除">
            <input type="checkbox" data-player-select data-team-id="${team.id}" data-player-id="${player.id}" ${selected ? "checked" : ""} />
            <span aria-hidden="true"></span>
          </label>
          <span class="player-avatar">${playerAvatarHtml(player)}</span>
          <span class="name-text">${escapeHtml(player.name)}</span>
        </div>
        <div class="player-stats">
          <div class="stat-box">
            <span>得分</span>
            <strong>${player.points}</strong>
          </div>
          <div class="stat-box">
            <span>犯规${fouledOut ? " · 离场" : ""}</span>
            <strong>${fouls}</strong>
          </div>
        </div>
      </div>
      <div class="player-actions">
        <div class="score-actions" aria-label="${escapeHtml(player.name)} 加分">
          <button class="score-btn minus-score-btn" type="button" data-action="scoreMinus">-1</button>
          <button class="score-btn" type="button" data-action="score" data-points="1">+1</button>
          <button class="score-btn" type="button" data-action="score" data-points="2">+2</button>
          <button class="score-btn" type="button" data-action="score" data-points="3">+3</button>
        </div>
        <div class="button-row">
          <button class="foul-btn" type="button" data-action="foul">
            <i data-lucide="hand" aria-hidden="true"></i>
            <span>犯规 +1</span>
          </button>
        </div>
        <div class="correct-row" aria-label="${escapeHtml(player.name)} 更正">
          <button class="mini-btn minus" type="button" data-action="foulMinus" title="犯规减 1">
            <i data-lucide="shield-minus" aria-hidden="true"></i>
          </button>
          <button class="mini-btn" type="button" data-action="transferPlayer" title="换队">
            <i data-lucide="arrow-left-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderTeamPanel(team) {
  const panel = $(`#${team.id}Panel`);
  const activeTeamId = ensureActiveTeamId();
  const selecting = uiState.removeTeamId === team.id;
  const selectedCount = selectedPlayersForTeam(team).length;
  const removeAction = selecting && selectedCount > 0 ? "confirmRemovePlayers" : "toggleRemoveMode";
  const removeIcon = selecting && selectedCount > 0 ? "trash-2" : "user-minus";
  const removeTitle = selecting && selectedCount > 0 ? `确认删除 ${selectedCount} 名球员` : "选择要删除的球员";
  panel.classList.toggle("home-team", team.id === "home");
  panel.classList.toggle("away-team", team.id === "away");
  panel.classList.toggle("is-active-team", team.id === activeTeamId);
  panel.classList.toggle("is-selecting", selecting);
  const playersHtml = team.players.length
    ? team.players.map((player) => playerCard(team, player)).join("")
    : `<div class="empty-state">先添加参赛球员。记分员之后可以直接在球员行点击 +1、+2、+3 或犯规。</div>`;

  panel.innerHTML = `
    <div class="team-header">
      <div>
        <h2>${escapeHtml(team.name)}</h2>
        <p>得分、犯规会自动计入球队总分和最终结果。</p>
      </div>
      <div class="stat-chips">
        <span class="chip">${team.players.length} 人</span>
        <span class="chip">${teamFouls(team)} 犯规</span>
      </div>
    </div>

    <div class="player-form" data-team-id="${team.id}">
      <input type="text" placeholder="球员姓名" aria-label="${escapeHtml(team.name)} 球员姓名" data-field="name" />
      <button class="secondary-btn" type="button" data-action="addPlayer" title="添加球员">
        <i data-lucide="user-plus" aria-hidden="true"></i>
        <span>添加</span>
      </button>
      <button class="secondary-btn danger remove-player-btn ${selecting ? "is-active" : ""}" type="button" data-action="${removeAction}" title="${escapeHtml(removeTitle)}">
        <i data-lucide="${removeIcon}" aria-hidden="true"></i>
        <span>减员</span>
      </button>
    </div>

    <div class="bulk-row" data-team-id="${team.id}">
      <input class="bulk-input" type="text" placeholder="批量导入：7 张三，10 李四，王五" aria-label="${escapeHtml(team.name)} 批量导入球员" />
      <button class="secondary-btn" type="button" data-action="bulkAdd">
        <i data-lucide="list-plus" aria-hidden="true"></i>
        <span>导入</span>
      </button>
    </div>

    <div class="mobile-table-head" aria-hidden="true">
      <span>球员</span>
      <span>得分</span>
      <span>犯</span>
      <span>操作</span>
    </div>
    <div class="player-list">${playersHtml}</div>
  `;
}

function renderSummary() {
  const [home, away] = state.teams;
  const totalPlayers = home.players.length + away.players.length;
  $("#summaryList").innerHTML = `
    <div class="summary-item"><span>参赛球员</span><strong>${totalPlayers} 人</strong></div>
    <div class="summary-item"><span>总比分</span><strong>${escapeHtml(home.name)} ${teamScore(home)} : ${teamScore(away)} ${escapeHtml(away.name)}</strong></div>
    <div class="summary-item"><span>全场犯规</span><strong>${teamFouls(home) + teamFouls(away)} 次</strong></div>
    <div class="summary-item"><span>得分最高</span><strong>${escapeHtml(topScorer())}</strong></div>
    <div class="summary-item"><span>犯规提醒</span><strong>${escapeHtml(foulWarning())}</strong></div>
    <div class="summary-item"><span>本机保存</span><strong>${escapeHtml(formatDateTime(state.savedAt))}</strong></div>
  `;
}

function renderLog() {
  const log = $("#gameLog");
  if (!state.log.length) {
    log.innerHTML = `<div class="empty-state">暂无操作记录</div>`;
    return;
  }
  log.innerHTML = state.log
    .map(
      (entry) => `
        <div class="log-entry">
          <strong>${escapeHtml(entry.text)}</strong>
          <span>${formatTime(entry.at)}</span>
        </div>
      `,
    )
    .join("");
}

function renderIcons() {
  document.querySelectorAll("i[data-lucide]").forEach((icon) => {
    const name = icon.dataset.lucide;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("data-icon", name);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = ICONS[name] || ICONS.circle;
    icon.replaceWith(svg);
  });
}

function render() {
  renderScoreboard();
  state.teams.forEach(renderTeamPanel);
  renderSummary();
  renderPresets();
  renderLog();
  renderIcons();
}

function renderPresets() {
  const select = $("#presetSelect");
  if (!select) return;

  if (!state.presets.length) {
    select.innerHTML = `<option value="">暂无预设阵容</option>`;
    $("#loadPresetBtn").disabled = true;
    return;
  }

  select.innerHTML = state.presets
    .map((preset) => `<option value="${escapeHtml(preset.id)}">${escapeHtml(preset.name)}</option>`)
    .join("");
  $("#loadPresetBtn").disabled = false;
}

function updateGameField(field, value) {
  state.game[field] = value;
  saveState();
  render();
}

function updateTeamName(teamId, value) {
  const team = getTeam(teamId);
  team.name = value.trim() || (teamId === "home" ? DEFAULT_TEAM_NAMES[0] : DEFAULT_TEAM_NAMES[1]);
  saveState();
  render();
}

function addPlayer(teamId, name) {
  const cleanName = name.trim();
  if (!cleanName) {
    showToast("请先填写球员姓名");
    return;
  }

  commit(`添加球员：${getTeam(teamId).name} ${cleanName}`, () => {
    getTeam(teamId).players.push({
      id: uid(),
      name: cleanName,
      avatar: "",
      points: 0,
      fouls: 0,
    });
  });
}

function toggleRemoveMode(teamId) {
  if (uiState.removeTeamId === teamId) {
    uiState.removeTeamId = null;
    uiState.selectedPlayerIds.clear();
  } else {
    uiState.removeTeamId = teamId;
    uiState.selectedPlayerIds.clear();
  }
  render();
}

function confirmRemoveSelected(teamId) {
  const team = getTeam(teamId);
  if (!team) return;
  const selectedPlayers = selectedPlayersForTeam(team);
  if (!selectedPlayers.length) {
    showToast("请先勾选要删除的球员");
    return;
  }
  const names = selectedPlayers.map((player) => player.name).join("、");
  const ok = window.confirm(`确认从 ${team.name} 删除 ${selectedPlayers.length} 名球员？\n${names}`);
  if (!ok) return;
  const selectedIds = new Set(selectedPlayers.map((player) => player.id));
  commit(`删除球员：${team.name} ${names}`, () => {
    team.players = team.players.filter((player) => !selectedIds.has(player.id));
    uiState.removeTeamId = null;
    uiState.selectedPlayerIds.clear();
  });
}

function setPlayerSelected(teamId, playerId, selected) {
  if (uiState.removeTeamId !== teamId) {
    uiState.removeTeamId = teamId;
    uiState.selectedPlayerIds.clear();
  }
  if (selected) {
    uiState.selectedPlayerIds.add(playerId);
  } else {
    uiState.selectedPlayerIds.delete(playerId);
  }
  render();
}

function togglePlayerSelected(teamId, playerId) {
  setPlayerSelected(teamId, playerId, !uiState.selectedPlayerIds.has(playerId));
}

function switchActiveTeam(teamId) {
  if (!state.teams.some((team) => team.id === teamId)) return;
  uiState.activeTeamId = teamId;
  render();
}

function parseBulkPlayers(text) {
  return text
    .split(/[,，;；\n]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const name = item.replace(/^\d{1,4}\s+/, "").trim();
      return { name };
    })
    .filter((player) => player.name);
}

function bulkAddPlayers(teamId, text) {
  const players = parseBulkPlayers(text);
  if (!players.length) {
    showToast("请输入要导入的球员");
    return;
  }

  commit(`批量导入球员：${getTeam(teamId).name} ${players.length} 人`, () => {
    const team = getTeam(teamId);
    players.forEach((player) => {
      team.players.push({
        id: uid(),
        name: player.name,
        avatar: player.avatar || "",
        points: 0,
        fouls: 0,
      });
    });
  });
}

function handlePanelClick(event) {
  const button = event.target.closest("button[data-action]");
  const selectionCard = event.target.closest(".player-card");
  if (
    selectionCard &&
    uiState.removeTeamId === selectionCard.dataset.teamId &&
    !button &&
    !event.target.closest(".player-select-control")
  ) {
    togglePlayerSelected(selectionCard.dataset.teamId, selectionCard.dataset.playerId);
    return;
  }

  if (!button) return;

  const action = button.dataset.action;
  const card = button.closest(".player-card");
  const form = button.closest(".player-form");
  const bulk = button.closest(".bulk-row");

  if (action === "addPlayer" && form) {
    const teamId = form.dataset.teamId;
    const name = form.querySelector('[data-field="name"]').value;
    addPlayer(teamId, name);
    return;
  }

  if (action === "toggleRemoveMode" && form) {
    const teamId = form.dataset.teamId;
    toggleRemoveMode(teamId);
    return;
  }

  if (action === "confirmRemovePlayers" && form) {
    const teamId = form.dataset.teamId;
    confirmRemoveSelected(teamId);
    return;
  }

  if (action === "bulkAdd" && bulk) {
    const teamId = bulk.dataset.teamId;
    bulkAddPlayers(teamId, bulk.querySelector(".bulk-input").value);
    return;
  }

  if (!card) return;
  const teamId = card.dataset.teamId;
  const playerId = card.dataset.playerId;
  const team = getTeam(teamId);
  const player = getPlayer(teamId, playerId);
  if (!team || !player) return;

  if (action === "score") {
    const points = Number(button.dataset.points);
    commit(`${team.name} ${player.name} 得分 +${points}`, () => {
      player.points += points;
    });
    triggerActionFeedback(teamId, playerId, action, points);
    triggerTeamScoreFeedback(teamId, points);
  }

  if (action === "foul") {
    if (clampFouls(player.fouls) >= FOUL_LIMIT) return triggerDeniedFeedback(button, card, `犯规已经是 ${FOUL_LIMIT}`);
    commit(`${team.name} ${player.name} 犯规 +1`, () => {
      player.fouls = clampFouls(player.fouls + 1);
    });
    triggerActionFeedback(teamId, playerId, action);
  }

  if (action === "scoreMinus") {
    if (player.points === 0) return triggerDeniedFeedback(button, card, "得分已经是 0");
    commit(`${team.name} ${player.name} 更正得分 -1`, () => {
      player.points -= 1;
    });
    triggerActionFeedback(teamId, playerId, action);
    triggerTeamScoreFeedback(teamId, -1);
  }

  if (action === "foulMinus") {
    if (clampFouls(player.fouls) === 0) return triggerDeniedFeedback(button, card, "犯规已经是 0");
    commit(`${team.name} ${player.name} 更正犯规 -1`, () => {
      player.fouls = clampFouls(player.fouls - 1);
    });
    triggerActionFeedback(teamId, playerId, action);
  }

  if (action === "transferPlayer") {
    const targetTeam = state.teams.find((item) => item.id !== teamId);
    if (!targetTeam) return;
    commit(`${player.name} 从 ${team.name} 换到 ${targetTeam.name}`, () => {
      team.players = team.players.filter((item) => item.id !== player.id);
      targetTeam.players.push(player);
    });
  }

}

function handlePanelChange(event) {
  const checkbox = event.target.closest("input[data-player-select]");
  if (!checkbox) return;
  const teamId = checkbox.dataset.teamId;
  const playerId = checkbox.dataset.playerId;
  if (uiState.removeTeamId !== teamId) {
    setPlayerSelected(teamId, playerId, checkbox.checked);
    return;
  }
  setPlayerSelected(teamId, playerId, checkbox.checked);
}

function undoLast() {
  const previous = state.history.shift();
  if (!previous) return;
  const remainingHistory = state.history;
  const currentLog = state.log;
  const currentTeams = state.teams;
  state = {
    ...state,
    ...previous.snapshot,
    teams: hydrateTeamAvatars(previous.snapshot.teams || state.teams, currentTeams),
    history: remainingHistory,
    log: currentLog,
  };
  addLog(`撤销：${previous.label}`);
  saveState();
  render();
}

function resetGame() {
  const firstConfirm = window.confirm("准备重新开始比赛？当前比分、犯规和操作记录会清空。是否继续？");
  if (!firstConfirm) return;
  const secondConfirm = window.confirm("请再次确认：确定清空当前比赛并重新开始？");
  if (!secondConfirm) return;
  state = defaultState();
  uiState.activeTeamId = "home";
  uiState.removeTeamId = null;
  uiState.selectedPlayerIds.clear();
  saveState();
  render();
  showToast("已重开比赛");
}

function manualSave() {
  saveState();
  render();
  showToast("已保存到这台手机/浏览器");
}

function saveRosterPreset() {
  if (!hasRoster()) {
    showToast("请先添加球员再保存预设");
    return;
  }

  const input = $("#presetNameInput");
  const name = input.value.trim() || `${state.game.title || "篮球记分牌"}阵容`;
  const existing = state.presets.find((preset) => preset.name === name);
  const preset = {
    id: existing?.id || uid(),
    name,
    teams: rosterFromTeams(),
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  pushHistory(`保存预设阵容：${name}`);
  if (existing) {
    state.presets = state.presets.map((item) => (item.id === existing.id ? preset : item));
  } else {
    state.presets.unshift(preset);
  }
  state.presets = state.presets.slice(0, 12);
  addLog(`保存预设阵容：${name}`);
  input.value = "";
  saveState();
  render();
  showToast("当前阵容已保存为预设");
}

function loadRosterPreset() {
  const presetId = $("#presetSelect").value;
  const preset = state.presets.find((item) => item.id === presetId);
  if (!preset) {
    showToast("请先选择预设阵容");
    return;
  }

  const ok = window.confirm(`加载预设阵容“${preset.name}”？当前两队球员和比分会被替换。`);
  if (!ok) return;

  commit(`加载预设阵容：${preset.name}`, () => {
    state.teams = normalizeLoadedTeams(preset.teams.map((team, index) => ({
      id: index === 0 ? "home" : "away",
      name: team.name || DEFAULT_TEAM_NAMES[index],
      players: (team.players || []).map((player) => ({
        id: uid(),
        name: player.name,
        avatar: player.avatar || "",
        points: 0,
        fouls: 0,
      })),
    })), preset.id === CONFIG_PRESET_ID ? 0 : ROSTER_VERSION);
    state.rosterVersion = ROSTER_VERSION;
    state.game.finalized = false;
  });
}

function toggleFinal() {
  if (!state.game.finalized) {
    const [home, away] = state.teams;
    const scoreLine = `${home.name} ${teamScore(home)}:${teamScore(away)} ${away.name}`;
    const firstConfirm = window.confirm(`准备结束比赛并生成最终结果：\n${scoreLine}\n\n是否继续？`);
    if (!firstConfirm) return;
    const secondConfirm = window.confirm("请再次确认：比赛结束后将标记为最终结果。确定结束比赛？");
    if (!secondConfirm) return;
  }

  commit(state.game.finalized ? "继续修改比赛" : "结束比赛并生成结果", () => {
    state.game.finalized = !state.game.finalized;
  });
}

async function copySummary() {
  const text = buildSummaryText();
  try {
    await navigator.clipboard.writeText(text);
    showToast("比赛结果已复制");
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    showToast("比赛结果已复制");
  }
}

function exportCsv() {
  const rows = [["球队", "姓名", "得分", "犯规"]];
  state.teams.forEach((team) => {
    team.players.forEach((player) => {
      rows.push([team.name, player.name, player.points, player.fouls]);
    });
  });

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.game.title || "篮球赛"}-${fileTimestamp()}-球员统计.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function backupJson() {
  saveState();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.game.title || "篮球记分牌"}-${fileTimestamp()}-比赛记录.json`;
  link.click();
  URL.revokeObjectURL(url);
  render();
  showToast("比赛记录已保存为本地文件");
}

function copyTextFallback(text) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "-1000px";
  area.style.left = "0";
  document.body.appendChild(area);
  area.focus();
  area.select();
  area.setSelectionRange(0, area.value.length);
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  area.remove();
  return copied;
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to a selected textarea for iOS/Android browsers.
  }
  return copyTextFallback(text);
}

function closeRecordDialog() {
  document.querySelector(".record-dialog-backdrop")?.remove();
}

function createRecordDialog(title, bodyText) {
  closeRecordDialog();
  const backdrop = document.createElement("div");
  backdrop.className = "record-dialog-backdrop";
  backdrop.innerHTML = `
    <section class="record-dialog" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
      <div class="record-dialog-head">
        <h2>${escapeHtml(title)}</h2>
        <button class="icon-btn" type="button" data-dialog-action="close" title="关闭">×</button>
      </div>
      <p>${escapeHtml(bodyText)}</p>
      <textarea class="record-code-area" spellcheck="false"></textarea>
      <div class="record-dialog-actions"></div>
    </section>
  `;
  document.body.appendChild(backdrop);
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop || event.target.closest('[data-dialog-action="close"]')) {
      closeRecordDialog();
    }
  });
  return backdrop;
}

async function copyRecordCode() {
  saveState();
  const code = encodeText(JSON.stringify(state));
  const copied = await copyText(code);
  const dialog = createRecordDialog(
    "导出比赛记录",
    copied ? "记录码已复制。也可以手动复制下面这段文字保存。" : "请手动复制下面这段记录码保存。",
  );
  const area = dialog.querySelector(".record-code-area");
  area.value = code;
  area.readOnly = true;
  dialog.querySelector(".record-dialog-actions").innerHTML = `
    <button class="primary-btn" type="button" data-dialog-action="copy">复制记录码</button>
    <button class="secondary-btn" type="button" data-dialog-action="close">关闭</button>
  `;
  dialog.querySelector('[data-dialog-action="copy"]').addEventListener("click", async () => {
    const ok = await copyText(area.value);
    showToast(ok ? "记录码已复制" : "请长按记录码手动复制");
    area.focus();
    area.select();
  });
  area.focus();
  area.select();
  showToast(copied ? "记录码已复制" : "记录码已生成");
}

function applyRecordCode(code) {
  if (!code.trim()) {
    showToast("请先粘贴比赛记录码");
    return;
  }
  try {
    const parsed = JSON.parse(decodeText(code.trim()));
    if (!Array.isArray(parsed.teams) || parsed.teams.length !== 2) {
      throw new Error("Invalid record code");
    }
    const restored = normalizeRestoredState(parsed);
    const ok = window.confirm("导入这个比赛记录码？当前页面数据会被覆盖。");
    if (!ok) return;
    state = restored;
    saveState();
    render();
    closeRecordDialog();
    showToast("比赛记录码已导入");
  } catch {
    showToast("比赛记录码无法读取");
  }
}

function importRecordCode() {
  const dialog = createRecordDialog("导入比赛记录", "粘贴之前导出的比赛记录码，然后点击导入。");
  const area = dialog.querySelector(".record-code-area");
  area.placeholder = "在这里粘贴比赛记录码";
  dialog.querySelector(".record-dialog-actions").innerHTML = `
    <button class="primary-btn" type="button" data-dialog-action="import">导入记录</button>
    <button class="secondary-btn" type="button" data-dialog-action="close">取消</button>
  `;
  dialog.querySelector('[data-dialog-action="import"]').addEventListener("click", () => applyRecordCode(area.value));
  area.focus();
}

function normalizeRestoredState(parsed) {
  const fallback = defaultState();
  const teams = normalizeLoadedTeams(
    Array.isArray(parsed.teams) && parsed.teams.length === 2 ? parsed.teams : fallback.teams,
    parsed.rosterVersion || 0,
  );
  return {
    ...fallback,
    ...parsed,
    game: { ...fallback.game, ...(parsed.game || {}), venue: parsed.game?.venue || "默认场地" },
    teams,
    rosterVersion: ROSTER_VERSION,
    presets: mergePresets(parsed.presets, teams),
    log: Array.isArray(parsed.log) ? parsed.log : [],
    history: [],
  };
}

function restoreJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      if (!Array.isArray(parsed.teams) || parsed.teams.length !== 2) {
        throw new Error("Invalid record file");
      }
      const restored = normalizeRestoredState(parsed);
      const ok = window.confirm("打开这个比赛记录？当前页面数据会被覆盖。");
      if (!ok) return;
      state = restored;
      saveState();
      render();
      showToast("比赛记录已打开");
    } catch {
      showToast("比赛记录文件无法读取");
    } finally {
      $("#restoreInput").value = "";
    }
  };
  reader.readAsText(file);
}

function clearLog() {
  const ok = window.confirm("清空操作记录？比分和球员统计不会改变。");
  if (!ok) return;
  pushHistory("清空操作记录");
  state.log = [];
  saveState();
  render();
}

function bindEvents() {
  $("#homeName").addEventListener("change", (event) => updateTeamName("home", event.target.value));
  $("#awayName").addEventListener("change", (event) => updateTeamName("away", event.target.value));
  $("#gameTitle").addEventListener("change", (event) => updateGameField("title", event.target.value.trim() || "篮球记分牌"));
  $("#gameDate").addEventListener("change", (event) => updateGameField("date", event.target.value));
  $("#gameVenue").addEventListener("change", (event) => updateGameField("venue", event.target.value.trim()));

  $("#homePanel").addEventListener("click", handlePanelClick);
  $("#awayPanel").addEventListener("click", handlePanelClick);
  $("#homePanel").addEventListener("change", handlePanelChange);
  $("#awayPanel").addEventListener("change", handlePanelChange);
  $("#saveBtn").addEventListener("click", copyRecordCode);
  $("#topRestoreBtn").addEventListener("click", importRecordCode);
  $("#logBtn").addEventListener("click", showOperationLog);
  $("#undoBtn").addEventListener("click", undoLast);
  $("#resetBtn").addEventListener("click", resetGame);
  $("#finishBtn").addEventListener("click", toggleFinal);
  $("#teamTabs").addEventListener("click", (event) => {
    const tab = event.target.closest("[data-team-tab]");
    if (!tab) return;
    switchActiveTeam(tab.dataset.teamTab);
  });
  $("#copySummaryBtn").addEventListener("click", copySummary);
  $("#exportCsvBtn").addEventListener("click", exportCsv);
  $("#savePresetBtn").addEventListener("click", saveRosterPreset);
  $("#loadPresetBtn").addEventListener("click", loadRosterPreset);
  $("#copyRecordCodeBtn").addEventListener("click", copyRecordCode);
  $("#importRecordCodeBtn").addEventListener("click", importRecordCode);
  $("#backupBtn").addEventListener("click", backupJson);
  $("#restoreBtn").addEventListener("click", () => $("#restoreInput").click());
  $("#restoreInput").addEventListener("change", (event) => restoreJson(event.target.files?.[0]));
  $("#clearLogBtn").addEventListener("click", clearLog);
}

bindEvents();
render();

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveState();
});

window.addEventListener("pagehide", saveState);

if (navigator.storage?.persist) {
  navigator.storage.persist().catch(() => {});
}

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("./service-worker.js").catch(() => {});
}

