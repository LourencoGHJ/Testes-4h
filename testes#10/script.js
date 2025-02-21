// Dados de exemplo
let candidates = [];
let tests = [];
let interviews = [];

// Gerenciamento de navegação
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.getAttribute('data-page');
        showPage(page);
    });
});

function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(`${pageId}-section`).style.display = 'block';
}

// Gerenciamento de Candidatos
document.getElementById('save-candidate').addEventListener('click', () => {
    const name = document.getElementById('candidate-name').value;
    const email = document.getElementById('candidate-email').value;
    const position = document.getElementById('candidate-position').value;

    if (name && email && position) {
        const candidate = {
            id: Date.now(),
            name,
            email,
            position,
            status: 'Novo',
            tests: [],
            interviews: []
        };

        candidates.push(candidate);
        updateCandidatesList();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCandidateModal'));
        modal.hide();
        document.getElementById('candidate-form').reset();
    }
});

function updateCandidatesList() {
    const list = document.getElementById('candidates-list');
    list.innerHTML = candidates.map(candidate => `
        <tr>
            <td>${candidate.name}</td>
            <td>${candidate.email}</td>
            <td>${candidate.position}</td>
            <td><span class="badge bg-primary">${candidate.status}</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewCandidate(${candidate.id})">Ver</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCandidate(${candidate.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function viewCandidate(id) {
    const candidate = candidates.find(c => c.id === id);
    if (candidate) {
        // Implementar visualização detalhada do candidato
        alert(`Detalhes do candidato: ${candidate.name}`);
    }
}

function deleteCandidate(id) {
    if (confirm('Tem certeza que deseja excluir este candidato?')) {
        candidates = candidates.filter(c => c.id !== id);
        updateCandidatesList();
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    showPage('candidates');
    updateCandidatesList();
});
// State Management
const state = {
    candidates: [],
    tests: [],
    interviews: [],
    filters: {
        status: '',
        position: '',
        search: ''
    }
};
// Initialize state management functions
const updateState = (key, value) => {
    state[key] = value;
    renderUI();
};

const renderUI = () => {
    updateCandidatesList();
    // Add other UI updates as needed
};
