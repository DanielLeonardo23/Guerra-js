function createDenominationInputs() {
    const container = document.getElementById('denominations-container');
    container.innerHTML = ''; // Clear any existing inputs
    const numTypes = parseInt(document.getElementById('coin-types').value, 10);

    if (!isNaN(numTypes) && numTypes > 0) {
        for (let i = 0; i < numTypes; i++) {
            const div = document.createElement('div');
            div.className = 'denomination-input';
            div.innerHTML = `
                <input type="number" step="0.01" placeholder="Denomination">
                <input type="number" placeholder="Count">
                <button onclick="removeDenomination(this)">Eliminar</button>
            `;
            container.appendChild(div);
        }
    }
}

function minCoinsChange(total, denominations, counts) {
    const totalCents = Math.round(total * 100);
    const denominationsCents = denominations.map(d => Math.round(d * 100));

    const dp = Array(totalCents + 1).fill(Infinity);
    dp[0] = 0;

    const usedCoins = Array.from({ length: totalCents + 1 }, () => Array(denominations.length).fill(0));

    for (let i = 0; i < denominationsCents.length; i++) {
        const coin = denominationsCents[i];
        for (let j = coin; j <= totalCents; j++) {
            if (dp[j - coin] !== Infinity && counts[i] > usedCoins[j - coin][i]) {
                if (dp[j] > dp[j - coin] + 1) {
                    dp[j] = dp[j - coin] + 1;
                    usedCoins[j] = [...usedCoins[j - coin]];
                    usedCoins[j][i] += 1;
                }
            }
        }
    }

    if (dp[totalCents] === Infinity) {
        return "No se puede dar el cambio exacto";
    } else {
        return { minCoins: dp[totalCents], coinUsage: usedCoins[totalCents] };
    }
}

function calculateChange() {
    const total = parseFloat(document.getElementById('total').value);
    const denominationElements = document.querySelectorAll('.denomination-input');
    const denominations = [];
    const counts = [];

    denominationElements.forEach(elem => {
        const denomination = parseFloat(elem.children[0].value);
        const count = parseInt(elem.children[1].value, 10);

        if (!isNaN(denomination) && !isNaN(count)) {
            denominations.push(denomination);
            counts.push(count);
        }
    });

    const result = minCoinsChange(total, denominations, counts);

    if (typeof result === 'string') {
        document.getElementById('min-coins').innerText = result;
        document.getElementById('coin-usage').innerText = '';
    } else {
        document.getElementById('min-coins').innerText = `Número mínimo de monedas: ${result.minCoins}`;
        document.getElementById('coin-usage').innerText = `Uso de monedas: ${result.coinUsage.join(', ')}`;
    }
}

function removeDenomination(button) {
    button.parentElement.remove();
}
