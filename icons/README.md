# Chrome Extension Icons

This directory should contain the following icon files for your Chrome extension:

## Required Icon Sizes

- **icon-16.png** - 16x16 pixels (toolbar icon)
- **icon-32.png** - 32x32 pixels (Windows computers often require this size)
- **icon-48.png** - 48x48 pixels (extension management page)
- **icon-128.png** - 128x128 pixels (Chrome Web Store and installation)

## Icon Guidelines

1. **Format**: PNG format with transparency support
2. **Style**: Simple, recognizable design that works at small sizes
3. **Colors**: Use your brand colors, ensure good contrast
4. **Content**: Avoid text in icons (use symbols/graphics instead)
5. **Consistency**: All sizes should be visually consistent

## Creating Icons

You can create icons using:
- **Chrome Extension Icon Generator**: [icon128.com](https://icon128.com/) - Fast, clean icon generation specifically for Chrome extensions
- **Online tools**: Favicon generators, Canva, Figma
- **Design software**: Adobe Illustrator, Photoshop, GIMP
- **Icon libraries**: Heroicons, Feather Icons, Material Icons

## Quick Start

For development/testing, you can use placeholder icons:
1. Create simple colored squares in each required size
2. Use online favicon generators to create multiple sizes from one image
3. Replace with professional icons before publishing

## File Structure
```
icons/
├── icon-16.png
├── icon-32.png
├── icon-48.png
└── icon-128.png
```

Once you have your icon files, simply place them in this directory and they will be automatically used by the extension.
