// Popup script for Chrome Extension
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const toggleFeatureBtn = document.getElementById('toggleFeature');
  const getCurrentTabBtn = document.getElementById('getCurrentTab');
  const enableNotificationsToggle = document.getElementById('enableNotifications');
  const openOptionsBtn = document.getElementById('openOptions');
  const statusDiv = document.getElementById('status');

  // Load saved settings
  loadSettings();

  // Event listeners
  toggleFeatureBtn.addEventListener('click', handleToggleFeature);
  getCurrentTabBtn.addEventListener('click', handleGetCurrentTab);
  enableNotificationsToggle.addEventListener('change', handleNotificationToggle);
  openOptionsBtn.addEventListener('click', handleOpenOptions);

  // Load settings from storage
  function loadSettings() {
    chrome.storage.sync.get(['enableNotifications', 'featureEnabled'], function(data) {
      enableNotificationsToggle.checked = data.enableNotifications || false;
      updateStatus(data.featureEnabled ? 'Feature Enabled' : 'Feature Disabled');
    });
  }

  // Toggle main feature
  function handleToggleFeature() {
    chrome.storage.sync.get(['featureEnabled'], function(data) {
      const newState = !data.featureEnabled;
      chrome.storage.sync.set({ featureEnabled: newState }, function() {
        updateStatus(newState ? 'Feature Enabled' : 'Feature Disabled');
        
        // Send message to content script
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'toggleFeature',
            enabled: newState
          });
        });
      });
    });
  }

  // Get current tab information
  function handleGetCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTab = tabs[0];
      updateStatus(`Current: ${currentTab.title.substring(0, 30)}...`);
      
      // Optional: Send message to background script
      chrome.runtime.sendMessage({
        action: 'getCurrentTab',
        tabInfo: {
          id: currentTab.id,
          url: currentTab.url,
          title: currentTab.title
        }
      });
    });
  }

  // Handle notification toggle
  function handleNotificationToggle() {
    const enabled = enableNotificationsToggle.checked;
    chrome.storage.sync.set({ enableNotifications: enabled }, function() {
      console.log('Notifications', enabled ? 'enabled' : 'disabled');
    });
  }

  // Open options page
  function handleOpenOptions() {
    chrome.runtime.openOptionsPage();
  }

  // Update status display
  function updateStatus(message) {
    statusDiv.textContent = message;
    statusDiv.className = 'status';
    
    // Add visual feedback
    statusDiv.style.background = '#e8f5e8';
    statusDiv.style.color = '#2d5a2d';
    
    setTimeout(() => {
      statusDiv.style.background = '#f8f9fa';
      statusDiv.style.color = '#666';
    }, 2000);
  }

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'updateStatus') {
      updateStatus(message.status);
    }
  });
});
