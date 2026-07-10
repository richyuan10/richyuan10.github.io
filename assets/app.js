const searchInput = document.querySelector("#articleSearch");
const topicButtons = [...document.querySelectorAll(".topic-button")];
const cards = [...document.querySelectorAll(".article-card")];
const resultCount = document.querySelector("#visibleCount");
const emptyState = document.querySelector("#emptyState");
let activeTopic = "全部主题";

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  for (const card of cards) {
    const matchesTopic = activeTopic === "全部主题" || card.dataset.topic === activeTopic;
    const matchesSearch = !query || card.dataset.search.includes(query);
    const matches = matchesTopic && matchesSearch;
    card.hidden = !matches;
    if (matches) visible += 1;
  }
  resultCount.textContent = visible + " / " + cards.length + " 条目";
  emptyState.hidden = visible !== 0;
}

searchInput.addEventListener("input", applyFilters);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    searchInput.value = "";
    applyFilters();
    searchInput.blur();
  }
});

for (const button of topicButtons) {
  button.addEventListener("click", () => {
    activeTopic = button.dataset.topic;
    topicButtons.forEach((item) => item.classList.toggle("active", item === button));
    applyFilters();
  });
}

const canvas = document.querySelector("#knowledgeCanvas");

if (canvas) {
  const ctx = canvas.getContext("2d");

  function drawGraph() {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const nodes = [
      { x: width * 0.08, y: height * 0.66, r: 12, label: "来源", color: "#1e5a92" },
      { x: width * 0.31, y: height * 0.28, r: 10, label: "主题", color: "#126b55" },
      { x: width * 0.57, y: height * 0.69, r: 12, label: "笔记", color: "#b65d1d" },
      { x: width * 0.88, y: height * 0.35, r: 10, label: "阅读", color: "#126b55" },
    ];

    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(18, 107, 85, 0.32)";
    for (const [from, to] of [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3]]) {
      ctx.beginPath();
      ctx.moveTo(nodes[from].x, nodes[from].y);
      ctx.lineTo(nodes[to].x, nodes[to].y);
      ctx.stroke();
    }

    for (const node of nodes) {
      ctx.beginPath();
      ctx.fillStyle = "#fbfcfa";
      ctx.arc(node.x, node.y, node.r + 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = node.color;
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 10px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y);
    }
  }

  window.addEventListener("resize", drawGraph);
  drawGraph();
}
