const INF = Number.MAX_SAFE_INTEGER;

function createMatrixInputs() {
    const size = parseInt(document.getElementById('matrix-size').value);
    const container = document.getElementById('matrix-container');
    container.innerHTML = '';

    if (!isNaN(size) && size > 0) {
        for (let i = 0; i < size; i++) {
            const row = document.createElement('div');
            row.className = 'matrix-row';
            for (let j = 0; j < size; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.placeholder = '0';
                row.appendChild(input);
            }
            container.appendChild(row);
        }
    }
}

function getMatrixInput() {
    const rows = document.querySelectorAll('.matrix-row');
    const matrix = [];

    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const rowData = [];
        inputs.forEach(input => {
            const value = parseInt(input.value);
            rowData.push(isNaN(value) ? INF : value);
        });
        matrix.push(rowData);
    });

    return matrix;
}

function floydWarshall(graph) {
    const dist = [];
    const n = graph.length;

    for (let i = 0; i < n; i++) {
        dist[i] = [];
        for (let j = 0; j < n; j++) {
            dist[i][j] = graph[i][j];
        }
    }

    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }

    return dist;
}

function calculateFloydWarshall() {
    const graph = getMatrixInput();
    const result = floydWarshall(graph);
    const output = document.getElementById('output');

    output.textContent = 'Distancia más corta entre todo par de nodos:\n';

    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[i].length; j++) {
            output.textContent += (result[i][j] === INF ? 'INF' : result[i][j]) + '\t';
        }
        output.textContent += '\n';
    }
}
