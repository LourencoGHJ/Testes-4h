const readline = require('readline');
const fs = require('fs');
const chalk = require('chalk');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const TASKS_FILE = 'tasks.json';

// Inicializar ou carregar tarefas
let tasks = [];
if (fs.existsSync(TASKS_FILE)) {
    tasks = JSON.parse(fs.readFileSync(TASKS_FILE));
}

function saveTasks() {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

function displayTasks() {
    console.clear();
    console.log(chalk.cyan('\n=== 📝 Minhas Tarefas 📝 ===\n'));
    
    const categories = [...new Set(tasks.map(task => task.category))];
    
    categories.forEach(category => {
        console.log(chalk.yellow(`\n[${category}]`));
        const categoryTasks = tasks.filter(task => task.category === category);
        
        categoryTasks.forEach((task, index) => {
            const status = task.completed ? chalk.green('✅') : chalk.red('⭕');
            const date = new Date(task.date).toLocaleDateString('pt-PT');
            console.log(`${status} ${task.title} (${date})`);
        });
    });
    console.log('\n');
}

async function addTask() {
    const title = await question(chalk.blue('Título da tarefa: '));
    const category = await question(chalk.blue('Categoria: '));
    
    tasks.push({
        title,
        category,
        completed: false,
        date: new Date().toISOString()
    });
    
    saveTasks();
    console.log(chalk.green('\n✨ Tarefa adicionada com sucesso!\n'));
}

async function toggleTask() {
    displayTasks();
    const title = await question(chalk.blue('Digite o título da tarefa para alternar status: '));
    
    const task = tasks.find(t => t.title.toLowerCase() === title.toLowerCase());
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        console.log(chalk.green('\n✨ Status da tarefa atualizado!\n'));
    } else {
        console.log(chalk.red('\n❌ Tarefa não encontrada!\n'));
    }
}

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
    while (true) {
        displayTasks();
        console.log(chalk.cyan('1.') + ' Adicionar tarefa');
        console.log(chalk.cyan('2.') + ' Marcar/Desmarcar tarefa');
        console.log(chalk.cyan('3.') + ' Sair');
        
        const choice = await question(chalk.green('\nEscolha uma opção (1-3): '));
        
        switch (choice) {
            case '1':
                await addTask();
                break;
            case '2':
                await toggleTask();
                break;
            case '3':
                console.log(chalk.magenta('\n👋 Até logo!\n'));
                rl.close();
                return;
        }
        
        await question('Pressione ENTER para continuar...');
    }
}

main().catch(console.error);