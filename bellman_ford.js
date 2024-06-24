function createEdgesInputs() {
    const numAristas = parseInt(document.getElementById('num-aristas').value);
    const container = document.getElementById('edges-container');
    container.innerHTML = '';

    if (!isNaN(numAristas) && numAristas > 0) {
        for (let i = 0; i < numAristas; i++) {
            const row = document.createElement('div');
            row.className = 'edge-row';
            row.innerHTML = `
                <input type="number" placeholder="Origen">
                <input type="number" placeholder="Destino">
                <input type="number" placeholder="Peso">
            `;
            container.appendChild(row);
        }
    }
}

function getEdgesInput() {
    const rows = document.querySelectorAll('.edge-row');
    const edges = {};

    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const u = parseInt(inputs[0].value);
        const v = parseInt(inputs[1].value);
        const weight = parseInt(inputs[2].value);

        if (!isNaN(u) && !isNaN(v) && !isNaN(weight)) {
            edges[`${u},${v}`] = weight;
        }
    });

    return edges;
}

function relax(u, v, w, d, p) {
    if (d[v] > d[u] + w[[u, v]]) {
        d[v] = d[u] + w[[u, v]];
        p[v] = u;
    }
}

function bellmanFord(w, n, s) {
    const inf = Number.MAX_SAFE_INTEGER;
    const d = Array(n).fill(inf);
    const p = Array(n).fill(null);

    d[s] = 0;

    for (let i = 0; i < n - 1; i++) {
        for (const [uv, weight] of Object.entries(w)) {
            const [u, v] = uv.split(',').map(Number);
            relax(u, v, w, d, p);
        }
    }

    for (const [uv, weight] of Object.entries(w)) {
        const [u, v] = uv.split(',').map(Number);
        if (d[v] > d[u] + w[uv]) {
            return false;
        }
    }

    const output = document.getElementById('output');
    output.textContent = 'Distancias más cortas:\n';
    for (let i = 0; i < n; i++) {
        output.textContent += `${i}: ${d[i]}\n`;
    }
    output.textContent += '\nNodos previos:\n';
    for (let i = 0; i < n; i++) {
        output.textContent += `${i}: ${p[i]}\n`;
    }
    return true;
}

function calculateBellmanFord() {
    const edges = getEdgesInput();
    const numVertices = parseInt(document.getElementById('num-vertices').value);
    bellmanFord(edges, numVertices, 0);
}
