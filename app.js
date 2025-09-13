// VS Code Portfolio - Interactive Functionality (Fixed Version)

class VSCodePortfolio {
    constructor() {
        this.currentFile = 'index.html';
        this.openTabs = ['index.html'];
        this.isTerminalMinimized = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startTypingAnimation();
        this.initializeTheme();
        this.showTerminalMessages();
        this.setupKeyboardShortcuts();
    }

    setupEventListeners() {
        // File tree navigation - Fixed
        document.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const fileName = e.currentTarget.dataset.file;
                console.log('File clicked:', fileName);
                this.openFile(fileName);
            });
        });

        // Activity bar navigation - Fixed
        document.querySelectorAll('.activity-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const section = e.currentTarget.dataset.section;
                console.log('Activity item clicked:', section);
                this.navigateToSection(section);
            });
        });

        // Tab management - Fixed with event delegation
        document.querySelector('.tab-bar').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const tab = e.target.closest('.tab');
            if (!tab) return;
            
            const fileName = tab.dataset.file;
            
            if (e.target.classList.contains('tab-close')) {
                console.log('Closing tab:', fileName);
                this.closeTab(fileName);
            } else {
                console.log('Switching to tab:', fileName);
                this.switchToTab(fileName);
            }
        });

        // Theme toggle - Fixed selector
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }

        // Terminal toggle - Fixed
        const terminalToggle = document.getElementById('terminalToggle');
        if (terminalToggle) {
            terminalToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTerminal();
            });
        }

        // Contact form - Fixed
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleContactForm(e);
            });
        }

        // Resume download - Fixed
        const downloadBtn = document.getElementById('downloadResume');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadResume();
            });
        }

        // Window controls animation
        document.querySelectorAll('.control-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.animateWindowControl(e.target);
            });
        });

        // Responsive sidebar toggle for mobile
        this.setupResponsiveHandlers();

        // Make sure all tab close buttons are visible
        this.ensureTabCloseButtons();
    }

    // Fix tab close button visibility
    ensureTabCloseButtons() {
        document.querySelectorAll('.tab').forEach(tab => {
            const closeBtn = tab.querySelector('.tab-close');
            if (closeBtn) {
                closeBtn.style.opacity = '1';
                closeBtn.style.visibility = 'visible';
            }
        });
    }

    // File and Tab Management - Fixed
    openFile(fileName) {
        console.log('Opening file:', fileName);
        
        // Update active states in file tree
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.remove('active');
        });
        const fileItem = document.querySelector(`[data-file="${fileName}"]`);
        if (fileItem) {
            fileItem.classList.add('active');
        }

        // Add to open tabs if not already open
        if (!this.openTabs.includes(fileName)) {
            this.openTabs.push(fileName);
            this.createTab(fileName);
        }

        this.switchToFile(fileName);
        this.addTerminalMessage(`📁 Opened ${fileName}`);
    }

    createTab(fileName) {
        const tabBar = document.querySelector('.tab-bar');
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.dataset.file = fileName;
        
        const icon = this.getFileIcon(fileName);
        tab.innerHTML = `
            ${icon}
            <span>${fileName}</span>
            <div class="tab-close" style="opacity: 1; visibility: visible;">×</div>
        `;
        
        tabBar.appendChild(tab);
        console.log('Created tab for:', fileName);
    }

    switchToTab(fileName) {
        console.log('Switching to tab:', fileName);
        this.switchToFile(fileName);
    }

    switchToFile(fileName) {
        console.log('Switching to file:', fileName);
        
        // Update tabs active state
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`.tab[data-file="${fileName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Update file content
        document.querySelectorAll('.file-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(fileName);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        // Update file tree
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeFile = document.querySelector(`.file-item[data-file="${fileName}"]`);
        if (activeFile) {
            activeFile.classList.add('active');
        }

        this.currentFile = fileName;
        this.updateStatusBar(fileName);
    }

    closeTab(fileName) {
        if (this.openTabs.length === 1) {
            this.addTerminalMessage('❌ Cannot close the last tab');
            return;
        }

        // Remove from open tabs
        this.openTabs = this.openTabs.filter(tab => tab !== fileName);
        
        // Remove tab element
        const tabElement = document.querySelector(`.tab[data-file="${fileName}"]`);
        if (tabElement) {
            tabElement.remove();
        }

        // If closing active tab, switch to last tab
        if (this.currentFile === fileName) {
            const lastTab = this.openTabs[this.openTabs.length - 1];
            this.switchToFile(lastTab);
        }

        this.addTerminalMessage(`❌ Closed ${fileName}`);
    }

    getFileIcon(fileName) {
        const icons = {
            'index.html': '<svg width="16" height="16" viewBox="0 0 16 16" class="tab-icon"><path fill="#e34c26" d="M1 1v14h14V1H1zm12.5 12.5h-11v-11h11v11z"/></svg>',
            'style.css': '<svg width="16" height="16" viewBox="0 0 16 16" class="tab-icon"><path fill="#1572b6" d="M1 1v14h14V1H1zm12.5 12.5h-11v-11h11v11z"/></svg>',
            'script.js': '<svg width="16" height="16" viewBox="0 0 16 16" class="tab-icon"><path fill="#f1e05a" d="M1 1v14h14V1H1zm12.5 12.5h-11v-11h11v11z"/></svg>',
            'readme.md': '<svg width="16" height="16" viewBox="0 0 16 16" class="tab-icon"><path fill="#083fa1" d="M1 1v14h14V1H1zm12.5 12.5h-11v-11h11v11z"/></svg>'
        };
        return icons[fileName] || icons['index.html'];
    }

    // Activity Bar Navigation - Fixed
    navigateToSection(section) {
        const fileMap = {
            'explorer': 'index.html',
            'projects': 'style.css',
            'contact': 'script.js',
            'resume': 'readme.md'
        };

        // Update active activity item
        document.querySelectorAll('.activity-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeActivity = document.querySelector(`[data-section="${section}"]`);
        if (activeActivity) {
            activeActivity.classList.add('active');
        }

        const fileName = fileMap[section];
        if (fileName) {
            this.openFile(fileName);
        }
    }

    // Theme Management - Fixed
    toggleTheme() {
        const body = document.body;
        const currentTheme = body.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.dataset.theme = newTheme;
        
        // Update theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const themeIcon = themeToggle.querySelector('.theme-icon');
            const themeText = themeToggle.querySelector('.theme-text');
            
            if (themeIcon && themeText) {
                if (newTheme === 'light') {
                    themeIcon.textContent = '☀️';
                    themeText.textContent = 'Light';
                } else {
                    themeIcon.textContent = '🌙';
                    themeText.textContent = 'Dark';
                }
            }
        }

        // Save preference
        localStorage.setItem('vscode-theme', newTheme);
        this.addTerminalMessage(`🎨 Switched to ${newTheme} theme`);
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('vscode-theme') || 'dark';
        document.body.dataset.theme = savedTheme;
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const themeIcon = themeToggle.querySelector('.theme-icon');
            const themeText = themeToggle.querySelector('.theme-text');
            
            if (themeIcon && themeText) {
                if (savedTheme === 'light') {
                    themeIcon.textContent = '☀️';
                    themeText.textContent = 'Light';
                } else {
                    themeIcon.textContent = '🌙';
                    themeText.textContent = 'Dark';
                }
            }
        }
    }

    // Typing Animation - Fixed
    startTypingAnimation() {
        const text = "console.log('Welcome to my portfolio! 👋');";
        const typingElement = document.getElementById('typing-text');
        
        if (!typingElement) {
            console.log('Typing element not found');
            return;
        }
        
        let index = 0;
        typingElement.textContent = '';

        const typeText = () => {
            if (index < text.length) {
                typingElement.textContent += text.charAt(index);
                index++;
                setTimeout(typeText, 80);
            }
        };

        setTimeout(typeText, 1500);
    }

    // Terminal Management - Fixed
    toggleTerminal() {
        const terminal = document.getElementById('terminal');
        const toggleBtn = document.getElementById('terminalToggle');
        
        if (!terminal || !toggleBtn) {
            console.log('Terminal elements not found');
            return;
        }
        
        this.isTerminalMinimized = !this.isTerminalMinimized;
        
        if (this.isTerminalMinimized) {
            terminal.classList.add('minimized');
            toggleBtn.textContent = '+';
            this.addTerminalMessage('📉 Terminal minimized');
        } else {
            terminal.classList.remove('minimized');
            toggleBtn.textContent = '−';
            this.addTerminalMessage('📈 Terminal expanded');
        }
    }

    addTerminalMessage(message) {
        const terminalContent = document.querySelector('.terminal-content');
        if (!terminalContent) return;
        
        const lastLine = terminalContent.querySelector('.terminal-line:last-child');
        
        // Remove cursor from last line
        if (lastLine) {
            const cursor = lastLine.querySelector('.terminal-cursor');
            if (cursor) cursor.remove();
        }

        // Add new message line
        const newLine = document.createElement('div');
        newLine.className = 'terminal-line';
        newLine.innerHTML = `<span class="terminal-output">${message}</span>`;
        
        // Add new prompt line
        const promptLine = document.createElement('div');
        promptLine.className = 'terminal-line';
        promptLine.innerHTML = `
            <span class="terminal-prompt">portfolio@vscode:~$</span>
            <span class="terminal-cursor">_</span>
        `;
        
        terminalContent.appendChild(newLine);
        terminalContent.appendChild(promptLine);
        
        // Auto-scroll to bottom
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    showTerminalMessages() {
        setTimeout(() => {
            this.addTerminalMessage('🚀 Initializing portfolio...');
        }, 2000);
        
        setTimeout(() => {
            this.addTerminalMessage('📦 Loading components...');
        }, 3000);
        
        setTimeout(() => {
            this.addTerminalMessage('✨ All systems ready!');
        }, 4000);

        setTimeout(() => {
            this.addTerminalMessage('💻 VS Code Portfolio initialized');
            this.addTerminalMessage('🎯 Use the sidebar to navigate sections');
            this.addTerminalMessage('⌨️ Try Ctrl+` to toggle terminal');
        }, 5000);
    }

    // Contact Form Handling - Fixed
    handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            this.addTerminalMessage('❌ Please fill in all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.addTerminalMessage('❌ Please enter a valid email address');
            return;
        }

        // Simulate form submission with loading
        this.addTerminalMessage(`📧 Sending message from ${name}...`);
        
        // Simulate API delay
        setTimeout(() => {
            this.addTerminalMessage('✅ Message sent successfully!');
            this.addTerminalMessage(`📝 From: ${email}`);
            this.addTerminalMessage(`💬 Message: "${message.substring(0, 50)}..."`);
            e.target.reset();
        }, 1500);

        // In a real application, integrate with EmailJS:
        // emailjs.send('service_id', 'template_id', { name, email, message })
    }

    // Resume Download - Fixed
    downloadResume() {
        // Create a more realistic PDF download simulation
        const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
100 700 Td
(Your Name - Resume) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000125 00000 n 
0000000185 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
279
%%EOF`;

        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Your_Name_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.addTerminalMessage('📄 Resume downloaded successfully!');
        this.addTerminalMessage('💾 File: Your_Name_Resume.pdf');
    }

    // Window Controls Animation
    animateWindowControl(button) {
        button.style.transform = 'scale(0.8)';
        button.style.transition = 'transform 0.15s ease';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        if (button.classList.contains('close')) {
            this.addTerminalMessage('🔴 Close button clicked (demo only)');
        } else if (button.classList.contains('minimize')) {
            this.addTerminalMessage('🟡 Minimize button clicked (demo only)');
        } else if (button.classList.contains('maximize')) {
            this.addTerminalMessage('🟢 Maximize button clicked (demo only)');
        }
    }

    // Status Bar Updates - Fixed
    updateStatusBar(fileName) {
        const statusLeft = document.querySelector('.status-left');
        if (!statusLeft) return;
        
        const lineCol = statusLeft.children[0];
        const encoding = statusLeft.children[1];
        const fileType = statusLeft.children[2];
        
        if (!lineCol || !encoding || !fileType) return;
        
        // Update file type based on extension
        const extension = fileName.split('.').pop();
        const fileTypes = {
            'html': 'HTML',
            'css': 'CSS',
            'js': 'JavaScript',
            'md': 'Markdown'
        };
        
        fileType.textContent = fileTypes[extension] || 'Plain Text';
        lineCol.textContent = 'Ln 1, Col 1';
        encoding.textContent = 'UTF-8';
        
        this.addTerminalMessage(`📄 Switched to ${fileName} (${fileTypes[extension] || 'Plain Text'})`);
    }

    // Responsive Handlers
    setupResponsiveHandlers() {
        const handleResize = () => {
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile && !this.isTerminalMinimized) {
                this.toggleTerminal();
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check
    }

    // Keyboard Shortcuts - Fixed
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + `: Toggle terminal
            if ((e.ctrlKey || e.metaKey) && e.key === '`') {
                e.preventDefault();
                this.toggleTerminal();
            }
            
            // Ctrl/Cmd + W: Close tab
            if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
                e.preventDefault();
                if (this.openTabs.length > 1) {
                    this.closeTab(this.currentFile);
                }
            }
            
            // Ctrl/Cmd + T: Show new tab message
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                this.addTerminalMessage('⌨️ Ctrl+T pressed - New tab shortcut');
            }

            // Ctrl/Cmd + Shift + P: Command palette simulation
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.addTerminalMessage('🎛️ Command palette shortcut (Ctrl+Shift+P)');
            }
        });
    }
}

// Enhanced Project Effects
class ProjectEffects {
    constructor() {
        this.setupHoverEffects();
        this.setupProjectLinks();
    }

    setupHoverEffects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                card.style.boxShadow = '0 10px 25px rgba(0, 122, 204, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            });
        });
    }

    setupProjectLinks() {
        const projectLinks = document.querySelectorAll('.project-link');
        
        projectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Since these are demo links, prevent navigation and show message
                if (link.href.includes('yourusername') || link.href.includes('your-')) {
                    e.preventDefault();
                    const portfolio = window.portfolioInstance;
                    if (portfolio) {
                        const linkType = link.classList.contains('demo') ? 'demo' : 'GitHub';
                        portfolio.addTerminalMessage(`🔗 ${linkType} link clicked (demo)`);
                    }
                }
            });
        });
    }
}

// Skills Animation
class SkillsAnimator {
    constructor() {
        this.animateSkills();
    }

    animateSkills() {
        // Wait for content to be visible
        setTimeout(() => {
            const skills = document.querySelectorAll('.skills li');
            
            skills.forEach((skill, index) => {
                skill.style.opacity = '0';
                skill.style.transform = 'translateX(-20px)';
                skill.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    skill.style.opacity = '1';
                    skill.style.transform = 'translateX(0)';
                }, index * 100 + 2000); // Start after typing animation
            });
        }, 100);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing VS Code Portfolio...');
    
    const portfolio = new VSCodePortfolio();
    window.portfolioInstance = portfolio; // Make available globally for other classes
    
    const projectEffects = new ProjectEffects();
    const skillsAnimator = new SkillsAnimator();
    
    // Add loaded class for any CSS that depends on it
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Portfolio error:', e.error);
    const portfolio = window.portfolioInstance;
    if (portfolio) {
        portfolio.addTerminalMessage(`❌ Error: ${e.error?.message || 'Unknown error'}`);
    }
});

// Prevent default behavior for demo links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && (link.href.includes('yourusername') || link.href.includes('your-'))) {
        e.preventDefault();
        const portfolio = window.portfolioInstance;
        if (portfolio) {
            portfolio.addTerminalMessage('🔗 Demo link clicked - would open in new tab');
        }
    }
});

// Page visibility handling
document.addEventListener('visibilitychange', () => {
    const portfolio = window.portfolioInstance;
    if (portfolio) {
        if (document.hidden) {
            portfolio.addTerminalMessage('👁️ Portfolio minimized');
        } else {
            portfolio.addTerminalMessage('👁️ Portfolio restored');
        }
    }
});