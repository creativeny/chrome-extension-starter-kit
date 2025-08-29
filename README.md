# Chrome Extension Starter

A comprehensive boilerplate for building Chrome extensions with modern features and best practices.

## 🚀 Features

- **Manifest V3** - Latest Chrome extension manifest version
- **Modern UI** - Beautiful popup interface with gradient design
- **Content Scripts** - Interact with web pages
- **Background Service Worker** - Handle extension lifecycle and events
- **Options Page** - Comprehensive settings management
- **Storage Management** - Sync settings across devices
- **Notifications** - User-friendly notification system
- **Context Menus** - Right-click menu integration
- **Domain Management** - Auto-enable features on specific websites
- **Data Export/Import** - Backup and restore settings

## 📁 Project Structure

```
chrome-extension-starter/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.css              # Popup styling
├── popup.js               # Popup functionality
├── content.js             # Content script for web pages
├── content.css            # Content script styles
├── background.js          # Background service worker
├── options.html           # Settings page
├── options.css            # Settings page styling
├── options.js             # Settings page functionality
├── icons/                 # Extension icons
│   └── README.md          # Icon specifications
└── README.md              # This file
```

## 🛠️ Installation & Setup

### 1. Download/Clone the Extension

```bash
git clone <your-repo-url>
cd chrome-extension-starter
```

### 2. Add Icons

Create the following icon files in the `icons/` directory:
- `icon-16.png` (16x16 pixels)
- `icon-32.png` (32x32 pixels)
- `icon-48.png` (48x48 pixels)
- `icon-128.png` (128x128 pixels)

See `icons/README.md` for detailed icon guidelines.

### 3. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the extension directory
4. The extension should now appear in your extensions list

### 4. Test the Extension

- Click the extension icon in the toolbar to open the popup
- Right-click on any webpage to see context menu options
- Navigate to `chrome://extensions/` and click "Details" → "Extension options" to access settings

## 🎯 Customization

### Update Extension Details

Edit `manifest.json` to customize:
- Extension name and description
- Required permissions
- Content script matches
- Web accessible resources

### Modify Popup Interface

- **HTML**: Edit `popup.html` for structure
- **CSS**: Modify `popup.css` for styling  
- **JavaScript**: Update `popup.js` for functionality

### Customize Content Script Behavior

Edit `content.js` to change how the extension interacts with web pages:
- Modify the feature toggle behavior
- Add new page interaction features
- Update the floating indicator design

### Configure Background Script

Modify `background.js` to:
- Add new context menu items
- Handle additional message types
- Implement periodic tasks with alarms
- Add notification logic

### Enhance Options Page

Update the options page (`options.html`, `options.css`, `options.js`) to:
- Add new settings
- Modify the UI layout
- Include additional export/import options

## 🔧 Development Tips

### Debugging

1. **Popup**: Right-click the extension icon → "Inspect popup"
2. **Background Script**: Go to `chrome://extensions/` → "Details" → "Inspect views: background page"
3. **Content Script**: Use browser developer tools on any webpage
4. **Options Page**: Right-click on options page → "Inspect"

### Storage

The extension uses Chrome's sync storage API:
```javascript
// Save data
chrome.storage.sync.set({key: 'value'});

// Read data
chrome.storage.sync.get(['key'], function(result) {
  console.log(result.key);
});
```

### Messaging

Communication between different parts:
```javascript
// From popup/options to content script
chrome.tabs.sendMessage(tabId, {action: 'doSomething'});

// From content script to background
chrome.runtime.sendMessage({action: 'doSomething'});
```

## 📋 Available Permissions

Current permissions in `manifest.json`:
- `storage` - For saving user preferences
- `activeTab` - Access to currently active tab
- `https://*/*` & `http://*/*` - Access to all websites

Add more permissions as needed for your specific use case.

## 🔒 Security Considerations

- Content Security Policy (CSP) is enforced by default
- No inline scripts - all JavaScript is in separate files
- Use `chrome.storage` instead of localStorage for persistence
- Validate all user inputs
- Be mindful of the permissions you request

## 📦 Publishing

Before publishing to Chrome Web Store:

1. **Test thoroughly** across different websites and scenarios
2. **Add proper icons** (replace placeholders in `icons/` directory)
3. **Update manifest** with final name, description, and version
4. **Create promotional images** for the store listing
5. **Review permissions** - only request what you actually need
6. **Test in incognito mode** to ensure proper functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all files are present and properly named
3. Ensure icons are in the correct format and sizes
4. Review the Chrome extension documentation

## 🔗 Useful Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)
- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
- [Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples)

---

Happy extension building! 🎉
