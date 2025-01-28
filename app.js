class WindowManager {
  constructor() {
    this.windows = new Set();
    this.zIndex = 100;
    
    document.querySelectorAll('.icon').forEach(icon => {
      icon.addEventListener('dblclick', () => this.openApp(icon.dataset.app));
    });
  }

  openApp(appType) {
    const window = new Window(appType);
    this.windows.add(window);
    window.element.addEventListener('mousedown', () => this.bringToFront(window));
  }

  bringToFront(window) {
    this.zIndex++;
    window.element.style.zIndex = this.zIndex;
  }
}

class Window {
  constructor(type) {
    this.type = type;
    this.element = this.createWindow();
    this.initDrag();
    document.getElementById('windows-container').appendChild(this.element);
  }

  createWindow() {
    const window = document.createElement('div');
    window.className = 'window';
    window.style.left = `${Math.random() * 200 + 50}px`;
    window.style.top = `${Math.random() * 100 + 50}px`;
    
    const content = {
      mail: {
        title: 'Mail App',
        html: `<div class="email-list">
          <div class="email">Urgent: Q4 Report Needed</div>
          <div class="email">Meeting Reminder</div>
        </div>`
      },
      chat: {
        title: 'Office Chat',
        html: `<div class="chat-messages">
          <div>Boss: Status update?</div>
          <div>Coworker: Need help?</div>
        </div>`
      },
      sales: {
        title: 'Sales Tracker',
        html: `<div class="sales-progress">
          Progress: <progress value="65" max="100"></progress>
        </div>`
      }
    }[this.type];

    window.innerHTML = `
      <div class="window-header">
        ${content.title}
        <button class="close-btn">×</button>
      </div>
      <div class="window-content">${content.html}</div>
    `;

    window.querySelector('.close-btn').addEventListener('click', () => {
      window.remove();
    });

    return window;
  }

  initDrag() {
    const header = this.element.querySelector('.window-header');
    let isDragging = false;
    let offset = [0, 0];

    header.addEventListener('mousedown', e => {
      isDragging = true;
      offset = [
        e.clientX - this.element.offsetLeft, 
        e.clientY - this.element.offsetTop
      ];
    });

    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      this.element.style.left = `${e.clientX - offset[0]}px`;
      this.element.style.top = `${e.clientY - offset[1]}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }
}

class TaskManager {
  constructor() {
    this.productivity = 100;
    this.stress = 0;
    this.updateStats();
    this.startStressTimer();
  }

  completeTask() {
    this.productivity = Math.min(100, this.productivity + 5);
    this.stress += 10;
    this.updateStats();
  }

  takeBreak() {
    this.stress = Math.max(0, this.stress - 30);
    this.updateStats();
  }

  updateStats() {
    document.getElementById('productivity').textContent = `📈 ${this.productivity}%`;
    document.getElementById('stress').textContent = `🧘♂️ ${this.stress}%`;
  }

  startStressTimer() {
    setInterval(() => {
      this.stress = Math.min(100, this.stress + 1);
      this.updateStats();
    }, 60000);
  }
}

// Initialize core systems
new WindowManager();
const taskManager = new TaskManager();

// Example break functionality
document.getElementById('stress').addEventListener('click', () => {
  taskManager.takeBreak();
});
