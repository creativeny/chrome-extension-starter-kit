// Background service worker for Chrome Extension
chrome.runtime.onInstalled.addListener(function(details) {
  console.log('Chrome Extension Starter installed');
  
  // Initialize default settings
  chrome.storage.sync.set({
    featureEnabled: false,
    enableNotifications: true,
    installDate: new Date().toISOString()
  });

  // Create context menu items
  createContextMenus();
  
  // Show welcome notification
  if (details.reason === 'install') {
    showNotification('Welcome!', 'Chrome Extension Starter has been installed successfully.');
  } else if (details.reason === 'update') {
    showNotification('Updated!', 'Chrome Extension Starter has been updated to the latest version.');
  }
});

// Handle extension startup
chrome.runtime.onStartup.addListener(function() {
  console.log('Chrome Extension Starter started');
});

// Create context menu items
function createContextMenus() {
  chrome.contextMenus.create({
    id: 'toggleFeature',
    title: 'Toggle Extension Feature',
    contexts: ['page', 'selection']
  });
  
  chrome.contextMenus.create({
    id: 'separator1',
    type: 'separator',
    contexts: ['page', 'selection']
  });
  
  chrome.contextMenus.create({
    id: 'openOptions',
    title: 'Extension Options',
    contexts: ['page']
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  switch (info.menuItemId) {
    case 'toggleFeature':
      toggleFeature(tab);
      break;
    case 'openOptions':
      chrome.runtime.openOptionsPage();
      break;
  }
});

// Toggle feature function
function toggleFeature(tab) {
  chrome.storage.sync.get(['featureEnabled'], function(data) {
    const newState = !data.featureEnabled;
    chrome.storage.sync.set({ featureEnabled: newState }, function() {
      // Send message to content script
      chrome.tabs.sendMessage(tab.id, {
        action: 'toggleFeature',
        enabled: newState
      });
      
      // Show notification
      showNotification(
        'Feature ' + (newState ? 'Enabled' : 'Disabled'),
        'Extension feature has been ' + (newState ? 'enabled' : 'disabled') + ' on this page.'
      );
    });
  });
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.action) {
    case 'pageLoaded':
      console.log('Page loaded:', message.url);
      handlePageLoad(message, sender.tab);
      sendResponse({ success: true });
      break;
      
    case 'getCurrentTab':
      console.log('Current tab info:', message.tabInfo);
      sendResponse({ success: true });
      break;
      
    case 'showNotification':
      showNotification(message.title, message.message);
      sendResponse({ success: true });
      break;
      
    default:
      sendResponse({ error: 'Unknown action' });
  }
});

// Handle page load events
function handlePageLoad(pageInfo, tab) {
  // Log page visits for analytics (if needed)
  console.log(`Page visited: ${pageInfo.title} - ${pageInfo.url}`);
  
  // You can add custom logic here for specific domains
  const domain = new URL(pageInfo.url).hostname;
  
  // Example: Special handling for certain websites
  if (domain.includes('github.com')) {
    console.log('GitHub page detected');
    // Add GitHub-specific functionality
  }
}

// Show notification function
function showNotification(title, message) {
  chrome.storage.sync.get(['enableNotifications'], function(data) {
    if (data.enableNotifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon-48.png',
        title: title,
        message: message
      });
    }
  });
}

// Handle notification clicks
chrome.notifications.onClicked.addListener(function(notificationId) {
  console.log('Notification clicked:', notificationId);
  chrome.notifications.clear(notificationId);
});

// Handle tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url) {
    // Tab finished loading
    console.log('Tab updated:', tab.url);
    
    // You can inject scripts or perform actions here
    // Example: Auto-enable feature on specific domains
    chrome.storage.sync.get(['autoEnableDomains'], function(data) {
      const autoEnableDomains = data.autoEnableDomains || [];
      const domain = new URL(tab.url).hostname;
      
      if (autoEnableDomains.includes(domain)) {
        chrome.tabs.sendMessage(tabId, {
          action: 'toggleFeature',
          enabled: true
        });
      }
    });
  }
});

// Handle storage changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.log('Storage changed:', changes);
  
  // React to storage changes
  for (let key in changes) {
    const change = changes[key];
    console.log(`Storage key "${key}" changed from "${change.oldValue}" to "${change.newValue}"`);
  }
});

// Alarm handling (for periodic tasks)
chrome.alarms.onAlarm.addListener(function(alarm) {
  console.log('Alarm triggered:', alarm.name);
  
  switch (alarm.name) {
    case 'dailyCleanup':
      performDailyCleanup();
      break;
  }
});

// Set up periodic alarms
chrome.runtime.onInstalled.addListener(function() {
  // Create a daily cleanup alarm
  chrome.alarms.create('dailyCleanup', {
    delayInMinutes: 1440, // 24 hours
    periodInMinutes: 1440
  });
});

// Daily cleanup function
function performDailyCleanup() {
  console.log('Performing daily cleanup...');
  
  // Clear old data, update statistics, etc.
  chrome.storage.local.clear(function() {
    console.log('Local storage cleared');
  });
}

// Handle extension icon click (when no popup is defined)
chrome.action.onClicked.addListener(function(tab) {
  // This won't be called if popup is defined in manifest
  console.log('Extension icon clicked');
});

// Keep service worker alive (if needed for long-running tasks)
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();
