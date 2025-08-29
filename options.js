// Options page script
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const featureEnabledToggle = document.getElementById('featureEnabled');
  const enableNotificationsToggle = document.getElementById('enableNotifications');
  const autoEnableFeatureToggle = document.getElementById('autoEnableFeature');
  const domainInput = document.getElementById('domainInput');
  const addDomainBtn = document.getElementById('addDomain');
  const domainList = document.getElementById('domainList');
  const themeSelect = document.getElementById('themeSelect');
  const badgePositionSelect = document.getElementById('badgePosition');
  const exportDataBtn = document.getElementById('exportData');
  const importDataBtn = document.getElementById('importData');
  const importFileInput = document.getElementById('importFile');
  const clearDataBtn = document.getElementById('clearData');
  const resetDefaultsBtn = document.getElementById('resetDefaults');
  const statusDiv = document.getElementById('status');
  const versionSpan = document.getElementById('version');
  const installDateSpan = document.getElementById('installDate');
  const lastUpdatedSpan = document.getElementById('lastUpdated');

  // Initialize the options page
  init();

  function init() {
    loadSettings();
    setupEventListeners();
    updateVersionInfo();
  }

  // Load settings from storage
  function loadSettings() {
    chrome.storage.sync.get([
      'featureEnabled',
      'enableNotifications',
      'autoEnableFeature',
      'autoEnableDomains',
      'theme',
      'badgePosition',
      'installDate'
    ], function(data) {
      featureEnabledToggle.checked = data.featureEnabled || false;
      enableNotificationsToggle.checked = data.enableNotifications !== false; // Default true
      autoEnableFeatureToggle.checked = data.autoEnableFeature || false;
      themeSelect.value = data.theme || 'auto';
      badgePositionSelect.value = data.badgePosition || 'top-right';
      
      updateDomainList(data.autoEnableDomains || []);
      showStatus('Settings loaded', 'success');
    });
  }

  // Setup event listeners
  function setupEventListeners() {
    // Toggle listeners
    featureEnabledToggle.addEventListener('change', saveSettings);
    enableNotificationsToggle.addEventListener('change', saveSettings);
    autoEnableFeatureToggle.addEventListener('change', saveSettings);
    
    // Select listeners
    themeSelect.addEventListener('change', saveSettings);
    badgePositionSelect.addEventListener('change', saveSettings);
    
    // Domain management
    addDomainBtn.addEventListener('click', addDomain);
    domainInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        addDomain();
      }
    });
    
    // Data management
    exportDataBtn.addEventListener('click', exportData);
    importDataBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', importData);
    clearDataBtn.addEventListener('click', clearAllData);
    resetDefaultsBtn.addEventListener('click', resetToDefaults);
  }

  // Save settings to storage
  function saveSettings() {
    const settings = {
      featureEnabled: featureEnabledToggle.checked,
      enableNotifications: enableNotificationsToggle.checked,
      autoEnableFeature: autoEnableFeatureToggle.checked,
      theme: themeSelect.value,
      badgePosition: badgePositionSelect.value
    };

    chrome.storage.sync.set(settings, function() {
      showStatus('Settings saved', 'success');
      console.log('Settings saved:', settings);
    });
  }

  // Add domain to auto-enable list
  function addDomain() {
    const domain = domainInput.value.trim().toLowerCase();
    
    if (!domain) {
      showStatus('Please enter a domain', 'error');
      return;
    }

    // Basic domain validation
    if (!isValidDomain(domain)) {
      showStatus('Please enter a valid domain', 'error');
      return;
    }

    chrome.storage.sync.get(['autoEnableDomains'], function(data) {
      const domains = data.autoEnableDomains || [];
      
      if (domains.includes(domain)) {
        showStatus('Domain already exists', 'warning');
        return;
      }

      domains.push(domain);
      chrome.storage.sync.set({ autoEnableDomains: domains }, function() {
        updateDomainList(domains);
        domainInput.value = '';
        showStatus('Domain added', 'success');
      });
    });
  }

  // Remove domain from auto-enable list
  function removeDomain(domain) {
    chrome.storage.sync.get(['autoEnableDomains'], function(data) {
      const domains = data.autoEnableDomains || [];
      const filteredDomains = domains.filter(d => d !== domain);
      
      chrome.storage.sync.set({ autoEnableDomains: filteredDomains }, function() {
        updateDomainList(filteredDomains);
        showStatus('Domain removed', 'success');
      });
    });
  }

  // Update domain list display
  function updateDomainList(domains) {
    domainList.innerHTML = '';
    
    domains.forEach(domain => {
      const domainTag = document.createElement('div');
      domainTag.className = 'domain-tag';
      domainTag.innerHTML = `
        <span>${domain}</span>
        <span class="remove" data-domain="${domain}">×</span>
      `;
      
      domainTag.querySelector('.remove').addEventListener('click', function() {
        removeDomain(this.dataset.domain);
      });
      
      domainList.appendChild(domainTag);
    });
  }

  // Validate domain format
  function isValidDomain(domain) {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
    return domainRegex.test(domain);
  }

  // Export settings data
  function exportData() {
    chrome.storage.sync.get(null, function(data) {
      const exportData = {
        ...data,
        exportDate: new Date().toISOString(),
        version: chrome.runtime.getManifest().version
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `chrome-extension-settings-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      showStatus('Settings exported', 'success');
    });
  }

  // Import settings data
  function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validate imported data
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid data format');
        }

        // Remove metadata fields
        delete data.exportDate;
        delete data.version;
        delete data.installDate;

        chrome.storage.sync.set(data, function() {
          loadSettings();
          showStatus('Settings imported successfully', 'success');
        });
      } catch (error) {
        showStatus('Invalid file format', 'error');
        console.error('Import error:', error);
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  }

  // Clear all data
  function clearAllData() {
    if (confirm('Are you sure you want to clear all extension data? This action cannot be undone.')) {
      chrome.storage.sync.clear(function() {
        chrome.storage.local.clear(function() {
          // Reset to defaults
          resetToDefaults();
          showStatus('All data cleared', 'success');
        });
      });
    }
  }

  // Reset to default settings
  function resetToDefaults() {
    const defaults = {
      featureEnabled: false,
      enableNotifications: true,
      autoEnableFeature: false,
      autoEnableDomains: [],
      theme: 'auto',
      badgePosition: 'top-right',
      installDate: new Date().toISOString()
    };

    chrome.storage.sync.set(defaults, function() {
      loadSettings();
      showStatus('Settings reset to defaults', 'success');
    });
  }

  // Update version information
  function updateVersionInfo() {
    const manifest = chrome.runtime.getManifest();
    versionSpan.textContent = manifest.version;
    
    chrome.storage.sync.get(['installDate'], function(data) {
      if (data.installDate) {
        const installDate = new Date(data.installDate);
        installDateSpan.textContent = installDate.toLocaleDateString();
      }
    });
    
    lastUpdatedSpan.textContent = new Date().toLocaleDateString();
  }

  // Show status message
  function showStatus(message, type = 'success') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    
    // Clear status after 3 seconds
    setTimeout(() => {
      statusDiv.textContent = 'Settings saved automatically';
      statusDiv.className = 'status';
    }, 3000);
  }

  // Listen for storage changes
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log('Storage changed:', changes);
    // Optionally reload settings if changed externally
  });
});
