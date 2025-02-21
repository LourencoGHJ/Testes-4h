const { ipcRenderer } = require('electron');

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

// Load data from main process
async function loadData() {
    state.candidates = await ipcRenderer.invoke('get-candidates');
    updateCandidatesList();
}

// Save candidate
async function saveCandidate() {
    const name = document.getElementById('candidate-name').value;
    const email = document.getElementById('candidate-email').value;
    const position = document.getElementById('candidate-position').value;

    if (name && email && position) {
        const candidate = {
            id: Date.now(),
            name,
            email,
            position,
            status: 'New',
            tests: [],
            interviews: []
        };

        const success = await ipcRenderer.invoke('add-candidate', candidate);
        if (success) {
            state.candidates.push(candidate);
            updateCandidatesList();
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('addCandidateModal'));
            modal.hide();
            document.getElementById('candidate-form').reset();
        }
    }
}

// Delete candidate
async function deleteCandidate(id) {
    if (confirm('Are you sure you want to delete this candidate?')) {
        const success = await ipcRenderer.invoke('delete-candidate', id);
        if (success) {
            state.candidates = state.candidates.filter(c => c.id !== id);
            updateCandidatesList();
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // Add event listeners
    document.getElementById('save-candidate').addEventListener('click', saveCandidate);
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            showPage(page);
        });
    });
});