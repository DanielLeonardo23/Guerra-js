document.addEventListener('DOMContentLoaded', function() {
    showKnapsackForm();
});

function showKnapsackForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Algoritmo de la Mochila</h2>
        <label for="weights">Pesos (separados por comas):</label>
        <input type="text" id="weights" placeholder="Ejemplo: 1,2,3">
        <label for="values">Valores (separados por comas):</label>
        <input type="text" id="values" placeholder="Ejemplo: 10,20,30">
        <label for="capacity">Capacidad:</label>
        <input type="number" id="capacity" placeholder="Ejemplo: 50">
        <button onclick="solveKnapsack()">Calcular</button>
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
