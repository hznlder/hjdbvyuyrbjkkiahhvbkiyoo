# Code Forge - Premium Game Redemption Codes Website

## 🎮 Overview

Code Forge has been completely rebuilt from the ground up with a stunning, game-inspired design that captures the visual essence of **Genshin Impact**, **Honkai: Star Rail**, and **Zenless Zone Zero**. This premium platform provides the latest redemption codes with an exceptional user experience.

## ✨ Key Features

### 🎨 Visual Design
- **Game-Inspired Aesthetics**: Beautiful design inspired by popular HoYoverse games
- **Glassmorphism Effects**: Semi-transparent panels with blur effects
- **Dynamic Backgrounds**: Animated gradients and particle effects
- **Vibrant Color Schemes**: Deep blues/purples with cyan, magenta, and gold accents
- **Smooth Animations**: Hover effects, transitions, and micro-interactions

### 🌓 Dual Theme System
- **Dark Mode**: Deep gradients with neon accents (default)
- **Light Mode**: Clean, bright design with excellent contrast
- **Smooth Transitions**: Seamless switching between themes

### 🔍 Enhanced Search & Filtering
- **Real-time Search**: Instant filtering across codes, games, and descriptions
- **Advanced Filters**: Filter by code type (permanent, temporary, event) and status
- **Smart Results**: Dynamic code count and filtering feedback

### 🎮 Game Integration
- **Three Games Supported**: Genshin Impact, Honkai: Star Rail, Zenless Zone Zero
- **Real-time API**: Fetches latest codes from https://db.hashblen.com/codes
- **NEW Badge System**: Highlights codes added within the last 3 days
- **Last Updated**: Shows when codes were last refreshed

### 🎵 Audio Experience
- **Background Music**: Lo-Fi music for enhanced atmosphere
- **Music Controls**: Easy toggle for background audio
- **Auto-pause**: Pauses when tab is not active

### 📱 Responsive Design
- **Mobile Optimized**: Perfect experience on all devices
- **Touch Friendly**: Enhanced touch targets for mobile users
- **Adaptive Layout**: Flexible grid systems that scale beautifully

### 🚀 Interactive Features
- **Code Copying**: One-click copy with visual feedback
- **Voting System**: Upvote/downvote code validity (UI ready)
- **Report System**: Report expired or invalid codes
- **User Preferences**: Favorite games and notification settings (UI ready)
- **Keyboard Shortcuts**: Ctrl+K for search, number keys for game selection

## 📁 File Structure

```
code-forge-rebuilt/
├── index.html          # Main HTML structure
├── style.css           # Comprehensive CSS styling
├── script.js           # Enhanced JavaScript functionality
├── audio/
│   └── lofi-music.mp3  # Background music file
└── README.md           # This documentation
```

## 🚀 Quick Start

1. **Download**: Extract the zip file to your desired location
2. **Open**: Open `index.html` in a modern web browser
3. **Enjoy**: Experience the premium Code Forge interface

### For Development/Testing:
```bash
# Navigate to the project directory
cd code-forge-rebuilt

# Start a local server (Python 3)
python3 -m http.server 8080

# Or using Node.js
npx http-server -p 8080

# Open in browser
# http://localhost:8080
```

## 🎯 How to Use

### Getting Started
1. **Select a Game**: Click on Genshin Impact, Honkai: Star Rail, or Zenless Zone Zero
2. **Browse Codes**: View all available redemption codes for your selected game
3. **Search**: Use the search bar to find specific codes quickly
4. **Copy Codes**: Click the copy button next to any code
5. **Redeem**: Click "Redeem Code" to go to the official redemption page

### Advanced Features
- **Search**: Type in the search bar to filter codes by name, description, or rewards
- **Filters**: Click the "Filters" button to access advanced filtering options
- **Theme**: Toggle between dark and light modes with the theme button
- **Music**: Enable background music for an enhanced experience
- **Keyboard Shortcuts**:
  - `Ctrl+K` or `Cmd+K`: Focus search bar
  - `1`, `2`, `3`: Quick game selection
  - `Escape`: Clear search when focused

## 🛠 Technical Details

### Technologies Used
- **HTML5**: Semantic structure with accessibility features
- **CSS3**: Modern styling with custom properties and animations
- **JavaScript ES6+**: Modern, efficient functionality
- **Font Awesome**: Icons for enhanced UI
- **Google Fonts**: Montserrat and Roboto for typography

### Browser Support
- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile**: iOS Safari 14+, Chrome Mobile 88+
- **Features**: CSS Grid, Flexbox, Custom Properties, ES6+ JavaScript

### Performance Features
- **Optimized Animations**: Uses transform/opacity for smooth performance
- **Efficient DOM**: Minimal reflows and repaints
- **Lazy Loading**: Content loaded as needed
- **Responsive Images**: Optimized for different screen sizes

## 🎨 Design System

### Color Palette
**Dark Mode:**
- Primary: Electric Cyan (#00d4ff)
- Secondary: Vibrant Magenta (#ff006e)
- Tertiary: Golden Yellow (#ffbe0b)
- Background: Deep gradient (#0a0a0f to #1a0a2e)

**Light Mode:**
- Primary: Deep Blue (#0066cc)
- Secondary: Purple (#8b5cf6)
- Tertiary: Orange (#ff8c00)
- Background: Light gradient (#f8f9ff to #e8f4f8)

### Typography
- **Primary**: Montserrat (headings, UI elements)
- **Secondary**: Roboto (body text, technical content)
- **Hierarchy**: 6 font sizes with proper weight distribution

## 🔧 Customization

### Modifying Colors
Edit the CSS custom properties in `style.css`:
```css
:root {
  --accent-primary: #00d4ff;
  --accent-secondary: #ff006e;
  /* Add your custom colors */
}
```

### Adding New Games
1. Add game data to the API response
2. Update the game filter buttons in HTML
3. Add corresponding CSS styles for the new game

### Extending Functionality
The modular JavaScript architecture makes it easy to add new features:
- User authentication
- Code favorites
- Push notifications
- Advanced analytics

## 📊 API Integration

### Endpoint
- **URL**: `https://db.hashblen.com/codes`
- **Method**: GET
- **Response**: JSON object with game codes

### Data Structure
```json
{
  "genshin": [
    {
      "title": "Code Title",
      "code": "REDEMPTION_CODE",
      "description": "Code description",
      "rewards": "Reward details",
      "link": "https://redemption-url",
      "date": "2025-01-01"
    }
  ]
}
```

## 🚀 Deployment

### Static Hosting
Perfect for deployment on:
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Free hosting for public repos
- **Firebase Hosting**: Google's hosting platform

### CDN Integration
For production, consider:
- Cloudflare for global CDN
- Image optimization services
- Font loading optimization

## 🔒 Security & Privacy

- **No Data Collection**: Website doesn't collect personal data
- **External Links**: All redemption links go to official game sites
- **Ad Integration**: Only non-intrusive Ezmob ads as requested
- **HTTPS Ready**: Designed for secure connections

## 🆘 Support & Maintenance

### Common Issues
1. **Music Not Playing**: Requires user interaction to start
2. **API Errors**: Check internet connection and API status
3. **Theme Not Saving**: Ensure localStorage is enabled

### Updates
- **Automatic**: Code data updates automatically from API
- **Manual**: Download new versions for feature updates

## 📈 Future Enhancements

### Planned Features
- Push notifications for new codes
- User accounts and preferences
- Community code verification
- Mobile app versions
- Advanced analytics dashboard

### Community Features (UI Ready)
- Code voting system
- User comments and discussions
- Community-driven code validation
- Social sharing integration

## 🙏 Credits & Acknowledgments

### Original Creator
- **izzaaal**: Original Code Forge concept and community building

### Design Inspiration
- **HoYoverse Games**: Visual inspiration from Genshin Impact, Honkai: Star Rail, and Zenless Zone Zero
- **Gaming Community**: Feedback and feature requests

### Technical Resources
- **Font Awesome**: Icon library
- **Google Fonts**: Typography
- **Modern Web Standards**: HTML5, CSS3, ES6+

## 📄 License

This project is created for the gaming community. Please respect the original creator's work and the game companies' intellectual property.

---

**Enjoy your premium Code Forge experience! 🎮✨**

For support or questions, refer to the original social media links in the website footer.

