const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const numberToGuess = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

console.log('🎮 Bem-vindo ao Jogo de Adivinhação! 🎮');
console.log('Tenta adivinhar o número entre 1 e 100\n');

function makeGuess() {
    rl.question('Digite o seu palpite: ', (answer) => {
        const guess = parseInt(answer);
        attempts++;

        if (isNaN(guess)) {
            console.log('❌ Por favor, digite um número válido!');
            makeGuess();
        } else if (guess < numberToGuess) {
            console.log('⬆️ Muito baixo! Tenta um número maior.');
            makeGuess();
        } else if (guess > numberToGuess) {
            console.log('⬇️ Muito alto! Tenta um número menor.');
            makeGuess();
        } else {
            console.log(`\n🎉 PARABÉNS! Acertaste em ${attempts} tentativas! 🎉`);
            console.log('\nPressiona ENTER para sair...');
            rl.question('', () => {
                rl.close();
            });
        }
    });
}

makeGuess();