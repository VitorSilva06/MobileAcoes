// Tempo inicial em segundos (1 hora = 3600 segundos)
let tempoRestante = 3600;

function formatarTempo(segundos) {
    const hrs = Math.floor(segundos / 3600);
    const mins = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    return [
        hrs.toString().padStart(2, '0'),
        mins.toString().padStart(2, '0'),
        segs.toString().padStart(2, '0')
    ].join(':');
}

function atualizarCronometro() {
    if (tempoRestante <= 0) {
        clearInterval(intervalo);
        document.getElementById('cronometro').textContent = "00:00:00";
        // Você pode colocar aqui algum código para quando acabar o tempo
        return;
    }
    document.getElementById('cronometro').textContent = formatarTempo(tempoRestante);
    tempoRestante--;
}

// Atualiza o cronômetro imediatamente para mostrar 01:00:00 ao carregar a página
atualizarCronometro();

// Atualiza a cada 1 segundo
const intervalo = setInterval(atualizarCronometro, 1000);

document.addEventListener('DOMContentLoaded', () => {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'PETR4.SA'];
    const resultadoEl = document.getElementById('resultado');

    // Sua chave de API da Brapi
    const apiKey = 'scEykqMC4fMj7SEXVjHrwQ';

    const fetchQuote = (symbol) => {
        const url = `https://brapi.dev/api/quote/${symbol}?token=${apiKey}`;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ${response.status} ao buscar ${symbol}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data.results || data.results.length === 0) {
                    throw new Error(`Dados inválidos para ${symbol}`);
                }

                const quote = data.results[0];
                return {
                    symbol: quote.symbol,
                    price: quote.regularMarketPrice.toFixed(2),
                    currency: quote.currency,
                    name: quote.shortName || ''
                };
            });
    };

    Promise.all(symbols.map(fetchQuote))
        .then(results => {
            resultadoEl.innerHTML = '';
            results.forEach(({ symbol, price, currency, name }) => {
                resultadoEl.innerHTML += `Preço atual de ${name} (${symbol}): ${currency} ${price}<br>`;
            });
        })
        .catch(err => {
            resultadoEl.textContent = 'Erro ao buscar cotações: ' + err.message;
        });
});

