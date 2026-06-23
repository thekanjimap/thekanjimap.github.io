document.addEventListener("DOMContentLoaded", function() {
    const circleBox = document.getElementById("circleBox");
    const gifDuration = 4000;

    setTimeout(function() {
        circleBox.classList.add("shrink");
        
        setTimeout(function() {
            circleBox.style.display = "none";
            const searchContainer = document.getElementById("searchContainer");
            const searchBox = document.getElementById("searchBox");
            const searchInnerCircle = document.getElementById("searchInnerCircle");
            const searchInput = document.getElementById("searchInput");

            searchContainer.style.display = "block";
            
            searchBox.classList.add("step1-circle");

            setTimeout(function() {
                searchInnerCircle.classList.add("step2-spin");

                setTimeout(function() {
                    searchBox.classList.add("step3-bar");
                    searchInnerCircle.classList.add("step3-move");

                    setTimeout(function() {
                        searchInput.classList.add("step4-show");
                        
                        setTimeout(function() {
                            document.getElementById("graph-container").classList.add("show");
                            document.getElementById("appTitle").classList.add("show");
                            document.getElementById("visitCounter").classList.add("show");
                            renderKanjiGraph(sampleData);
                            setupSearchHandlers();
                        }, 300);
                    }, 600);
                }, 600);
            }, 500);

        }, 1000);
    }, gifDuration);
    
    pingTracker();
    setInterval(pingTracker, 300000);
});

function setupSearchHandlers() {
    const searchInput = document.getElementById("searchInput");
    const searchBox = document.getElementById("searchBox");
    const searchInnerCircle = document.getElementById("searchInnerCircle");
    const magnifierIcon = document.getElementById("magnifierIcon");
    const closeBtn = document.getElementById("closeBtn");

    function performSearch() {
        const keyword = searchInput.value.trim();
        if (!keyword) return;

        searchBox.classList.add("searching");
        searchBox.classList.remove("loaded");
        searchInput.blur();
        searchInnerCircle.innerHTML = '';
        const spinner = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        spinner.setAttribute("viewBox", "0 0 50 50");
        spinner.setAttribute("width", "22");
        spinner.setAttribute("height", "22");
        spinner.setAttribute("style", "overflow: visible;");
        
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "25");
        circle.setAttribute("cy", "25");
        circle.setAttribute("r", "20");
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke", "#333");
        circle.setAttribute("stroke-width", "3");
        circle.setAttribute("stroke-dasharray", "31.4, 31.4");
        circle.setAttribute("stroke-linecap", "round");
        
        spinner.appendChild(circle);
        searchInnerCircle.appendChild(spinner);

        constructNodeTree(keyword).then(searchData => {
            if (searchData && searchData.nodes.length > 0) {
                document.getElementById("graph-container").innerHTML = "";
                renderKanjiGraph(searchData, keyword);
                
                    searchBox.classList.add("loaded", "show-close");
                    searchInnerCircle.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" id="magnifierIcon">
                        <circle cx="8.5" cy="8.5" r="5"></circle>
                        <line x1="12" y1="12" x2="19" y2="19"></line>
                    </svg>`;
                    
                    document.getElementById("vocabDropContainer").style.display = "block";
                    setTimeout(() => {
                        document.getElementById("vocabBtn").classList.add("show-drop");
                    }, 100);
                    renderVocabList();
            } else {
                alert("Không tìm thấy dữ liệu cho: " + keyword);
                resetSearch();
            }
        }).catch(() => {
            resetSearch();
        });
    }

    function resetSearch() {
        const searchBox = document.getElementById("searchBox");
        const searchInnerCircle = document.getElementById("searchInnerCircle");
        const searchInput = document.getElementById("searchInput");
        
        searchBox.classList.remove("searching", "show-close", "loaded");
        searchInnerCircle.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" id="magnifierIcon">
            <circle cx="8.5" cy="8.5" r="5"></circle>
            <line x1="12" y1="12" x2="19" y2="19"></line>
        </svg>`;
        searchInput.value = "";

        document.getElementById("vocabBtn").classList.remove("show-drop", "active");
        document.getElementById("vocabList").classList.remove("step1-width", "step2-height");
        document.getElementById("vocabList").style.maxHeight = null;
        setTimeout(() => {
            document.getElementById("vocabDropContainer").style.display = "none";
        }, 400);
    }

    let searchTimeout;

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (!searchBox.classList.contains("searching")) {
                    performSearch();
                }
            }, 300);
        }
    });

    searchInnerCircle.addEventListener("click", () => {
        if (searchBox.classList.contains("loaded")) {
            searchBox.classList.remove("searching", "show-close", "loaded");
            searchInput.value = "";
            searchInput.focus();
        } else {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (!searchBox.classList.contains("searching")) {
                    performSearch();
                }
            }, 300);
        }
    });
    
        closeBtn.addEventListener("click", () => {
        resetSearch();
        document.getElementById("graph-container").innerHTML = "";
        renderKanjiGraph(sampleData);
    });

    const vocabBtn = document.getElementById("vocabBtn");
    const vocabList = document.getElementById("vocabList");

    vocabBtn.addEventListener("click", () => {
        if (vocabList.classList.contains("step1-width")) {
            vocabBtn.classList.remove("active");
            vocabList.classList.remove("step2-height");
            vocabList.style.maxHeight = null;
            setTimeout(() => {
                vocabList.classList.remove("step1-width");
            }, 200);
        } else {
            vocabBtn.classList.add("active");
            vocabList.classList.add("step1-width", "step2-height");
        }
    });
}

window.dataSourceCache = window.dataSourceCache || {};
window.wordDetailsCache = window.wordDetailsCache || {};
const DATA_ENDPOINT = atob("aHR0cHM6Ly9tYXppaS5uZXQvYXBpL3NlYXJjaA==");

async function fetchNodeData(query, excludeWords = [], allFetchedWordsSet = null) {
    let results = [];
    const endpoint = DATA_ENDPOINT;
    
    if (window.dataSourceCache[query]) {
        results = window.dataSourceCache[query];
    } else {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);
            
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dict: "javi", type: "word", query: query, limit: 40 }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            const json = await res.json();
            results = json.data || json.results || [];
            window.dataSourceCache[query] = results;
        } catch (e) {
            logErrorToServer(query, "Loi API fetchNodeData (Timeout 504)");
            return [];
        }
    }

    const wordsForGraph = [];
    for (let i = 0; i < results.length; i++) {
        let rawWord = results[i].word;
        if (!rawWord) continue;
        
        let cleanWord = rawWord.split('(')[0].split('/')[0].split('【')[0].trim();
        cleanWord = cleanWord.replace(/\s+/g, '');
        
        if (!cleanWord) continue;

        let phonetic = results[i].phonetic || results[i].reading || "";
        let mean = "";
        if (results[i].means && results[i].means.length > 0) {
            mean = results[i].means[0].mean;
        } else {
            mean = results[i].mean || "";
        }
        window.wordDetailsCache[cleanWord] = { phonetic: phonetic, mean: mean };

        if (allFetchedWordsSet) {
            allFetchedWordsSet.add(cleanWord);
        }
        
        if (wordsForGraph.length < 5 && !wordsForGraph.includes(cleanWord) && !excludeWords.includes(cleanWord)) {
            wordsForGraph.push(cleanWord);
        }
    }
    return wordsForGraph;
}

async function constructNodeTree(rootKeyword) {
    const nodes = [];
    const links = [];
    const allFetchedWordsSet = new Set();
    const globalGraphWords = new Set();
    let idCounter = 0;

    function addNode(word, level) {
        const nodeId = idCounter.toString();
        nodes.push({ id: nodeId, kanji: word, level: level });
        globalGraphWords.add(word);
        idCounter++;
        return nodeId;
    }

    const rootId = addNode(rootKeyword, 0);

    const children = await fetchNodeData(rootKeyword, [rootKeyword], allFetchedWordsSet);

    children.forEach(childWord => {
        globalGraphWords.add(childWord);
    });

    const childDataList = [];
    for (const childWord of children) {
        const childId = idCounter.toString();
        nodes.push({ id: childId, kanji: childWord, level: 1 });
        links.push({ source: rootId, target: childId });
        idCounter++;
        childDataList.push({ childWord, childId });
    }

    const grandChildrenPromises = childDataList.map(async (data) => {
        const excludeForGrandchild = Array.from(globalGraphWords);
        const grandChildren = await fetchNodeData(data.childWord, excludeForGrandchild, allFetchedWordsSet);
        return { childId: data.childId, grandChildren };
    });

    const grandChildrenResults = await Promise.all(grandChildrenPromises);

    grandChildrenResults.forEach(result => {
        result.grandChildren.forEach(grandChildWord => {
            const grandChildId = addNode(grandChildWord, 2);
            links.push({ source: result.childId, target: grandChildId });
        });
    });

    window.currentVocabList = Array.from(allFetchedWordsSet).filter(word => !globalGraphWords.has(word));

    return { nodes, links };
}
let sampleData = {
    nodes: [
        {id:"0", dbid:"10001", kanji:"大学"},
        {id:"1", dbid:"10002", kanji:"大学生"},
        {id:"2", dbid:"10003", kanji:"大学院"},
        {id:"3", dbid:"10004", kanji:"大学教授"},
        {id:"4", dbid:"10005", kanji:"男子学生"},
        {id:"5", dbid:"10006", kanji:"女子学生"},
        {id:"6", dbid:"10007", kanji:"留学生"},
        {id:"7", dbid:"10008", kanji:"大学院生"},
        {id:"8", dbid:"10009", kanji:"修士"},
        {id:"9", dbid:"10010", kanji:"博士"},
        {id:"10", dbid:"10011", kanji:"助教授"},
        {id:"11", dbid:"10012", kanji:"准教授"},
        {id:"12", dbid:"10013", kanji:"大学祭"},
        {id:"13", dbid:"10014", kanji:"学園祭"},
        {id:"14", dbid:"10015", kanji:"学園長"}
    ],
    links: [
        {source:"0", target:"1"}, {source:"0", target:"2"}, {source:"0", target:"3"}, {source:"0", target:"12"}, {source:"12", target:"14"},
        {source:"1", target:"4"}, {source:"1", target:"5"}, {source:"1", target:"6"},
        {source:"2", target:"7"}, {source:"2", target:"8"}, {source:"2", target:"9"},
        {source:"3", target:"10"}, {source:"3", target:"11"},
        {source:"12", target:"13"}
    ]
};

window.wordDetailsCache = window.wordDetailsCache || {};

const sampleTooltips = {
    "大学": { phonetic: "だいがく", mean: "Đại học" },
    "大学生": { phonetic: "だいがくせい", mean: "Sinh viên đại học" },
    "大学院": { phonetic: "だいがくいん", mean: "Cao học, viện sau đại học" },
    "大学教授": { phonetic: "だいがくきょうじゅ", mean: "Giáo sư đại học" },
    "男子学生": { phonetic: "だんしがくせい", mean: "Nam sinh viên" },
    "女子学生": { phonetic: "じょしがくせい", mean: "Nữ sinh viên" },
    "留学生": { phonetic: "りゅうがくせい", mean: "Du học sinh" },
    "大学院生": { phonetic: "だいがくいんせい", mean: "Sinh viên cao học" },
    "修士": { phonetic: "しゅうし", mean: "Thạc sĩ" },
    "博士": { phonetic: "はかせ / はくし", mean: "Tiến sĩ" },
    "助教授": { phonetic: "じょきょうじゅ", mean: "Trợ lý giáo sư, phó giáo sư (cũ)" },
    "准教授": { phonetic: "じゅんきょうじゅ", mean: "Phó giáo sư" },
    "大学祭": { phonetic: "だいがくさい", mean: "Lễ hội trường đại học" },
    "学園祭": { phonetic: "がくえんさい", mean: "Lễ hội trường học" },
    "学園長": { phonetic: "がくえんちょう", mean: "Hiệu trưởng, trưởng học viện" }
};

Object.assign(window.wordDetailsCache, sampleTooltips);

function renderKanjiGraph(data, searchKeyword = null) {
    const container = document.getElementById("graph-container");
    container.innerHTML = "";

    const width = window.innerWidth;
    const height = window.innerHeight;
    const innerWidth = width * 0.95;
    const innerHeight = height * 0.95;

    const linksData = data.links.map(d => ({ ...d }));
    const nodesData = data.nodes.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodesData)
        .force("link", d3.forceLink(linksData).id(d => d.id).distance(130))
        .force("charge", d3.forceManyBody().strength(-1100))
        .force("center", d3.forceCenter(0, 0))
        .force("x", d3.forceX().strength(0.1))
        .force("y", d3.forceY().strength(0.1))
        .force("collision", d3.forceCollide().radius(50))
        .alphaDecay(0.01);

    const svg = d3.select("#graph-container")
        .append("svg")
        .attr("width", innerWidth)
        .attr("height", innerHeight)
        .attr("viewBox", [-innerWidth / 2, -innerHeight / 2, innerWidth, innerHeight])
        .attr("style", "width: 100%; height: 100%;");

    const link = svg.append("g")
        .selectAll("line")
        .data(linksData)
        .join("line")
        .attr("class", "link");

    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll(".node")
        .data(nodesData, d => d.id)
        .join("g")
        .attr("id", d => "node" + d.id)
        .attr("class", "node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("circle")
    .attr("r", d => {
        if (d.level === 0 || d.level === 1) {
            return 12;
        }
        return 7;
    });

    node.each(function(d) {
        const t = d3.select(this).append("g").attr("transform", "translate(12,-12)");
        const textElement = t.append("text")
            .on("click", () => {
                fetchKanjiInfo(d.kanji);
            })
            .on("mousemove", (event) => {
                showTooltip(event, d.kanji);
            })
            .on("mouseleave", () => {
                hideTooltip();
            });

        for (let i = 0; i < d.kanji.length; i++) {
            const charClass = "char_" + d.kanji[i].charCodeAt(0);
            textElement.append("tspan")
                .attr("class", charClass)
                .text(d.kanji[i]);
        }
    });

    setTimeout(() => {
        document.querySelectorAll("#graph-container tspan").forEach(tspan => {
            const charClass = tspan.getAttribute("class");

            const handleMouseEnter = () => {
                document.querySelectorAll("." + charClass).forEach(el => {
                    const nodeParent = el.closest(".node");
                    if (nodeParent) nodeParent.classList.add("highlight");
                    el.classList.add("highlight_character");
                });
            };

            const handleMouseLeave = () => {
                document.querySelectorAll("." + charClass).forEach(el => {
                    const nodeParent = el.closest(".node");
                    if (nodeParent) nodeParent.classList.remove("highlight");
                    el.classList.remove("highlight_character");
                });
            };

            tspan.addEventListener("mouseenter", handleMouseEnter);
            tspan.addEventListener("mouseleave", handleMouseLeave);
        });
    }, 500);

    simulation.on("tick", () => {
        const radius = 60;
        const minX = -innerWidth / 2 + radius;
        const maxX = innerWidth / 2 - radius;
        const minY = -innerHeight / 2 + radius;
        const maxY = innerHeight / 2 - radius;

        node.attr("transform", d => {
            d.x = Math.max(minX, Math.min(maxX, d.x));
            d.y = Math.max(minY, Math.min(maxY, d.y));
            return `translate(${d.x},${d.y})`;
        });

        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    });

    setInterval(() => {
        if (simulation) {
            simulation.alphaTarget(0.1).restart();
            setTimeout(() => {
                if (simulation) simulation.alphaTarget(0);
            }, 3000);
        }
    }, 10000);

    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }
}
function fetchKanjiInfo(kanji) {
    const infoBox = document.getElementById("infoBox");
    const infoContent = document.getElementById("infoContent");
    
    window.kanjiCache = window.kanjiCache || {};

    infoBox.className = "info-box step1-circle";
    infoContent.innerHTML = `
        <div style="width:50px; height:50px; display:flex; justify-content:center; align-items:center;">
            <svg viewBox="0 0 50 50" width="22" height="22" style="animation: spinLoader 2s linear infinite;">
                <circle cx="25" cy="25" r="20" fill="none" stroke="#333" stroke-width="3" stroke-dasharray="31.4, 31.4" stroke-linecap="round"></circle>
            </svg>
        </div>`;

    setTimeout(() => {
        infoBox.classList.add("step2-width");
        
        if (window.kanjiCache[kanji]) {
            setTimeout(() => {
                window.currentKanjiData = window.kanjiCache[kanji].kanjiData;
                infoContent.innerHTML = window.kanjiCache[kanji].html;
                infoBox.classList.add("step3-height");
            }, 200);
            return;
        }

        const endpoint = DATA_ENDPOINT;
        
        const wordPromise = fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dict: "javi", type: "word", query: kanji })
        }).then(res => res.json());

        const kanjiChars = kanji.match(/[\u4e00-\u9faf]/g) || [];
        
        const kanjiPromises = kanjiChars.map(k => 
            fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dict: "javi", type: "kanji", query: k })
            }).then(res => res.json())
        );

        Promise.all([wordPromise, ...kanjiPromises])
        .then(responses => {
            const wordData = responses[0];
            const kanjiDatas = responses.slice(1);
            
            let nghiaWord = "";
            let cachDoc = "";
            const results = wordData.data || wordData.results;
            
            if (results && results.length > 0) {
                const wData = results[0];
                cachDoc = wData.phonetic || wData.reading || "Chưa có dữ liệu";
                if (wData.means && wData.means.length > 0) {
                    nghiaWord = wData.means.map(m => m.mean).join("; ");
                } else {
                    nghiaWord = wData.mean || "Chưa có dữ liệu";
                }
            } else {
                nghiaWord = "Không tìm thấy từ vựng này.";
            }

            let kanjiHtml = '';
            
            if (kanjiChars.length > 0) {
                window.currentKanjiData = kanjiChars.map((k, index) => {
                    let nghiaK = "Chưa có dữ liệu";
                    let onK = "Chưa có dữ liệu";
                    let kunK = "Chưa có dữ liệu";
                    const kData = kanjiDatas[index];

                    if (kData.results && kData.results.length > 0) {
                        const detail = kData.results[0];
                        nghiaK = detail.mean || nghiaK;
                        onK = detail.on || onK;
                        kunK = detail.kun || kunK;
                    }
                    return { char: k, nghia: nghiaK, on: onK, kun: kunK };
                });

                const tabsHtml = window.currentKanjiData.map((k, i) => 
                    `<button class="kanji-tab ${i === 0 ? 'active' : ''}" onclick="switchKanjiTab(${i})">${k.char}</button>`
                ).join(' <span style="color:#ccc;">•</span> ');

                const firstK = window.currentKanjiData[0];
                const detailHtml = `
                    <div id="kanjiDetailContent" class="kanji-detail-content">
                        <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Nghĩa:</strong> <span id="kMean">${firstK.nghia}</span></p>
                        <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Onyomi:</strong> <span id="kOn">${firstK.on}</span></p>
                        <p style="margin: 0; font-size: 14px;"><strong>Kunyomi:</strong> <span id="kKun">${firstK.kun}</span></p>
                    </div>
                `;

                kanjiHtml = `
                    <div class="kanji-tabs-container">
                        <div style="font-size: 13px; color: #888; margin-bottom: 10px; text-align: center; text-transform: uppercase; letter-spacing: 1px;">Chữ Hán cấu thành</div>
                        <div class="kanji-tabs" id="kanjiTabsContainer">
                            ${tabsHtml}
                        </div>
                        ${detailHtml}
                    </div>
                `;
            }

            const finalHtml = `
                <div style="padding: 20px; font-family: sans-serif; color: #333; position: relative;">
                    <button onclick="document.getElementById('infoBox').className='info-box'" style="position: absolute; right: 15px; top: 15px; border: none; background: none; font-size: 18px; cursor: pointer; color: #888;" title="Đóng">✕</button>
                    <button onclick="openErrorModal('${kanji}')" style="position: absolute; right: 45px; top: 16px; border: none; background: none; cursor: pointer;" title="Báo cáo lỗi">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="#888" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </button>
                    <h3 style="margin: 0 0 5px 0; font-size: 28px; color: #37474F;">${kanji}</h3>
                    <p style="margin: 0 0 15px 0; font-size: 16px; color: #D32F2F;">【 ${cachDoc} 】</p>
                    <p style="margin: 8px 0; font-size: 15px; line-height: 1.5; max-height: 80px; overflow-y: auto;"><strong>Nghĩa:</strong> ${nghiaWord}</p>
                    ${kanjiHtml}
                </div>
            `;

            window.kanjiCache[kanji] = {
                html: finalHtml,
                kanjiData: window.currentKanjiData
            };

            infoContent.innerHTML = finalHtml;
            infoBox.classList.add("step3-height");
        })
        .catch(error => {
            logErrorToServer(kanji, "Loi API fetchKanjiInfo (Bang chi tiet)");
            infoContent.innerHTML = `
                <div style="padding: 20px; font-family: sans-serif; color: #333; position: relative;">
                    <button onclick="document.getElementById('infoBox').className='info-box'" style="position: absolute; right: 15px; top: 15px; border: none; background: none; font-size: 18px; cursor: pointer; color: #888;" title="Đóng">✕</button>
                    <button onclick="openErrorModal('${kanji}')" style="position: absolute; right: 45px; top: 16px; border: none; background: none; cursor: pointer;" title="Báo cáo lỗi">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="#888" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </button>
                    <h3 style="margin: 0 0 15px 0; font-size: 28px; color: #37474F;">${kanji}</h3>
                    <p style="margin: 8px 0; font-size: 15px; color: red;">Lỗi kết nối API. Vui lòng thử lại.</p>
                </div>
            `;
            infoBox.classList.add("step3-height");
        });
    }, 300);
}

function switchKanjiTab(index) {
    const data = window.currentKanjiData[index];
    if (!data) return;

    document.getElementById('kMean').textContent = data.nghia;
    document.getElementById('kOn').textContent = data.on;
    document.getElementById('kKun').textContent = data.kun;

    const tabs = document.querySelectorAll('.kanji-tab');
    tabs.forEach((tab, i) => {
        if (i === index) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}
function renderVocabList() {
    const vocabList = document.getElementById("vocabList");
    vocabList.innerHTML = "";
    
    if (!window.currentVocabList) return;

    window.currentVocabList.forEach((word, index) => {
        const item = document.createElement("div");
        item.className = "vocab-item";
        item.textContent = word;
        item.style.animationDelay = `${index * 0.05}s`;
        item.onclick = () => {
            fetchKanjiInfo(word);
        };
        item.onmousemove = (event) => {
            showTooltip(event, word);
        };
        item.onmouseleave = () => {
            hideTooltip();
        };
        vocabList.appendChild(item);
    });
}

function showTooltip(event, word) {
    const tooltip = document.getElementById("wordTooltip");
    const details = window.wordDetailsCache[word];
    
    if (details && (details.phonetic || details.mean)) {
        let html = "";
        if (details.phonetic) {
            html += `<div style="color: #1976D2; font-weight: bold; margin-bottom: 4px;">${details.phonetic}</div>`;
        }
        if (details.mean) {
            html += `<div style="font-size: 12px; max-width: 250px; white-space: normal; color: #37474F;">${details.mean}</div>`;
        }
        tooltip.innerHTML = html;
        
        tooltip.style.left = (event.pageX + 5) + "px";
        tooltip.style.top = (event.pageY - 35) + "px";
        tooltip.classList.add("visible");

        const tooltipHeight = tooltip.offsetHeight;
        if (event.clientY - tooltipHeight - 35 < 0) {
            tooltip.style.transform = "translate(15px, 15px)";
        } else {
            tooltip.style.transform = "translate(-15%, -100%)";
        }
    }
}

function hideTooltip() {
    const tooltip = document.getElementById("wordTooltip");
    if (tooltip) {
        tooltip.classList.remove("visible");
    }
}
const TRACKING_ENDPOINT = atob("aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J3SF9qLUMxMEJPR3c0bzRsRXZfNFQyZlpNaUNBOHFiSXJ2aUhfbi1YaUZGdFJyaXVsRXRNS1d1di1rNDRiQXZFemcvZXhlYw==");

function getSessionId() {
    let id = sessionStorage.getItem("kanji_session_id");
    if (!id) {
        id = "sess_" + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem("kanji_session_id", id);
    }
    return id;
}

function pingTracker() {
    const sessionId = getSessionId();
    fetch(TRACKING_ENDPOINT + "?action=ping&id=" + sessionId)
        .then(res => res.json())
        .then(data => {
            if(data.x !== undefined && data.y !== undefined) {
                document.getElementById("visitCounter").textContent = "Lượt truy cập: " + data.x + " | " + data.y;
            }
        })
        .catch(() => {});
}
function logErrorToServer(keyword, errorType) {
    const userAgent = navigator.userAgent;
    const url = TRACKING_ENDPOINT + "?action=error&keyword=" + encodeURIComponent(keyword) + "&error_type=" + encodeURIComponent(errorType) + "&user_agent=" + encodeURIComponent(userAgent);
    
    fetch(url, { mode: 'no-cors' }).catch(() => {});
}
function openErrorModal(keyword = "") {
    document.getElementById("errorKeyword").value = keyword || "Không có từ khóa cụ thể";
    document.getElementById("errorSelect").value = "";
    document.getElementById("errorDetails").value = "";
    
    const title = document.getElementById("errorTitleText");
    title.textContent = "Báo cáo lỗi";
    title.style.color = "#D32F2F";
    title.style.opacity = "";

    const overlay = document.getElementById("errorModalOverlay");
    const box = document.getElementById("errorBox");
    const innerCircle = document.getElementById("errorInnerCircle");

    innerCircle.classList.remove("success-mode");
    innerCircle.style.backgroundColor = "#fce4e4";
    
    box.className = "error-box";
    innerCircle.className = "error-inner-circle";
    overlay.classList.add("show");

    setTimeout(() => {
        box.classList.add("step1-circle");
        
        setTimeout(() => {
            document.getElementById("errorIcon").classList.add("spin");
            
            setTimeout(() => {
                box.classList.add("step2-width");
                innerCircle.classList.add("expand");
                
                setTimeout(() => {
                    box.classList.add("step3-height");
                }, 400); 
            }, 600); 
        }, 300);
    }, 50);
}

function closeErrorModal() {
    const overlay = document.getElementById("errorModalOverlay");
    const box = document.getElementById("errorBox");
    const innerCircle = document.getElementById("errorInnerCircle");
    const title = document.getElementById("errorTitleText");

    box.classList.remove("step3-height");

    setTimeout(() => {
        title.style.opacity = "0"; 
        
        setTimeout(() => {
            box.classList.remove("step2-width");
            innerCircle.classList.remove("expand");
            document.getElementById("errorIcon").classList.remove("spin"); 

            setTimeout(() => {
                box.classList.remove("step1-circle");

                setTimeout(() => {
                    overlay.classList.remove("show");
                }, 300);
            }, 400);
        }, 150); 
    }, 400);
}

function submitError() {
    const keyword = document.getElementById("errorKeyword").value;
    const errorType = document.getElementById("errorSelect").value;
    const details = document.getElementById("errorDetails").value.trim();
    
    let finalError = "";
    if (errorType) {
        finalError = errorType;
        if (details !== "") finalError += " - Chi tiết: " + details;
    } else {
        if (details !== "") {
            finalError = "Chi tiết: " + details;
        } else {
            alert("Vui lòng chọn hoặc nhập chi tiết lỗi!");
            return;
        }
    }
    
    logErrorToServer(keyword, finalError);
    
    const box = document.getElementById("errorBox");
    const title = document.getElementById("errorTitleText");
    const innerCircle = document.getElementById("errorInnerCircle");

    box.classList.remove("step3-height"); 
    
    setTimeout(() => {
        innerCircle.classList.add("success-mode");
        innerCircle.style.backgroundColor = "#e8f5e9";
        title.textContent = "Báo cáo thành công";
        title.style.color = "#2E7D32"; 
        
        setTimeout(() => {
            title.style.opacity = "0";
            
            setTimeout(() => {
                box.classList.remove("step2-width"); 
                innerCircle.classList.remove("expand");
                
                setTimeout(() => {
                    box.classList.remove("step1-circle"); 
                    setTimeout(() => {
                        document.getElementById("errorModalOverlay").classList.remove("show");
                    }, 300);
                }, 400);
            }, 150);
        }, 1500); 
    }, 400);
}

document.addEventListener("click", function(event) {
    const infoBox = document.getElementById("infoBox");
    const vocabBtn = document.getElementById("vocabBtn");
    const vocabList = document.getElementById("vocabList");

    let isInfoOpen = false;
    let isVocabOpen = false;

    if (infoBox && infoBox.classList.contains("step1-circle")) {
        isInfoOpen = true;
    }

    if (vocabList && vocabList.classList.contains("step1-width")) {
        isVocabOpen = true;
    }

    let isClickInsideInfo = false;
    if (isInfoOpen && (infoBox.contains(event.target) || event.target.closest(".node") || event.target.closest(".vocab-item"))) {
        isClickInsideInfo = true;
    }

    let isClickInsideVocab = false;
    if ((vocabBtn && vocabBtn.contains(event.target)) || (vocabList && vocabList.contains(event.target))) {
        isClickInsideVocab = true;
    }

    if (!isClickInsideInfo && !isClickInsideVocab) {
        if (isInfoOpen && isVocabOpen) {
            infoBox.className = "info-box";
        } else if (isInfoOpen && !isVocabOpen) {
            infoBox.className = "info-box";
        } else if (!isInfoOpen && isVocabOpen) {
            vocabBtn.classList.remove("active");
            vocabList.classList.remove("step2-height");
            vocabList.style.maxHeight = null; 
            setTimeout(() => {
                vocabList.classList.remove("step1-width");
            }, 200);
        }
    }

    if (vocabBtn && vocabBtn.contains(event.target)) {
        setTimeout(() => {
            const vocabDrop = document.getElementById("vocabDropContainer");
            if (vocabBtn.classList.contains("active") && vocabDrop && vocabList) {
                const dropRect = vocabDrop.getBoundingClientRect();
                const availableHeight = window.innerHeight - (dropRect.top + 120) - 15;
                vocabList.style.maxHeight = availableHeight + "px";
            } else if (vocabList) {
                vocabList.style.maxHeight = null;
            }
        }, 50);
    }
});

const infoBoxEl = document.getElementById("infoBox");
if (infoBoxEl && window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(() => {
        const vocabDrop = document.getElementById("vocabDropContainer");
        const vocabBtn = document.getElementById("vocabBtn");
        const vocabList = document.getElementById("vocabList");
        
        if (vocabDrop) {
            if (window.innerWidth <= 768) {
                if (infoBoxEl.classList.contains("step1-circle")) {
                    const newTop = infoBoxEl.offsetTop + infoBoxEl.offsetHeight + 10;
                    vocabDrop.style.top = newTop + "px";
                } else {
                    vocabDrop.style.top = "85px";
                }
                vocabDrop.style.left = "20px";
            } else {
                vocabDrop.style.top = "85px";
                vocabDrop.style.left = "0px";
            }
        }
        if (vocabBtn && vocabBtn.classList.contains("active") && vocabList) {
            const dropRect = vocabDrop.getBoundingClientRect();
            const availableHeight = window.innerHeight - dropRect.top - 120;
            vocabList.style.maxHeight = availableHeight + "px";
        }
    });
    resizeObserver.observe(infoBoxEl);
}
