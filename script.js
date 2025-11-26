// User data
let currentUser = null;
let currentRole = 'student';

// DOM Elements
const loginBtn = document.getElementById('submitLogin');
const logoutBtn = document.getElementById('logoutBtn');
const roleBtns = document.querySelectorAll('.role-btn');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const mainHeader = document.getElementById('main-header');
const mainFooter = document.getElementById('main-footer');
const adminTab = document.getElementById('adminTab');

// Demo accounts
const demoAccounts = {
    student: {
        email: 'student@skillconnect.edu',
        password: 'password',
        name: 'Alex Johnson',
        title: 'Computer Science Student'
    },
    admin: {
        email: 'admin@skillconnect.edu',
        password: 'password',
        name: 'Dr. Sarah Williams',
        title: 'Platform Administrator'
    }
};

// Track currently editing skill
let editingSkill = null;

// Create skill modal
function createSkillModal() {
    const modalHTML = `
        <div class="modal-overlay" id="skillModal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modalTitle">Add New Skill</h3>
                    <button class="modal-close" id="closeSkillModal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="skillName">Skill Name</label>
                        <input type="text" class="form-control" id="skillName" placeholder="Enter skill name">
                    </div>
                    <div class="form-group">
                        <label for="skillLevel">Proficiency Level</label>
                        <select class="form-control" id="skillLevel">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="skillCategory">Category</label>
                        <select class="form-control" id="skillCategory">
                            <option value="programming">Programming</option>
                            <option value="design">Design</option>
                            <option value="data">Data Science</option>
                            <option value="soft-skills">Soft Skills</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="skills-preview">
                        <h4>Preview:</h4>
                        <div class="preview-skill-tag">
                            <span id="previewSkillName">Skill Name</span>
                            <span class="skill-level-badge" id="previewSkillLevel">Beginner</span>
                        </div>
                    </div>
                    <div class="delete-section" id="deleteSection" style="display: none;">
                        <hr>
                        <button class="btn btn-danger" id="deleteSkillBtn" style="width: 100%;">
                            <i class="fas fa-trash"></i> Delete Skill
                        </button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" id="cancelSkillBtn">Cancel</button>
                    <button class="btn btn-primary" id="saveSkillBtn">Add Skill</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners for the modal
    document.getElementById('closeSkillModal').addEventListener('click', closeSkillModal);
    document.getElementById('cancelSkillBtn').addEventListener('click', closeSkillModal);
    document.getElementById('saveSkillBtn').addEventListener('click', saveSkill);
    document.getElementById('deleteSkillBtn').addEventListener('click', deleteSkill);
    
    // Add real-time preview updates
    document.getElementById('skillName').addEventListener('input', updateSkillPreview);
    document.getElementById('skillLevel').addEventListener('change', updateSkillPreview);
}

// Update skill preview
function updateSkillPreview() {
    const skillName = document.getElementById('skillName').value || 'Skill Name';
    const skillLevel = document.getElementById('skillLevel').value;
    
    document.getElementById('previewSkillName').textContent = skillName;
    document.getElementById('previewSkillLevel').textContent = skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1);
}

// Open skill modal for adding new skill
function openSkillModal() {
    editingSkill = null;
    const modal = document.getElementById('skillModal');
    const modalTitle = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('saveSkillBtn');
    const deleteSection = document.getElementById('deleteSection');
    
    // Set modal for adding new skill
    modalTitle.textContent = 'Add New Skill';
    saveBtn.textContent = 'Add Skill';
    deleteSection.style.display = 'none';
    
    // Reset form
    document.getElementById('skillName').value = '';
    document.getElementById('skillLevel').value = 'beginner';
    document.getElementById('skillCategory').value = 'programming';
    updateSkillPreview();
    
    modal.style.display = 'flex';
}

// Open skill modal for editing existing skill
function openEditSkillModal(skillElement) {
    editingSkill = skillElement;
    const modal = document.getElementById('skillModal');
    const modalTitle = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('saveSkillBtn');
    const deleteSection = document.getElementById('deleteSection');
    
    // Set modal for editing skill
    modalTitle.textContent = 'Edit Skill';
    saveBtn.textContent = 'Update Skill';
    deleteSection.style.display = 'block';
    
    // Extract current skill data
    const skillNameElement = skillElement.childNodes[0];
    const skillName = skillNameElement.textContent.trim();
    const skillLevelBadge = skillElement.querySelector('.skill-level-badge');
    const skillLevel = skillLevelBadge ? skillLevelBadge.textContent.toLowerCase() : 'intermediate';
    const category = skillElement.getAttribute('data-category') || 'programming';
    
    // Populate form with current data
    document.getElementById('skillName').value = skillName;
    document.getElementById('skillLevel').value = skillLevel;
    document.getElementById('skillCategory').value = category;
    updateSkillPreview();
    
    modal.style.display = 'flex';
}

// Close skill modal
function closeSkillModal() {
    const modal = document.getElementById('skillModal');
    modal.style.display = 'none';
    editingSkill = null;
}

// Save or update skill
function saveSkill() {
    const skillName = document.getElementById('skillName').value.trim();
    const skillLevel = document.getElementById('skillLevel').value;
    const skillCategory = document.getElementById('skillCategory').value;
    
    if (!skillName) {
        alert('Please enter a skill name');
        return;
    }
    
    if (editingSkill) {
        // Update existing skill
        editingSkill.innerHTML = `
            ${skillName}
            <span class="skill-level-badge">${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)}</span>
        `;
        editingSkill.setAttribute('data-level', skillLevel);
        editingSkill.setAttribute('data-category', skillCategory);
        
        // Re-add click event
        editingSkill.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditSkillModal(editingSkill);
        });
        
        showNotification('Skill updated successfully!', 'success');
    } else {
        // Create new skill element
        const skillElement = document.createElement('span');
        skillElement.className = 'skill-tag';
        skillElement.innerHTML = `
            ${skillName}
            <span class="skill-level-badge">${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)}</span>
        `;
        
        // Add data attributes for filtering
        skillElement.setAttribute('data-level', skillLevel);
        skillElement.setAttribute('data-category', skillCategory);
        
        // Add click event for editing
        skillElement.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditSkillModal(skillElement);
        });
        
        document.getElementById('studentSkillsList').appendChild(skillElement);
        
        // Update skills count
        const skillsCount = document.getElementById('studentSkills');
        skillsCount.textContent = parseInt(skillsCount.textContent) + 1;
        
        showNotification('Skill added successfully!', 'success');
    }
    
    // Close modal
    closeSkillModal();
}

// Delete skill
function deleteSkill() {
    if (!editingSkill) return;
    
    if (confirm('Are you sure you want to delete this skill?')) {
        editingSkill.remove();
        
        // Update skills count
        const skillsCount = document.getElementById('studentSkills');
        skillsCount.textContent = parseInt(skillsCount.textContent) - 1;
        
        showNotification('Skill deleted successfully!', 'success');
        closeSkillModal();
    }
}

// Add click events to existing skills
function initializeExistingSkills() {
    const existingSkills = document.querySelectorAll('#studentSkillsList .skill-tag');
    existingSkills.forEach(skill => {
        // Add click event for editing
        skill.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditSkillModal(skill);
        });
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Event Listeners
loginBtn.addEventListener('click', handleLogin);
logoutBtn.addEventListener('click', handleLogout);

roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        roleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentRole = btn.getAttribute('data-role');
    });
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.getAttribute('data-page');
        showPage(page);
        
        // Update active nav link
        navLinks.forEach(nav => nav.classList.remove('active'));
        e.target.classList.add('active');
    });
});

// Functions
function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    if (pageId === 'dashboard') {
        if (currentRole === 'student') {
            document.getElementById('student-dashboard').classList.add('active');
        } else {
            document.getElementById('admin-dashboard').classList.add('active');
        }
    } else {
        document.getElementById(`${pageId}-page`).classList.add('active');
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Check demo accounts
    if (email === demoAccounts[currentRole].email && password === demoAccounts[currentRole].password) {
        currentUser = demoAccounts[currentRole];
        showDashboard();
        alert(`Welcome ${currentUser.name}!`);
    } else {
        alert('Invalid email or password. Use the demo accounts provided.');
    }
}

function showDashboard() {
    // Show main header and footer
    mainHeader.classList.remove('hidden');
    mainFooter.classList.remove('hidden');
    
    // Hide login page
    document.getElementById('login-page').classList.remove('active');
    
    // Show appropriate dashboard
    if (currentRole === 'student') {
        document.getElementById('student-dashboard').classList.add('active');
        document.getElementById('studentName').textContent = currentUser.name;
        document.getElementById('studentTitle').textContent = currentUser.title;
        adminTab.classList.add('hidden');
        
        // Initialize existing skills with click events
        setTimeout(initializeExistingSkills, 100);
    } else {
        document.getElementById('admin-dashboard').classList.add('active');
        adminTab.classList.remove('hidden');
    }
    
    // Update navigation
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector('[data-page="dashboard"]').classList.add('active');
}

function handleLogout() {
    currentUser = null;
    mainHeader.classList.add('hidden');
    mainFooter.classList.add('hidden');
    
    // Show login page
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById('login-page').classList.add('active');
    
    // Reset form
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

// Animate progress bars on page load
window.addEventListener('load', () => {
    document.querySelectorAll('.progress').forEach(progress => {
        const width = progress.style.width;
        progress.style.width = '0';
        setTimeout(() => {
            progress.style.width = width;
        }, 500);
    });
    
    // Create skill modal
    createSkillModal();
});

// Add skill functionality for student
document.getElementById('addStudentSkillBtn').addEventListener('click', openSkillModal);

// Edit profile functionality
document.getElementById('editStudentProfileBtn').addEventListener('click', () => {
    const name = prompt('Enter your name:', currentUser.name);
    if (name) {
        currentUser.name = name;
        document.getElementById('studentName').textContent = name;
    }
    
    const title = prompt('Enter your title:', currentUser.title);
    if (title) {
        currentUser.title = title;
        document.getElementById('studentTitle').textContent = title;
    }
});

// Connect GitHub functionality
document.getElementById('connectStudentGithubBtn').addEventListener('click', () => {
    alert('GitHub integration would be implemented here. For demo purposes, we\'re showing sample data.');
});

// Explore clubs functionality
document.getElementById('exploreClubsBtn').addEventListener('click', () => {
    showPage('clubs');
    navLinks.forEach(nav => nav.classList.remove('active'));
    document.querySelector('[data-page="clubs"]').classList.add('active');
});

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('skillModal');
    if (e.target === modal) {
        closeSkillModal();
    }
});
