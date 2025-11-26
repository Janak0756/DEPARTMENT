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
    
    // Add modal events
    document.getElementById('closeSkillModal').addEventListener('click', closeSkillModal);
    document.getElementById('cancelSkillBtn').addEventListener('click', closeSkillModal);
    document.getElementById('saveSkillBtn').addEventListener('click', saveSkill);
    document.getElementById('deleteSkillBtn').addEventListener('click', deleteSkill);

    document.getElementById('skillName').addEventListener('input', updateSkillPreview);
    document.getElementById('skillLevel').addEventListener('change', updateSkillPreview);
}

// Preview updater
function updateSkillPreview() {
    const skillName = document.getElementById('skillName').value || 'Skill Name';
    const skillLevel = document.getElementById('skillLevel').value;
    
    document.getElementById('previewSkillName').textContent = skillName;
    document.getElementById('previewSkillLevel').textContent =
        skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1);
}

// Open add modal
function openSkillModal() {
    editingSkill = null;
    const modal = document.getElementById('skillModal');
    document.getElementById('modalTitle').textContent = 'Add New Skill';
    document.getElementById('saveSkillBtn').textContent = 'Add Skill';
    document.getElementById('deleteSection').style.display = 'none';

    document.getElementById('skillName').value = '';
    document.getElementById('skillLevel').value = 'beginner';
    document.getElementById('skillCategory').value = 'programming';

    updateSkillPreview();
    modal.style.display = 'flex';
}

// Open edit modal
function openEditSkillModal(skillElement) {
    editingSkill = skillElement;

    const modal = document.getElementById('skillModal');
    document.getElementById('modalTitle').textContent = 'Edit Skill';
    document.getElementById('saveSkillBtn').textContent = 'Update Skill';
    document.getElementById('deleteSection').style.display = 'block';

    const name = skillElement.childNodes[0].textContent.trim();
    const level = skillElement.querySelector('.skill-level-badge').textContent.toLowerCase();
    const category = skillElement.getAttribute('data-category');

    document.getElementById('skillName').value = name;
    document.getElementById('skillLevel').value = level;
    document.getElementById('skillCategory').value = category;

    updateSkillPreview();
    modal.style.display = 'flex';
}

// Close modal
function closeSkillModal() {
    document.getElementById('skillModal').style.display = 'none';
    editingSkill = null;
}

// Save or update skill
function saveSkill() {
    const skillName = document.getElementById('skillName').value.trim();
    const skillLevel = document.getElementById('skillLevel').value;
    const skillCategory = document.getElementById('skillCategory').value;

    if (!skillName) return alert('Please enter a skill name');

    if (editingSkill) {
        editingSkill.innerHTML = `
            ${skillName}
            <span class="skill-level-badge">
                ${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)}
            </span>
        `;
        editingSkill.setAttribute('data-level', skillLevel);
        editingSkill.setAttribute('data-category', skillCategory);

        showNotification('Skill updated successfully!', 'success');

    } else {
        const newSkill = document.createElement('span');
        newSkill.className = 'skill-tag';
        newSkill.setAttribute('data-level', skillLevel);
        newSkill.setAttribute('data-category', skillCategory);

        newSkill.innerHTML = `
            ${skillName}
            <span class="skill-level-badge">
                ${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)}
            </span>
        `;

        newSkill.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditSkillModal(newSkill);
        });

        document.getElementById('studentSkillsList').appendChild(newSkill);

        const count = document.getElementById('studentSkills');
        count.textContent = parseInt(count.textContent) + 1;

        showNotification('Skill added successfully!', 'success');
    }

    closeSkillModal();
}

// Delete skill
function deleteSkill() {
    if (!editingSkill) return;

    if (confirm('Are you sure you want to delete this skill?')) {
        editingSkill.remove();

        const count = document.getElementById('studentSkills');
        count.textContent = parseInt(count.textContent) - 1;

        showNotification('Skill deleted successfully!', 'success');
        closeSkillModal();
    }
}

// Add listeners for existing skills
function initializeExistingSkills() {
    document.querySelectorAll('#studentSkillsList .skill-tag').forEach(skill => {
        skill.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditSkillModal(skill);
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const box = document.createElement('div');
    box.className = `notification ${type}`;
    box.textContent = message;

    document.body.appendChild(box);
    setTimeout(() => box.classList.add('show'), 50);

    setTimeout(() => {
        box.classList.remove('show');
        setTimeout(() => box.remove(), 300);
    }, 2800);
}

// 🌟 CLEANED NETWORK FILTERS (SEARCH REMOVED)
function initializeNetworkFilters() {
    const searchInput = null;      // removed search box
    const clearSearchBtn = null;   // removed clear button

    const departmentFilter = document.getElementById('departmentFilter');
    const skillsFilter = document.getElementById('skillsFilter');
    const roleFilter = document.getElementById('roleFilter');
    const yearFilter = document.getElementById('yearFilter');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');

    const profileCards = document.querySelectorAll('#network-page .profile-card');

    let activeFilters = {
        search: "",
        department: "",
        skills: "",
        role: "",
        year: ""
    };

    function applyFilters() {

        const departmentValue = departmentFilter.value.toLowerCase();
        const skillsValue = skillsFilter.value.toLowerCase();
        const roleValue = roleFilter.value;
        const yearValue = yearFilter.value;

        activeFilters = {
            search: "",
            department: departmentValue,
            skills: skillsValue,
            role: roleValue,
            year: yearValue
        };

        let visibleCount = 0;

        profileCards.forEach(card => {
            let shouldShow = true;

            const name = card.querySelector('.profile-name').textContent.toLowerCase();
            const title = card.querySelector('.profile-title').textContent.toLowerCase();
            const department = card.getAttribute('data-department');
            const role = card.getAttribute('data-role');
            const year = card.getAttribute('data-year');
            const skills = card.getAttribute('data-skills');

            if (departmentValue && department !== departmentValue) shouldShow = false;
            if (skillsValue && !skills.includes(skillsValue)) shouldShow = false;
            if (roleValue && role !== roleValue) shouldShow = false;
            if (yearValue && year !== yearValue) shouldShow = false;

            card.style.display = shouldShow ? 'block' : 'none';

            if (shouldShow) visibleCount++;
        });

        document.getElementById('resultsCount').textContent =
            `${visibleCount} profile${visibleCount !== 1 ? 's' : ''}`;
    }

    window.resetFilters = function() {
        departmentFilter.value = "";
        skillsFilter.value = "";
        roleFilter.value = "";
        yearFilter.value = "";
        activeFilters.search = "";

        applyFilters();
    };

    applyFiltersBtn.addEventListener('click', applyFilters);
    resetFiltersBtn.addEventListener('click', window.resetFilters);

    applyFilters();
}

// Connect buttons in Network Page (center profiles)
function initializeConnectButtons() {
    const connectButtons = document.querySelectorAll('#network-page .btn-primary');

    connectButtons.forEach(button => {
        if (!button.hasAttribute('data-initialized')) {
            button.setAttribute('data-initialized', 'true');

            button.addEventListener('click', function() {
                const profileCard = this.closest('.profile-card');
                const profileName = profileCard.querySelector('.profile-name').textContent;

                this.innerHTML = '<i class="fas fa-check"></i> Request Sent';
                this.classList.remove('btn-primary');
                this.classList.add('btn-outline');
                this.disabled = true;

                showNotification(`Connection request sent to ${profileName}`, 'success');
            });
        }
    });
}

// 🌟 NEW: Mentorship Corner Buttons
function initializeMentorshipButtons() {
    const mentorshipButtons = document.querySelectorAll('.mentorship-list .btn');

    mentorshipButtons.forEach(btn => {
        if (!btn.hasAttribute('data-initialized')) {
            btn.setAttribute('data-initialized', 'true');

            btn.addEventListener('click', function () {
                const mentorName = this.closest('.mentor-item')
                    .querySelector('.post-user').textContent;

                this.innerHTML = '<i class="fas fa-check"></i> Requested';
                this.classList.remove('btn-outline');
                this.classList.add('btn-primary');
                this.style.opacity = '0.7';
                this.disabled = true;

                showNotification(`Request sent to ${mentorName}`, 'success');
            });
        }
    });
}

// Network page initializer
function initializeNetworkPage() {
    initializeNetworkFilters();
    initializeConnectButtons();
    initializeMentorshipButtons();
}

// Navigation + Login Logic
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

        navLinks.forEach(nav => nav.classList.remove('active'));
        e.target.classList.add('active');
    });
});

// Show page
function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));

    if (pageId === 'dashboard') {
        if (currentRole === 'student') {
            document.getElementById('student-dashboard').classList.add('active');
        } else {
            document.getElementById('admin-dashboard').classList.add('active');
        }
    } else {
        document.getElementById(`${pageId}-page`).classList.add('active');

        if (pageId === 'network') {
            setTimeout(initializeNetworkPage, 100);
        }
        if (pageId === 'dashboard' && currentRole === 'student') {
            setTimeout(initializeExistingSkills, 100);
        }
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) return alert('Please fill in all fields');

    if (email === demoAccounts[currentRole].email && password === demoAccounts[currentRole].password) {
        currentUser = demoAccounts[currentRole];
        showDashboard();
        showNotification(`Welcome ${currentUser.name}!`, 'success');
    } else {
        alert('Invalid email or password. Use the demo accounts provided.');
    }
}

function showDashboard() {
    mainHeader.classList.remove('hidden');
    mainFooter.classList.remove('hidden');

    document.getElementById('login-page').classList.remove('active');

    if (currentRole === 'student') {
        document.getElementById('student-dashboard').classList.add('active');
        document.getElementById('studentName').textContent = currentUser.name;
        document.getElementById('studentTitle').textContent = currentUser.title;
        adminTab.classList.add('hidden');
    } else {
        document.getElementById('admin-dashboard').classList.add('active');
        adminTab.classList.remove('hidden');
    }

    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector('[data-page="dashboard"]').classList.add('active');
}

function handleLogout() {
    currentUser = null;
    mainHeader.classList.add('hidden');
    mainFooter.classList.add('hidden');

    pages.forEach(page => page.classList.remove('active'));
    document.getElementById('login-page').classList.add('active');

    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

window.addEventListener('load', () => {
    document.querySelectorAll('.progress').forEach(progress => {
        const width = progress.style.width;
        progress.style.width = '0';
        setTimeout(() => progress.style.width = width, 500);
    });

    createSkillModal();

    //ensures eidting of already existing skills
    initializeExistingSkills();

});

document.getElementById('addStudentSkillBtn').addEventListener('click', openSkillModal);

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

document.getElementById('connectStudentGithubBtn').addEventListener('click', () => {
    alert('GitHub integration would be implemented here. For demo purposes, sample data is shown.');
});

document.getElementById('exploreClubsBtn').addEventListener('click', () => {
    showPage('clubs');
    navLinks.forEach(nav => nav.classList.remove('active'));
    document.querySelector('[data-page="clubs"]').classList.add('active');
});

document.addEventListener('click', (e) => {
    const modal = document.getElementById('skillModal');
    if (e.target === modal) closeSkillModal();
});
