# Stock Investment Calculator

A lightweight web-based calculator for stock investment estimates that runs entirely in the browser without requiring any database or backend services.

## Features

- **Investment Calculations**: Calculate total shares, investment amounts, and profit/loss scenarios
- **Dynamic Ticker Management**: Add and remove custom ticker symbols
- **Auto-calculation**: Automatically calculates missing values (shares/investment amount) based on inputs
- **Profit/Loss Analysis**: Visual indicators for gains and losses with color coding
- **Multiple Investments**: Support for calculating multiple investment positions simultaneously
- **Local Storage**: Saves your custom ticker symbols in browser storage for convenience
- **Responsive Design**: Works on desktop and mobile devices

## Live Demo

This application can be deployed to any static hosting service such as:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront

## Getting Started

### Running Locally

1. Clone the repository:
```bash
git clone https://github.com/ncgautomate/StockEstimateApp.git
cd StockEstimateApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
# or for development
npm run dev
```

4. Open your browser and navigate to `http://localhost:5000`

### Deployment

Since this is a pure client-side application, you can deploy it to any static hosting service:

#### Deploy to Netlify
1. Upload the `public` folder to Netlify
2. Your app will be live immediately

#### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

#### Deploy to GitHub Pages
1. Push your code to GitHub
2. Go to Settings > Pages
3. Set source to the `public` folder

## How to Use

1. **Manage Ticker Symbols**: Add custom ticker symbols (like BTC, ETH, AAPL) using the management section
2. **Enter Investment Data**: 
   - Buy price per share
   - Either total shares OR investment amount (the other will be calculated automatically)
   - Select ticker symbol
   - Optionally enter sell price for profit/loss calculation
3. **Add Multiple Investments**: Use "Add Investment" to calculate multiple positions
4. **Calculate**: Click "Calculate" to see results including total investment, shares, and profit/loss
5. **Clear**: Use "Clear Form" to reset all inputs

## Technical Details

- **Pure HTML/CSS/JavaScript**: No frameworks or build tools required
- **No Database**: All data is calculated in real-time, with ticker symbols saved to localStorage
- **Lightweight**: Fast loading with minimal dependencies
- **Browser Compatible**: Works in all modern browsers

## What Changed from Original

This application was refactored from a Firebase-based app to a lightweight calculator:
- ❌ Removed Firebase/Firestore dependencies
- ❌ Removed persistent calculation history
- ✅ Added localStorage for ticker symbols
- ✅ Kept all core calculation functionality
- ✅ Added "Clear Form" functionality
- ✅ Simplified deployment (works anywhere)
- ✅ Faster loading without external SDKs

## License

MIT License
