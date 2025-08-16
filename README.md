# Stopwatch Web Application

A feature-rich, responsive stopwatch web application built with HTML, CSS, and JavaScript. This application provides precise time measurement with lap tracking functionality and an intuitive user interface.

## Features

### Core Functionality
- **Start/Pause/Resume**: Control the stopwatch with precision timing
- **Reset**: Reset the stopwatch to 00:00:00
- **Lap Times**: Record multiple lap times while the stopwatch is running
- **Clear Laps**: Remove all recorded lap times

### Advanced Features
- **Keyboard Shortcuts**: 
  - `Space` - Start/Pause the stopwatch
  - `Ctrl+R` - Reset the stopwatch
  - `L` - Record a lap time (when running)
- **Export Functionality**: Download lap times as a CSV file
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Visual Feedback**: Smooth animations and hover effects
- **Auto-scroll**: Latest lap times are automatically visible

### Technical Features
- **High Precision**: Updates every 10ms for accurate time measurement
- **Memory Efficient**: Optimized for long-running sessions
- **Cross-browser Compatible**: Works on all modern browsers
- **Accessibility**: Keyboard navigation support

## File Structure

```
PRODIGY_WD_02/
├── index.html      # Main HTML structure
├── style.css       # Styling and responsive design
├── script.js       # JavaScript functionality
├── README.md       # Documentation
└── LICENSE         # License file
```

## How to Use

1. **Open the Application**: Open `index.html` in any modern web browser
2. **Start Timing**: Click the "Start" button or press `Space`
3. **Record Laps**: While running, click "Lap" or press `L` to record lap times
4. **Pause/Resume**: Click "Pause" or press `Space` to pause/resume
5. **Reset**: Click "Reset" or press `Ctrl+R` to reset everything
6. **Export Data**: Click "Download Lap Times" to export lap data as CSV

## Technical Implementation

### HTML Structure
- Semantic HTML5 elements for accessibility
- Clean, organized structure with proper IDs and classes
- Responsive viewport meta tag for mobile compatibility

### CSS Features
- **Flexbox Layout**: For responsive button arrangement
- **CSS Grid**: For precise time display formatting
- **CSS Variables**: For consistent theming
- **Gradient Backgrounds**: Modern visual design
- **Media Queries**: Responsive design for all screen sizes
- **Custom Scrollbars**: Enhanced user experience
- **Animations**: Smooth transitions and hover effects

### JavaScript Functionality
- **Object-Oriented Design**: Stopwatch class for clean code organization
- **Event-Driven Architecture**: Efficient event handling
- **High-Resolution Timing**: Using `Date.now()` for precision
- **Local State Management**: Efficient memory usage
- **Error Handling**: Robust error prevention
- **Export Functionality**: CSV download capability

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Opera 47+

## Performance

- **Memory Usage**: Optimized for minimal memory footprint
- **CPU Usage**: Efficient 10ms update intervals
- **Load Time**: Fast initial load with optimized assets
- **Responsiveness**: Smooth 60fps animations

## Customization

### Colors and Themes
Modify the CSS custom properties in `style.css`:
```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --danger-color: #e74c3c;
    --warning-color: #f39c12;
}
```

### Timing Precision
Adjust the update interval in `script.js`:
```javascript
this.timerInterval = setInterval(() => this.updateDisplay(), 10); // 10ms = 0.01s precision
```

### Button Styles
Customize button appearance in the `.btn` class in `style.css`.

## Development

### Local Development
1. Clone the repository
2. Open `index.html` in a web browser
3. No build process required - pure HTML/CSS/JS

### Code Organization
- **Separation of Concerns**: HTML structure, CSS styling, JS functionality
- **Modular Design**: Class-based JavaScript architecture
- **Clean Code**: Well-commented and documented
- **Best Practices**: Following web development standards

## Future Enhancements

- [ ] Sound notifications for lap recording
- [ ] Different timer modes (countdown, interval timer)
- [ ] Data persistence with localStorage
- [ ] Multiple stopwatch instances
- [ ] Customizable themes
- [ ] Split time calculations
- [ ] Statistics and analytics

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Credits

Developed as part of the PRODIGY Web Development internship program.

---

**Enjoy using the Stopwatch Web Application!** 🕐
