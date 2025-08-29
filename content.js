// Content script - runs in the context of web pages
(function() {
  'use strict';

  // Extension state
  let extensionEnabled = false;
  let extensionElement = null;

  // Initialize the extension
  init();

  function init() {
    console.log('Chrome Extension Starter - Content script loaded');
    
    // Load settings from storage
    chrome.storage.sync.get(['featureEnabled'], function(data) {
      extensionEnabled = data.featureEnabled || false;
      if (extensionEnabled) {
        enableFeature();
      }
    });

    // Listen for messages from popup or background script
    chrome.runtime.onMessage.addListener(handleMessage);
    
    // Listen for storage changes
    chrome.storage.onChanged.addListener(handleStorageChange);
  }

  // Handle messages from popup/background
  function handleMessage(message, sender, sendResponse) {
    switch (message.action) {
      case 'toggleFeature':
        extensionEnabled = message.enabled;
        if (extensionEnabled) {
          enableFeature();
        } else {
          disableFeature();
        }
        sendResponse({ success: true });
        break;
        
      case 'getPageInfo':
        sendResponse({
          title: document.title,
          url: window.location.href,
          domain: window.location.hostname
        });
        break;
        
      default:
        sendResponse({ error: 'Unknown action' });
    }
  }

  // Handle storage changes
  function handleStorageChange(changes, namespace) {
    if (namespace === 'sync' && changes.featureEnabled) {
      extensionEnabled = changes.featureEnabled.newValue;
      if (extensionEnabled) {
        enableFeature();
      } else {
        disableFeature();
      }
    }
  }

  // Enable the main feature
  function enableFeature() {
    if (extensionElement) return; // Already enabled

    // Create a floating indicator
    extensionElement = document.createElement('div');
    extensionElement.id = 'chrome-extension-indicator';
    extensionElement.innerHTML = `
      <div class="extension-badge">
        <span>✨ Extension Active</span>
        <button class="close-btn">×</button>
      </div>
    `;
    
    document.body.appendChild(extensionElement);

    // Add event listener to close button
    const closeBtn = extensionElement.querySelector('.close-btn');
    closeBtn.addEventListener('click', disableFeature);

    // Example: Highlight all links on the page
    highlightLinks();

    console.log('Extension feature enabled');
  }

  // Disable the main feature
  function disableFeature() {
    if (extensionElement) {
      extensionElement.remove();
      extensionElement = null;
    }

    // Remove link highlighting
    removeHighlighting();

    // Update storage
    chrome.storage.sync.set({ featureEnabled: false });

    console.log('Extension feature disabled');
  }

  // Example feature: Highlight all links
  function highlightLinks() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.classList.add('extension-highlighted-link');
    });
  }

  // Remove link highlighting
  function removeHighlighting() {
    const links = document.querySelectorAll('.extension-highlighted-link');
    links.forEach(link => {
      link.classList.remove('extension-highlighted-link');
    });
  }

  // Utility function to inject custom styles
  function injectStyles() {
    if (document.getElementById('extension-custom-styles')) return;

    const style = document.createElement('style');
    style.id = 'extension-custom-styles';
    style.textContent = `
      .extension-highlighted-link {
        background-color: #fff3cd !important;
        border: 1px solid #ffeaa7 !important;
        border-radius: 3px !important;
        padding: 1px 3px !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize styles
  injectStyles();

  // Send page load event to background script
  chrome.runtime.sendMessage({
    action: 'pageLoaded',
    url: window.location.href,
    title: document.title
  });

})();
