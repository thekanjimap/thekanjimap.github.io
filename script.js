// Copyright 2026 Do Hoa Hiep All Rights Reserved.
function initHeroAndGraph() {
    const circleBox = document.getElementById("circleBox");
    if (!circleBox) return;

    if (window.hasPlayedHero) {
        circleBox.style.display = "none";
        const searchContainer = document.getElementById("searchContainer");
        const searchBox = document.getElementById("searchBox");
        const searchInnerCircle = document.getElementById("searchInnerCircle");
        const searchInput = document.getElementById("searchInput");
        
        if (searchContainer) searchContainer.style.display = "block";
        if (searchBox) searchBox.classList.add("step1-circle", "step3-bar", "loaded");
        if (searchInnerCircle) searchInnerCircle.classList.add("step2-spin", "step3-move");
        if (searchInput) searchInput.classList.add("step4-show");
        
        const graphContainer = document.getElementById("graph-container");
        const appTitle = document.getElementById("appTitle");
        const visitCounter = document.getElementById("visitCounter");
        const feedbackBox = document.getElementById("feedbackBox");
        const toolBar = document.getElementById("toolBarWrapper");
        
        if (graphContainer) graphContainer.classList.add("show");
        if (appTitle) appTitle.classList.add("show");
        if (visitCounter) visitCounter.classList.add("show");
        if (feedbackBox) feedbackBox.classList.add("show");
        if (toolBar) toolBar.classList.add("show");
        
        renderKanjiGraph(sampleData);
        setupSearchHandlers();
        
        if (!window.pingIntervalSet) {
            pingTracker();
            setInterval(pingTracker, 300000);
            window.pingIntervalSet = true;
        }
        return;
    }

    window.hasPlayedHero = true;

    const gifDuration = 4000;
    if (window.innerWidth <= 768) {
        const mobileNotice = document.createElement("div");
        mobileNotice.textContent = "Hoạt động tốt nhất trên máy tính";
        mobileNotice.style.position = "absolute";
        mobileNotice.style.bottom = "3%";
        mobileNotice.style.left = "50%";
        mobileNotice.style.transform = "translateX(-50%)";
        mobileNotice.style.color = "#888";
        mobileNotice.style.fontSize = "13px";
        mobileNotice.style.fontFamily = "sans-serif";
        mobileNotice.style.textAlign = "center";
        mobileNotice.style.width = "100%";
        circleBox.appendChild(mobileNotice);
    }

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
                            document.getElementById("feedbackBox").classList.add("show");
                            const toolBar = document.getElementById("toolBarWrapper");
                            if (toolBar) {
                                toolBar.classList.add("show");
                                if (window.innerWidth <= 768) {
                                    setTimeout(() => {
                                        toolBar.classList.add("collapsed");
                                    }, 4000);
                                }
                            }
                            
                            renderKanjiGraph(sampleData);
                            setupSearchHandlers();
                        }, 300);
                    }, 600);
                }, 600);
            }, 500);

        }, 1000);
    }, gifDuration);
    
    if (!window.pingIntervalSet) {
        pingTracker();
        setInterval(pingTracker, 300000);
        window.pingIntervalSet = true;
    }
}
document.addEventListener("DOMContentLoaded", initHeroAndGraph);

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

        if (wordsForGraph.length < 15 && !wordsForGraph.includes(cleanWord) && !excludeWords.includes(cleanWord)) {
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

    const childDataList = [];
    const maxNodes = window.innerWidth <= 768 ? 4 : 5;
    let childCount = 0;

    for (const childWord of children) {
        if (!globalGraphWords.has(childWord)) {
            globalGraphWords.add(childWord);
            const childId = idCounter.toString();
            nodes.push({ id: childId, kanji: childWord, level: 1 });
            links.push({ source: rootId, target: childId });
            idCounter++;
            childDataList.push({ childWord, childId });
            childCount++;
            if (childCount >= maxNodes) break;
        }
    }

    const grandChildrenPromises = childDataList.map(async (data) => {
        const excludeForGrandchild = Array.from(globalGraphWords);
        const grandChildren = await fetchNodeData(data.childWord, excludeForGrandchild, allFetchedWordsSet);
        return { childId: data.childId, grandChildren };
    });

    const grandChildrenResults = await Promise.all(grandChildrenPromises);

    grandChildrenResults.forEach(result => {
        let count = 0;
        const maxNodes = window.innerWidth <= 768 ? 4 : 5;
        
        for (const grandChildWord of result.grandChildren) {
            if (!globalGraphWords.has(grandChildWord)) {
                const grandChildId = addNode(grandChildWord, 2);
                links.push({ source: result.childId, target: grandChildId });
                count++;
                if (count >= maxNodes) break;
            }
        }
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

    const isMobile = window.innerWidth <= 768;

    const simulation = d3.forceSimulation(nodesData)
        .force("link", d3.forceLink(linksData).id(d => d.id).distance(isMobile ? 80 : 130))
        .force("charge", d3.forceManyBody().strength(isMobile ? -600 : -1100))
        .force("center", d3.forceCenter(0, 0))
        .force("x", d3.forceX().strength(isMobile ? 0.15 : 0.1))
        .force("y", d3.forceY().strength(isMobile ? 0.05 : 0.1))
        .force("collision", d3.forceCollide().radius(isMobile ? 35 : 50))
        .alphaDecay(0.01);

    const svg = d3.select("#graph-container")
        .append("svg")
        .attr("width", innerWidth)
        .attr("height", innerHeight)
        .attr("viewBox", [-innerWidth / 2, -innerHeight / 2, innerWidth, innerHeight])
        .attr("style", "width: 100%; height: 100%;");

    const g = svg.append("g");

    if (isMobile) {
        const zoom = d3.zoom()
            .scaleExtent([0.2, 3])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });
        svg.call(zoom);
        svg.call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(0.7));
    }

    const link = g.append("g")
        .selectAll("line")
        .data(linksData)
        .join("line")
        .attr("class", "link");

    const node = g.append("g")
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
            if (!isMobile) {
                d.x = Math.max(minX, Math.min(maxX, d.x));
                d.y = Math.max(minY, Math.min(maxY, d.y));
            }
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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const wordPromise = fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dict: "javi", type: "word", query: kanji }),
            signal: controller.signal
        }).then(res => res.json());

        const kanjiChars = kanji.match(/[\u4e00-\u9faf]/g) || [];
        const kanjiPromises = kanjiChars.map(k => 
            fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dict: "javi", type: "kanji", query: k }),
                signal: controller.signal
            }).then(res => res.json())
        );

        Promise.all([wordPromise, ...kanjiPromises])
        .then(responses => {
            clearTimeout(timeoutId);
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
                    <p style="margin: 8px 0; font-size: 15px; color: red;">Lỗi kết nối hoặc không có kanji. Vui lòng thử lại.</p>
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
const TRACKING_ENDPOINT = atob("aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J3SF9qLUMxMEJPR3c0bzRsRXZfNFQyZlpNaUNBOHFiSXJ2aUhfbi1YaUZGdFJyaXVsRXRNS1d1di1rNDRiQXZFemcvZXxlYw==");

const PAGE_SESSION_ID = "req_" + Math.random().toString(36).substr(2, 9) + Date.now();

function pingTracker() {
    let isReturning = localStorage.getItem("kanjimap_visited") ? "true" : "false";
    if (isReturning === "false") {
        localStorage.setItem("kanjimap_visited", "true");
    }
    fetch(TRACKING_ENDPOINT + "?action=ping&id=" + PAGE_SESSION_ID + "&is_returning=" + isReturning)
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
    
    fetch(url)
        .then(res => res.text())
        .then(data => console.log(data))
        .catch(error => console.error(error));
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
                const bottomMargin = window.innerWidth <= 768 ? 10 : 135;
                const availableHeight = window.innerHeight - dropRect.top - 50 - bottomMargin;
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
                    const newTop = infoBoxEl.offsetTop + infoBoxEl.offsetHeight - 20;
                    vocabDrop.style.top = newTop + "px";
                } else {
                    vocabDrop.style.top = "85px";
                }
                vocabDrop.style.left = "0px";
            } else {
                vocabDrop.style.top = "85px";
                vocabDrop.style.left = "0px";
            }
        }

        if (vocabBtn && vocabBtn.classList.contains("active") && vocabList) {
            const dropRect = vocabDrop.getBoundingClientRect();
            const bottomMargin = window.innerWidth <= 768 ? 10 : 120;
            const availableHeight = window.innerHeight - dropRect.top - 50 - bottomMargin;
            vocabList.style.maxHeight = availableHeight + "px";
        }
    });
    resizeObserver.observe(infoBoxEl);
}
function initFeedbackBox() {
    const feedbackBox = document.getElementById('feedbackBox');
    const feedbackContent = document.getElementById('feedbackContent');
    if (!feedbackBox) return;
    const feedbackCloseBtn = document.getElementById('feedbackCloseBtn');
    const feedbackSubmitBtn = document.getElementById('feedbackSubmitBtn');
    const feedbackInput = document.getElementById('feedbackInput');

    feedbackBox.addEventListener('click', function(e) {
        if (!feedbackBox.classList.contains('step2-width')) {
            feedbackBox.classList.add('step2-width');
            setTimeout(() => {
                feedbackBox.classList.add('step3-height');
                setTimeout(() => {
                    feedbackInput.focus();
                }, 300);
            }, 300);
        }
    });

    feedbackContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    function closeFeedback() {
        feedbackBox.classList.remove('step3-height');
        setTimeout(() => {
            feedbackBox.classList.remove('step2-width');
        }, 300);
    }

    feedbackCloseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeFeedback();
    });

    feedbackSubmitBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const val = feedbackInput.value.trim();
        if(val) {
            const url = TRACKING_ENDPOINT + "?action=feedback&message=" + encodeURIComponent(val);
            fetch(url).catch(() => {});

            feedbackBox.classList.add('success-mode');
            
            setTimeout(() => {
                feedbackBox.classList.remove('success-mode');
                closeFeedback();
                feedbackInput.value = '';
            }, 2000);
        }
    });
}
document.addEventListener("DOMContentLoaded", initFeedbackBox);
function initAppTitleEffect() {
    const appTitle = document.getElementById("appTitle");
    const fallingH = document.getElementById("fallingH");
    if (!appTitle) return;
    const oaHiepText = document.getElementById("oaHiepText");
    const grabHand = document.getElementById("grabHand");
    const hoahiepContainer = document.getElementById("hoahiepContainer");

    let isAnimatingH = false;

    function triggerFallEffect() {
        if (!appTitle.classList.contains("show")) return;
        if (isAnimatingH) return;
        isAnimatingH = true;

        const hRect = fallingH.getBoundingClientRect();
        const containerRect = hoahiepContainer.getBoundingClientRect();
        const targetX = containerRect.left - hRect.left - 18;
        const targetY = containerRect.top - hRect.top - 2;

        fallingH.style.transition = "transform 0.8s cubic-bezier(0.55, 0.085, 0.68, 0.53)";
        fallingH.style.transform = `translate(${targetX}px, ${targetY}px) rotate(360deg)`;

        setTimeout(() => {
            oaHiepText.classList.add("show");

            setTimeout(() => {
                const currentHRect = fallingH.getBoundingClientRect();
                const grabOffsetX = -90;
                const grabOffsetY = -230;
                const grabRotation = "rotate(25deg)";
                const dropOffsetX = -120;
                const dropOffsetY = -240;
                const dropRotation = "rotate(0deg)";

                grabHand.style.transition = "none";
                grabHand.style.transform = `translate(${window.innerWidth + 100}px, ${currentHRect.top + grabOffsetY}px) ${grabRotation}`;
                grabHand.style.opacity = "1";

                setTimeout(() => {
                    grabHand.style.transition = "transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)";
                    grabHand.style.transform = `translate(${currentHRect.left + grabOffsetX}px, ${currentHRect.top + grabOffsetY}px) ${grabRotation}`;

                    setTimeout(() => {
                        oaHiepText.classList.remove("show");
                        grabHand.style.transition = "transform 1.2s cubic-bezier(0.5, 0, 0.1, 1)";
                        fallingH.style.transition = "transform 1.2s cubic-bezier(0.5, 0, 0.1, 1)";
                        const hideX = window.innerWidth + 150;
                        const moveDelta = hideX - (currentHRect.left + grabOffsetX);
                        grabHand.style.transform = `translate(${hideX}px, ${currentHRect.top + grabOffsetY}px) ${grabRotation}`;
                        fallingH.style.transform = `translate(${targetX + moveDelta}px, ${targetY}px) rotate(0deg)`;

                        setTimeout(() => {
                            grabHand.style.transition = "none";
                            fallingH.style.transition = "none";

                            grabHand.style.transform = `translate(${hRect.left + dropOffsetX}px, -400px) ${dropRotation}`;
                            fallingH.style.transform = `translate(0px, -400px) rotate(0deg)`;

                            setTimeout(() => {
                                grabHand.style.transition = "transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)";
                                fallingH.style.transition = "transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)";

                                grabHand.style.transform = `translate(${hRect.left + dropOffsetX}px, ${hRect.top + dropOffsetY}px) ${dropRotation}`;
                                fallingH.style.transform = "translate(0px, 0px) rotate(0deg)";

                                setTimeout(() => {
                                    grabHand.style.transition = "transform 1.2s ease, opacity 0.8s ease";
                                    grabHand.style.transform = `translate(${hRect.left + dropOffsetX}px, -400px) ${dropRotation}`;
                                    grabHand.style.opacity = "0";

                                    setTimeout(() => {
                                        isAnimatingH = false;
                                    }, 1000);

                                }, 1600);

                            }, 50);

                        }, 1300);

                    }, 1400);

                }, 50);

            }, 800);

        }, 800);
    }

    appTitle.addEventListener("mouseenter", triggerFallEffect);
    appTitle.addEventListener("touchstart", triggerFallEffect, {passive: true});
}
document.addEventListener("DOMContentLoaded", initAppTitleEffect);
function initToolbarObserver() {
    const vocabList = document.getElementById("vocabList");
    const feedbackBox = document.getElementById("feedbackBox");

    if (vocabList && feedbackBox) {
        const toolBarWrapper = document.getElementById("toolBarWrapper");
        const toolBarTab = document.getElementById("toolBarTab");
        const toolBarMain = document.getElementById("toolBarMain");
        let toolBarTimer;

        function startToolBarTimer() {
            clearTimeout(toolBarTimer);
            if (window.innerWidth <= 768 && toolBarWrapper && !toolBarWrapper.classList.contains("collapsed")) {
                toolBarTimer = setTimeout(() => {
                    toolBarWrapper.classList.add("collapsed");
                }, 5000);
            }
        }

        if (toolBarTab) {
            toolBarTab.addEventListener("click", () => {
                toolBarWrapper.classList.toggle("collapsed");
                startToolBarTimer();
            });
        }

        if (toolBarMain) {
            toolBarMain.addEventListener("click", startToolBarTimer);
            toolBarMain.addEventListener("touchstart", startToolBarTimer, {passive: true});
        }

        const observer = new MutationObserver(function() {
            if (vocabList.classList.contains("step1-width")) {
                if (window.innerWidth <= 768) {
                    feedbackBox.classList.add("hide-on-mobile");
                } else {
                    if (toolBarWrapper) toolBarWrapper.classList.add("hidden-by-vocab");
                }
            } else {
                if (window.innerWidth <= 768) {
                    feedbackBox.classList.remove("hide-on-mobile");
                } else {
                    if (toolBarWrapper) toolBarWrapper.classList.remove("hidden-by-vocab");
                }
            }
        });
        observer.observe(vocabList, { attributes: true, attributeFilter: ['class'] });
    }
}
document.addEventListener("DOMContentLoaded", initToolbarObserver);

function initFlashcardTools() {
    const btnFlashcard = document.getElementById('btnFlashcard');
    const btnMindmap = document.getElementById('btnMindmap');
    const btnPrint = document.getElementById('btnPrint');
    if (btnFlashcard) {
        btnFlashcard.addEventListener('click', function() {
            const words = [];
            const added = new Set();
            
            const addW = (w) => {
                if (!added.has(w) && window.wordDetailsCache[w]) {
                    added.add(w);
                    words.push({ word: w, phonetic: window.wordDetailsCache[w].phonetic, mean: window.wordDetailsCache[w].mean });
                }
            };
            
            document.querySelectorAll('.node text').forEach(n => addW(n.textContent));
            if (window.currentVocabList) {
                window.currentVocabList.forEach(w => addW(w));
            }

            if (words.length === 0) { alert("Chưa có từ vựng nào để học!"); return; }
            initFlashcard(words);
        });
    }

    function initFlashcard(words) {
        let overlay = document.getElementById('fcOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'fcOverlay';
            overlay.className = 'flashcard-overlay';
            overlay.innerHTML = `
                <div class="fc-top-bar">
                    <button class="fc-undo-btn" id="fcUndo">↩ Học lại</button>
                    <div class="fc-progress-bar"><div class="fc-progress-fill" id="fcProgressFill"></div></div>
                    <div class="fc-counter" id="fcCounter"></div>
                </div>
                <button class="fc-close" id="fcClose">✕</button>
                <div class="flashcard-container">
                    <div class="flashcard" id="fcCard">
                        <div class="flashcard-inner" id="fcInner">
                            <div class="flashcard-front">
                                <button id="fcStartBtn" class="fc-start-btn" style="display:none;">Bắt đầu</button>
                                <button id="fcReplayBtn" class="fc-start-btn" style="display:none; bottom: 30px;">Xem lại</button>
                                <div id="fcCountdown" class="fc-countdown" style="display:none;"></div>
                                <div class="fc-kanji" id="fcKanji"></div>
                            </div>
                            <div class="flashcard-back">
                                <div class="fc-phonetic" id="fcPhonetic"></div>
                                <div class="fc-mean" id="fcMean"></div>
                            </div>
                        </div>
                    </div>
                    <div class="fc-finished" id="fcFinished">
                        <h2>Đã ôn xong!</h2>
                        <button id="fcCloseBtn">Đóng Flashcard</button>
                    </div>
                </div>
                <div class="fc-bottom-controls">
                    <div class="fc-time-selector" id="fcTimeSelector">
                        <label><input type="radio" name="fcTime" value="300"> Ngắn</label>
                        <label><input type="radio" name="fcTime" value="800" checked> Vừa</label>
                        <label><input type="radio" name="fcTime" value="1500"> Dài</label>
                    </div>
                    <button class="fc-advanced-btn" id="fcAdvancedToggle">Nâng cao</button>
                </div>
                <div class="fc-hint"><- Vuốt -> để tiếp tục<br>^ Đã thuộc &nbsp;&nbsp;|&nbsp;&nbsp; v Không muốn học</div>
            `;
            document.body.appendChild(overlay);

            document.getElementById('fcClose').onclick = closeOverlay;
            document.getElementById('fcCloseBtn').onclick = closeOverlay;
        }

        let initialTotal = words.length;
        let learnedCount = 0;
        let undoStack = [];
        let currentWord = null;
        let roundQueue = shuffleArray([...words]);
        let nextRoundQueue = [];
        
        let isAdvanced = false;
        let hasStartedAdvanced = false;
        let isCountingDown = false;
        let countdownTimer, flashTimer;

        const card = document.getElementById('fcCard');
        const innerCard = document.getElementById('fcInner');
        const finishedView = document.getElementById('fcFinished');
        const undoBtn = document.getElementById('fcUndo');
        const startBtn = document.getElementById('fcStartBtn');
        const replayBtn = document.getElementById('fcReplayBtn');
        const countdownEl = document.getElementById('fcCountdown');
        const kanjiEl = document.getElementById('fcKanji');
        const advancedToggle = document.getElementById('fcAdvancedToggle');
        const timeSelector = document.getElementById('fcTimeSelector');

        function clearAllTimers() {
            clearInterval(countdownTimer);
            clearTimeout(flashTimer);
        }

        function closeOverlay() { 
            clearAllTimers();
            if (window.fcAbortController) window.fcAbortController.abort();
            document.getElementById('fcOverlay').classList.remove('show'); 
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        advancedToggle.onclick = () => {
            isAdvanced = !isAdvanced;
            advancedToggle.classList.toggle('active');
            timeSelector.classList.toggle('show');
            hasStartedAdvanced = false;
            updateCardUI();
        };

        startBtn.onmousedown = (e) => e.stopPropagation();
        startBtn.ontouchstart = (e) => e.stopPropagation();
        startBtn.onclick = (e) => {
            e.stopPropagation();
            hasStartedAdvanced = true;
            startCountdownSequence();
        };

        replayBtn.onmousedown = (e) => e.stopPropagation();
        replayBtn.ontouchstart = (e) => e.stopPropagation();
        replayBtn.onclick = (e) => {
            e.stopPropagation();
            replayBtn.style.display = 'none';
            kanjiEl.style.opacity = '1';
            kanjiEl.style.visibility = 'visible';
            let timeVal = parseInt(document.querySelector('input[name="fcTime"]:checked').value);
            
            clearTimeout(flashTimer);
            flashTimer = setTimeout(() => {
                kanjiEl.style.opacity = '0';
                kanjiEl.style.visibility = 'hidden';
                replayBtn.style.display = 'inline-block';
            }, timeVal);
        };

        function startCountdownSequence() {
            clearAllTimers();
            isCountingDown = true;
            startBtn.style.display = 'none';
            replayBtn.style.display = 'none';
            countdownEl.style.display = 'block';
            kanjiEl.style.opacity = '0';
            kanjiEl.style.visibility = 'hidden';
            
            let count = 3;
            countdownEl.textContent = count;
            
            countdownTimer = setInterval(() => {
                count--;
                if (count > 0) {
                    countdownEl.textContent = count;
                } else {
                    clearInterval(countdownTimer);
                    countdownEl.style.display = 'none';
                    kanjiEl.style.opacity = '1';
                    kanjiEl.style.visibility = 'visible';
                    isCountingDown = false;
                    
                    let timeVal = parseInt(document.querySelector('input[name="fcTime"]:checked').value);
                    flashTimer = setTimeout(() => {
                        kanjiEl.style.opacity = '0';
                        kanjiEl.style.visibility = 'hidden';
                        replayBtn.style.display = 'inline-block';
                    }, timeVal);
                }
            }, 500);
        }

        function renderNextCard() {
            if (roundQueue.length === 0) {
                if (nextRoundQueue.length > 0) {
                    roundQueue = shuffleArray(nextRoundQueue);
                    nextRoundQueue = [];
                } else {
                    card.style.display = 'none';
                    finishedView.style.display = 'flex';
                    document.getElementById('fcCounter').style.display = 'none';
                    currentWord = null;
                    return;
                }
            }

            currentWord = roundQueue.shift();
            card.style.display = 'block';
            finishedView.style.display = 'none';
            document.getElementById('fcCounter').style.display = 'block';
            
            updateCardUI();

            card.style.transition = 'none';
            card.style.transform = 'scale(0.8)';
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s';
                card.style.transform = '';
                card.style.opacity = '1';
            }, 20);
        }

        function updateCardUI() {
            clearAllTimers();
            innerCard.classList.remove('flipped');
            kanjiEl.textContent = currentWord.word;
            document.getElementById('fcPhonetic').textContent = currentWord.phonetic || '';
            document.getElementById('fcMean').textContent = currentWord.mean || '';
            
            let totalRemaining = roundQueue.length + nextRoundQueue.length + 1;
            document.getElementById('fcCounter').textContent = `Còn lại: ${totalRemaining}`;

            if (isAdvanced) {
                kanjiEl.style.opacity = '0';
                kanjiEl.style.visibility = 'hidden';
                replayBtn.style.display = 'none';
                if (!hasStartedAdvanced) {
                    startBtn.style.display = 'inline-block';
                    countdownEl.style.display = 'none';
                    isCountingDown = true; 
                } else {
                    startBtn.style.display = 'none';
                    startCountdownSequence();
                }
            } else {
                kanjiEl.style.opacity = '1';
                kanjiEl.style.visibility = 'visible';
                startBtn.style.display = 'none';
                replayBtn.style.display = 'none';
                countdownEl.style.display = 'none';
                isCountingDown = false;
            }
        }

        function updateProgress() {
            let percent = initialTotal === 0 ? 100 : (learnedCount / initialTotal) * 100;
            document.getElementById('fcProgressFill').style.width = Math.min(percent, 100) + '%';
        }

        function triggerUndoGlow() {
            undoBtn.classList.add('active', 'glow');
            setTimeout(() => undoBtn.classList.remove('glow'), 1200);
        }

        let startX, startY, currentX, currentY, isDragging = false;
        const SWIPE_THRESHOLD = 90;

        function getPos(e) { return e.type.includes('mouse') ? {x: e.pageX, y: e.pageY} : {x: e.touches[0].pageX, y: e.touches[0].pageY}; }

        function onStart(e) {
            if (isCountingDown) return;
            if (e.cancelable) {
                e.preventDefault();
            }
            isDragging = true;
            let pos = getPos(e);
            startX = pos.x; startY = pos.y;
            currentX = startX; currentY = startY;
            card.classList.add('dragging');
        }

        function onMove(e) {
            if (!isDragging || isCountingDown) return;
            e.preventDefault();
            let pos = getPos(e);
            currentX = pos.x; currentY = pos.y;
            let deltaX = currentX - startX;
            let deltaY = currentY - startY;
            card.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${deltaX * 0.05}deg)`;
        }

        function onEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            card.classList.remove('dragging');
            
            let deltaX = currentX - startX;
            let deltaY = currentY - startY;

            if (Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) {
                card.style.transform = '';
                if (!isCountingDown) innerCard.classList.toggle('flipped');
                return;
            }

            if (deltaY < -SWIPE_THRESHOLD) { 
                animateOut(0, -window.innerHeight);
                handleSwipe('up');
            } else if (deltaY > SWIPE_THRESHOLD) { 
                animateOut(0, window.innerHeight);
                handleSwipe('down');
            } else if (Math.abs(deltaX) > SWIPE_THRESHOLD) { 
                animateOut(deltaX > 0 ? window.innerWidth : -window.innerWidth, 0);
                handleSwipe('side');
            } else { 
                card.style.transform = '';
            }
        }

        function animateOut(x, y) {
            card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            card.style.transform = `translate(${x}px, ${y}px) rotate(${x*0.05}deg)`;
            card.style.opacity = '0';
        }

        function handleSwipe(direction) {
            if (direction === 'up') {
                learnedCount++;
                undoStack.push({ word: currentWord, action: 'up' });
                triggerUndoGlow();
            } else if (direction === 'down') {
                initialTotal--;
                undoStack.push({ word: currentWord, action: 'down' });
                triggerUndoGlow();
            } else if (direction === 'side') {
                nextRoundQueue.push(currentWord);
            }
            
            updateProgress();
            setTimeout(renderNextCard, 300);
        }

        undoBtn.onclick = () => {
            if (undoStack.length === 0) return;
            const lastAction = undoStack.pop();
            
            if (lastAction.action === 'up') {
                learnedCount--;
            } else if (lastAction.action === 'down') {
                initialTotal++;
            }
            updateProgress();
            
            if (currentWord) {
                roundQueue.unshift(currentWord);
            } else {
                finishedView.style.display = 'none';
                card.style.display = 'block';
                document.getElementById('fcCounter').style.display = 'block';
            }
            
            currentWord = lastAction.word;
            updateCardUI();

            card.style.transition = 'none';
            card.style.transform = lastAction.action === 'up' ? `translate(0, -300px)` : `translate(0, 300px)`;
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s';
                card.style.transform = '';
                card.style.opacity = '1';
            }, 20);

            if (undoStack.length === 0) undoBtn.classList.remove('active');
        };

        if (window.fcAbortController) window.fcAbortController.abort();
        window.fcAbortController = new AbortController();
        const signal = window.fcAbortController.signal;

        card.addEventListener('mousedown', onStart, { signal });
        card.addEventListener('touchstart', onStart, { passive: false, signal });
        document.addEventListener('mousemove', onMove, { passive: false, signal });
        document.addEventListener('touchmove', onMove, { passive: false, signal });
        document.addEventListener('mouseup', onEnd, { signal });
        document.addEventListener('touchend', onEnd, { signal });

        updateProgress();
        renderNextCard();
        document.getElementById('fcOverlay').classList.add('show');
    }

    
    if (btnPrint) {
        btnPrint.addEventListener('click', function() {
            let tableHtml = `<table id="vocabTable" border="1" style="width:100%; border-collapse: collapse; font-family: sans-serif; text-align: left;">
                <tr style="background-color: #f0f0f0;">
                    <th style="padding: 10px; font-size: 14px;">Kanji</th>
                    <th style="padding: 10px; font-size: 13px;">Cách đọc (Furigana)</th>
                    <th style="padding: 10px; font-size: 13px;">Ý nghĩa</th>
                </tr>`;

            const addedWords = new Set();
            
            const addRow = (word) => {
                if (!addedWords.has(word) && window.wordDetailsCache[word]) {
                    addedWords.add(word);
                    const details = window.wordDetailsCache[word];
                    tableHtml += `<tr>
                        <td style="padding: 10px; font-size: 22px; font-weight: bold;">${word}</td>
                        <td style="padding: 10px; font-size: 16px; color: #1976D2;">${details.phonetic || ''}</td>
                        <td style="padding: 10px; font-size: 16px;">${details.mean || ''}</td>
                    </tr>`;
                }
            };

            const graphNodes = document.querySelectorAll('.node text');
            graphNodes.forEach(node => {
                addRow(node.textContent);
            });

            if (window.currentVocabList) {
                window.currentVocabList.forEach(word => {
                    addRow(word);
                });
            }

            tableHtml += `</table>`;

            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Xuất Danh Sách Từ Vựng</title>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
                    <style>
                        body { padding: 30px; font-family: sans-serif; color: #333; }
                        .btn-action { padding: 12px 20px; margin: 0 10px; cursor: pointer; background: #D32F2F; color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 14px; transition: background 0.2s; }
                        .btn-action:hover { background: #b71c1c; }
                        .btn-word { background: #1976D2; }
                        .btn-word:hover { background: #1565C0; }
                    </style>
                </head>
                <body>
                    <div id="controls" style="margin-bottom: 30px; text-align: center;">
                        <button class="btn-action" onclick="exportPDF()">📥 Tải file PDF</button>
                        <button class="btn-action btn-word" onclick="exportWord()">📄 Tải file Word</button>
                    </div>
                    <div id="exportContent">
                        <h2 style="text-align: center; color: #37474F; margin-bottom: 20px;">DANH SÁCH TỪ VỰNG</h2>
                        ${tableHtml}
                    </div>
                    <script>
                        function exportPDF() {
                            const element = document.getElementById('exportContent');
                            const opt = {
                                margin:       10,
                                filename:     'TuVung_KanjiMap.pdf',
                                image:        { type: 'jpeg', quality: 0.98 },
                                html2canvas:  { scale: 2 },
                                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                            };
                            html2pdf().set(opt).from(element).save();
                        }

                        function exportWord() {
                            const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Tu Vung</title></head><body>";
                            const postHtml = "</body></html>";
                            const html = preHtml + document.getElementById('exportContent').innerHTML + postHtml;
                            
                            const blob = new Blob(['\\ufeff', html], { type: 'application/msword' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            
                            link.href = url;
                            link.download = 'TuVung_KanjiMap.doc';
                            document.body.appendChild(link);
                            link.click();
                            
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                        }
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        });
    }
}
document.addEventListener("DOMContentLoaded", initFlashcardTools);
const resetScrollTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
};

function reinitPageAfterTransition() {
    if (typeof initHeroAndGraph === 'function') initHeroAndGraph();
    if (typeof initFeedbackBox === 'function') initFeedbackBox();
    if (typeof initAppTitleEffect === 'function') initAppTitleEffect();
    if (typeof initToolbarObserver === 'function') initToolbarObserver();
    if (typeof initFlashcardTools === 'function') initFlashcardTools();
}

function initSmoothPageTransitions() {
    let loaderWrapper = document.getElementById('loader-wrapper');
    if (!loaderWrapper) {
        loaderWrapper = document.createElement('div');
        loaderWrapper.id = 'loader-wrapper';
        
        loaderWrapper.innerHTML = `
            <div id="loader-hole">
                <img id="loader-gif">
            </div>
        `;
        document.body.appendChild(loaderWrapper);
    }

    document.addEventListener('click', async (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;
        
        const hrefAttr = (link.getAttribute('href') || '').trim();
        if (hrefAttr.startsWith('#') || link.target === '_blank' || !link.href.includes(window.location.origin) || link.hasAttribute('download')) {
            return;
        }
        
        e.preventDefault();
        const targetUrl = link.href;
        const depth = window.location.pathname.split('/').length - 2;
        const prefix = depth > 0 ? '../'.repeat(depth) : '';
        const gifPath = prefix + 'images/doraemon2.gif';
        document.getElementById('loader-gif').src = gifPath + '?t=' + new Date().getTime();

        const loaderWrap = document.getElementById('loader-wrapper');
        const loaderHole = document.getElementById('loader-hole');
        const loaderGif = document.getElementById('loader-gif');
        
        loaderWrap.style.display = 'block';
        gsap.set(loaderHole, { width: '200vmax', height: '200vmax' });
        gsap.set(loaderGif, { opacity: 0 });
        
        const tl = gsap.timeline();
        
        tl.to(loaderHole, {
            width: '220px',
            height: '220px',
            duration: 0.8,
            ease: 'power3.inOut'
        })
        .to(loaderGif, {
            opacity: 1,
            duration: 0.3
        }, "-=0.2")
        .add(async () => {
            try {
                const response = await fetch(targetUrl);
                if (!response.ok) throw new Error('Fetch failed');
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                                setTimeout(() => {
                    gsap.to(loaderHole, { 
                        width: '0px', 
                        height: '0px', 
                        duration: 0.5, 
                        ease: 'power2.in', 
                        onComplete: () => {
                            gsap.set(loaderGif, { opacity: 0 });
                            document.body.removeChild(loaderWrap);
                            let cleanUrl = targetUrl;
                            if (cleanUrl.endsWith('/index.html')) {
                                cleanUrl = cleanUrl.replace('/index.html', '/');
                            }
                            history.pushState({}, '', cleanUrl);
                            document.title = doc.title;
                            const newStyles = doc.head.querySelectorAll('link[rel="stylesheet"], style');
                            newStyles.forEach(style => {
                                const isExisting = Array.from(document.head.querySelectorAll('link[rel="stylesheet"], style')).some(existing => {
                                    return (style.href && existing.href === style.href) || 
                                            (style.innerHTML && existing.innerHTML === style.innerHTML);
                                });
                                if (!isExisting) document.head.appendChild(style.cloneNode(true));
                            });
                            document.body.className = doc.body.className;
                            document.body.id = doc.body.id;
                            document.body.innerHTML = doc.body.innerHTML;
                            const newHtmlLoaderWrap = document.getElementById('loader-wrapper');
                            if(newHtmlLoaderWrap) newHtmlLoaderWrap.remove();
                            const oldBarLoader = document.getElementById('loader');
                            if(oldBarLoader) oldBarLoader.remove();
                            document.body.appendChild(loaderWrap);
                            resetScrollTop();
                            reinitPageAfterTransition();
                            setTimeout(() => {
                                gsap.to(loaderHole, {
                                    width: '200vmax',
                                    height: '200vmax',
                                    duration: 1,
                                    ease: 'power3.out',
                                    onComplete: () => {
                                        loaderWrap.style.display = 'none';
                                    }
                                });
                            }, 50);
                        }
                    });
                }, 800); 
            } catch (err) {
                window.location.href = targetUrl;
            }
        });
    }, { capture: true });
    
    window.addEventListener('popstate', () => {
        window.location.reload();
    });
}

document.addEventListener("DOMContentLoaded", function() {
    initSmoothPageTransitions();
});
