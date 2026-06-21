# 🌱 EcoStep - Carbon Footprint Calculator

Track your environmental impact with EcoStep, a modern web application that helps you calculate, understand, and reduce your carbon footprint.

## ✨ Features

### 🔐 **Authentication**
- Google Sign-In integration via Firebase
- Secure user session management
- One-click authentication

### 📊 **Advanced Calculator**
- 6 emission categories (electricity, transport, diet, waste, heating, water)
- Real-time calculation breakdown
- Visual charts and comparisons
- Personalized reduction tips

### 📈 **History & Analytics**
- Track all your calculations
- View trends over time
- Monthly statistics
- Emission charts and pie graphs

### 🏆 **Gamified Challenges**
- 6 eco-friendly challenges
- Difficulty levels and reward points
- Progress tracking
- Actionable tips for each challenge

### 🎨 **Beautiful UI**
- Responsive design (mobile, tablet, desktop)
- Green-focused color scheme
- Educational content about climate change
- Real-world examples and comparisons

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Firebase account (already configured)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Complete Setup Guide

For detailed setup instructions including Firebase configuration, see **[SETUP.md](SETUP.md)**

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup & deployment guide
- **[FIREBASE_SCHEMA.md](FIREBASE_SCHEMA.md)** - Database schema & security rules
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Feature details & file structure

## 🏗️ Architecture

### Frontend
- **Framework:** Next.js 16+ (React 19)
- **Styling:** Tailwind CSS 4
- **Charts:** Recharts
- **Forms:** React Hook Form

### Backend
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Google OAuth)
- **Hosting:** Firebase Hosting / Vercel

### Key Components
- `CalculatorForm` - Multi-factor emissions calculator
- `ResultCard` - Breakdown & visualizations
- `HistoryDashboard` - User statistics & trends
- `ChallengesList` - Gamified challenges

## 📋 Pages

| Page | Public | Auth Required | Purpose |
|------|--------|---------------|---------|
| `/` | ✅ | ❌ | Home with educational content |
| `/calculator` | ✅ | ❌ | Calculate carbon footprint |
| `/auth/login` | ✅ | ❌ | Google Sign-In |
| `/history` | ❌ | ✅ | View calculation history |
| `/challenges` | ❌ | ✅ | Complete eco challenges |

## 🔒 Security

- Firebase authentication with Google OAuth 2.0
- Firestore security rules for data protection
- User-specific data access control
- Confirmation dialogs for sensitive actions

## 📊 Emission Factors

The calculator uses scientifically-backed emission factors:

```
Electricity:    0.4 kg CO₂/kWh
Car (small):    0.12 kg CO₂/km
Car (medium):   0.22 kg CO₂/km
Car (large):    0.4 kg CO₂/km
Public Transit: 0.05 kg CO₂/km
Flight:         0.25 kg CO₂/km
Meat Serving:   4 kg CO₂
Vegan Day:      -2 kg CO₂ offset
Waste:          0.5 kg CO₂/kg (after recycling)
Water:          0.0003 kg CO₂/liter
```

## 🎯 How It Works

1. **Sign In:** User logs in with Google account
2. **Calculate:** User enters their consumption data
3. **Analyze:** System calculates emissions with breakdown
4. **Track:** Results saved to user's history
5. **Improve:** User follows tips to reduce emissions
6. **Challenge:** Participate in eco challenges for rewards

## 🌱 Environmental Impact

- Shows real-world comparisons (e.g., plastic bottles = CO₂)
- Global average comparison (4 metric tons/year)
- Tree planting equivalents
- Actionable reduction strategies

## 🚀 Deployment

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Vercel
Connect your GitHub repository to Vercel for automatic deployments.

See [SETUP.md](SETUP.md) for detailed deployment instructions.

## 🐛 Troubleshooting

See [SETUP.md](SETUP.md) troubleshooting section for common issues.

## 📞 Support

- **Firebase Issues:** [Firebase Docs](https://firebase.google.com/docs)
- **Next.js Help:** [Next.js Docs](https://nextjs.org/docs)
- **Chart Issues:** [Recharts Docs](https://recharts.org)

## 📈 Future Features

- User profiles & settings
- Share results with friends
- Carbon offset marketplace
- Community leaderboards
- Mobile app
- Real-time notifications
- Advanced analytics
- Smart home integration

## 💚 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Firebase for auth & database
- Next.js for the framework
- Recharts for visualizations
- Tailwind CSS for styling
- Environmental data from EPA and IPCC

---

**Made with 💚 to help people reduce their carbon footprint and protect our planet.**

[Get Started Now →](SETUP.md)

