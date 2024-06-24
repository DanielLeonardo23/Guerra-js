function showKnapsackForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Algoritmo de la mochila</h2>
        <label for="weights">Pesos (separados por comas):</label>
        <input type="text" id="weights" placeholder="Ejemplo: 1,2,3">
        <label for="values">Valores (separados por comas):</label>
        <input type="text" id="values" placeholder="Ejemplo: 10,20,30">
        <label for="capacity">Capacidad:</label>
        <input type="number" id="capacity" placeholder="Ejemplo: 50">
        <button onclick="solveKnapsack()">Calcular</button>
    `;
}

function showCoinChangeForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Algoritmo de la moneda</h2>
        <label for="coins">Monedas (separadas por comas):</label>
        <input type="text" id="coins" placeholder="Ejemplo: 1,2,5">
        <label for="amount">Cantidad:</label>
        <input type="number" id="amount" placeholder="Ejemplo: 11">
        <button onclick="solveCoinChange()">Calcular</button>
    `;
}

function showBellmanFordForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Algoritmo de Bellman-Ford</h2>
        <label for="edges">Aristas (formato: origen,destino,peso por línea):</label>
        <textarea id="edges" placeholder="Ejemplo:\n0,1,5\n1,2,3"></textarea>
        <label for="vertices">Número de vértices:</label>
        <input type="number" id="vertices" placeholder="Ejemplo: 3">
        <label for="source">Vértice de inicio:</label>
        <input type="number" id="source" placeholder="Ejemplo: 0">
        <button onclick="solveBellmanFord()">Calcular</button>
    `;
}

function showFloydWarshallForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Algoritmo de Floyd-Warshall</h2>
        <label for="matrix">Matriz de adyacencia (filas separadas por punto y coma y columnas por comas):</label>
        <textarea id="matrix" placeholder="Ejemplo:\n0,1,Infinity;Infinity,0,1;1,Infinity,0"></textarea>
        <button onclick="solveFloydWarshall()">Calcular</button>
    `;
}

function solveKnapsack() {
    const weights = document.getElementById('weights').value.split(',').map(Number);
    const values = document.getElementById('values').value.split(',').map(Number);
    const capacity = parseInt(document.getElementById('capacity').value);
    const n = values.length;

    const K = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

    for (let i = 0; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            if (i === 0 || w === 0) {
                K[i][w] = 0;
            } else if (weights[i - 1] <= w) {
                K[i][w] = Math.max(values[i - 1] + K[i - 1][w - weights[i - 1]], K[i - 1][w]);
            } else {
                K[i][w] = K[i - 1][w];
            }
        }
    }

    document.getElementById('result').innerText = `Valor máximo: ${K[n][capacity]}`;
}

function solveCoinChange() {
    const coins = document.getElementById('coins').value.split(',').map(Number);
    const amount = parseInt(document.getElementById('amount').value);
    const dp = Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    for (let coin of coins) {
        for (let i = coin; i <= amount; i++) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }

    const result = dp[amount] === Infinity ? "No es posible" : `Monedas necesarias: ${dp[amount]}`;
    document.getElementById('result').innerText = result;
}

function solveBellmanFord() {
    const edgesInput = document.getElementById('edges').value.trim().split('\n');
    const edges = edgesInput.map(line => line.split(',').map(Number));
    const vertices = parseInt(document.getElementById('vertices').value);
    const source = parseInt(document.getElementById('source').value);

    const inf = Infinity;
    const d = Array(vertices).fill(inf);
    const p = Array(vertices).fill(null);

    d[source] = 0;

    function relax(u, v, w) {
        if (d[v] > d[u] + w) {
            d[v] = d[u] + w;
            p[v] = u;
        }
    }

    for (let i = 1; i < vertices; i++) {
        for (const [u, v, w] of edges) {
            relax(u, v, w);
        }
    }

    for (const [u, v, w] of edges) {
        if (d[v] > d[u] + w) {
            document.getElementById('result').innerText = "Hay un ciclo negativo.";
            return;
        }
    }

    let resultText = "Distancias más cortas\n";
    for (let i = 0; i < vertices; i++) {
        resultText += `${i}: ${d[i]}\n`;
    }

    resultText += "\nNodos previos\n";
    for (let i = 0; i < vertices; i++) {
        resultText += `${i}: ${p[i]}\n`;
    }

    document.getElementById('result').innerText = resultText;
}

function solveFloydWarshall() {
    const matrixInput = document.getElementById('matrix').value.trim().split(';');
    const matrix = matrixInput.map(row => row.split(',').map(Number));
    const n = matrix.length;
    const dist = Array.from({ length: n }, (_, i) => 
        Array.from({ length: n }, (_, j) => (i === j ? 0 : matrix[i][j] || Infinity))
    );

    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
            }
        }
    }

    let resultText = "Distancia más corta entre todo par de nodos:\n";
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            resultText += dist[i][j] === Infinity ? "INF " : `${dist[i][j]} `;
        }
        resultText += "\n";
    }

    document.getElementById('result').innerText = resultText;
}
