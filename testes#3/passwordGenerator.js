const readline = require('readline');
const chalk = require('chalk');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function generatePassword(length, options) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    let password = '';

    if (options.lower) chars += lowercase;
    if (options.upper) chars += uppercase;
    if (options.numbers) chars += numbers;
    if (options.symbols) chars += symbols;

    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
}

function checkPasswordStrength(password) {
    let strength = 0;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    if (strength === 4) return '💪 Muito Forte!';
    if (strength === 3) return '✅ Forte';
    if (strength === 2) return '⚠️ Média';
    return '❌ Fraca';
}

async function main() {
    try {
        console.clear();
        console.log(chalk.cyan('\n=== 🔐 Gerador de Senhas Seguras 🔐 ===\n'));

        while (true) {
            console.log(chalk.yellow('1. Gerar nova senha'));
            console.log(chalk.yellow('2. Verificar força de uma senha'));
            console.log(chalk.yellow('3. Sair'));

            const choice = await new Promise(resolve => {
                rl.question(chalk.green('\nEscolha uma opção (1-3): '), resolve);
            });

            if (choice === '1') {
                const length = await new Promise(resolve => {
                    rl.question(chalk.blue('\nComprimento da senha (8-50): '), resolve);
                });

                const options = {
                    lower: true,
                    upper: true,
                    numbers: true,
                    symbols: true
                };

                const password = generatePassword(parseInt(length) || 12, options);
                const strength = checkPasswordStrength(password);

                console.log(chalk.magenta('\n🎉 Sua senha gerada:'));
                console.log(chalk.white.bgBlack(`\n${password}\n`));
                console.log(chalk.cyan(`Força da senha: ${strength}\n`));
                
                await new Promise(resolve => {
                    rl.question('Pressione ENTER para continuar...', resolve);
                });
                console.clear();
            }
            else if (choice === '2') {
                const password = await new Promise(resolve => {
                    rl.question(chalk.blue('\nDigite a senha para verificar: '), resolve);
                });

                const strength = checkPasswordStrength(password);
                console.log(chalk.cyan(`\nForça da senha: ${strength}\n`));
            }
            else if (choice === '3') {
                console.log(chalk.green('\nObrigado por usar o Gerador de Senhas! 👋\n'));
                rl.close();
                break;
            }
        }
    } catch (error) {
        console.log(chalk.red('\nOcorreu um erro:', error.message));
        await new Promise(resolve => {
            rl.question('\nPressione ENTER para continuar...', resolve);
        });
    }
}

process.on('unhandledRejection', (error) => {
    console.error('Erro:', error);
    rl.question('\nPressione ENTER para sair...', () => process.exit(1));
});

main();