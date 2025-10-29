# Onboarding Flow Documentation

## Overview

The Doomscroll app includes an intuitive 4-screen onboarding flow that introduces new users to the core features of the application.

## Features

### ✨ Onboarding Screens

1. **Break Free from Doomscrolling**
   - Icon: Phone outline
   - Color: Green (#22c55e)
   - Message: Take control of your screen time and build healthier digital habits

2. **Join Challenges, Win Rewards**
   - Icon: Trophy
   - Color: Yellow (#eab308)
   - Message: Compete with others to reduce social media usage and earn SOL

3. **Track Your Progress**
   - Icon: Stats chart
   - Color: Blue (#3b82f6)
   - Message: Monitor your screen time across Instagram, Twitter, Reddit, and TikTok

4. **Connect Your Wallet**
   - Icon: Wallet
   - Color: Purple (#a855f7)
   - Message: Use your Solana wallet to join challenges and collect winnings

### 🎯 User Experience

- **Skip Button**: Users can skip the onboarding at any time
- **Back Button**: Navigate to previous screens (except on first screen)
- **Progress Indicators**:
  - Animated dots showing current page
  - Page counter (e.g., "1 of 4")
- **Smooth Transitions**: Clean page transitions
- **Persistent State**: Onboarding completion is saved using AsyncStorage

## Implementation

### Files Created

```
client/
├── src/
│   ├── screens/
│   │   └── onboarding/
│   │       └── OnboardingScreen.tsx
│   └── hooks/
│       └── useOnboarding.ts
```

### Key Components

#### 1. **OnboardingScreen.tsx**

Main onboarding component with:

- 4 informative screens
- Navigation controls (Skip, Back, Next)
- Progress indicators
- Poppins font integration
- Consistent dark theme

#### 2. **useOnboarding.ts**

Custom hook for managing onboarding state:

- `isOnboarded`: Boolean indicating if user completed onboarding
- `isLoading`: Loading state while checking AsyncStorage
- `completeOnboarding()`: Marks onboarding as complete
- `resetOnboarding()`: Resets onboarding (for testing/debugging)

### Integration

The onboarding flow is integrated into `App.tsx`:

```typescript
const { isOnboarded, isLoading, completeOnboarding } = useOnboarding();

// Show onboarding if user hasn't completed it
if (!isOnboarded) {
  return <OnboardingScreen onComplete={completeOnboarding} />;
}

// Otherwise show main app
return <AppStack />;
```

## Testing

### Reset Onboarding

For testing purposes, a "Reset Onboarding" option has been added to the Profile screen:

1. Navigate to **Profile** tab
2. Scroll to **Settings** section
3. Tap **Reset Onboarding**
4. Confirm the action
5. Restart the app to see onboarding again

### Manual Reset

You can also reset onboarding programmatically:

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

await AsyncStorage.removeItem("hasCompletedOnboarding");
```

## Customization

### Adding More Screens

To add additional onboarding screens, edit `OnboardingScreen.tsx`:

```typescript
const pages: OnboardingPage[] = [
  // ... existing pages
  {
    icon: "your-icon-name",
    title: "Your Title",
    description: "Your description",
    color: "#hexcolor",
  },
];
```

### Changing Colors

Each screen has its own accent color. Update the `color` property in the `pages` array.

### Modifying Text

Update the `title` and `description` fields for each page to customize the messaging.

## Best Practices

1. **Keep it Short**: 4-5 screens maximum
2. **Clear Value Proposition**: Each screen should explain a key benefit
3. **Visual Hierarchy**: Use consistent fonts (Poppins) and colors
4. **Easy Exit**: Always provide a Skip button
5. **Progress Feedback**: Show users where they are in the flow

## AsyncStorage Key

The onboarding completion status is stored in AsyncStorage with the key:

```
hasCompletedOnboarding
```

Value: `"true"` when completed, `null` when not completed.

## Future Enhancements

Potential improvements for the onboarding flow:

- [ ] Add illustrations/images for each screen
- [ ] Implement swipe gestures for navigation
- [ ] Add animations with react-native-reanimated
- [ ] Include a "Connect Wallet" button on final screen
- [ ] Add tutorial overlays for first-time app usage
- [ ] Implement A/B testing for different onboarding flows
- [ ] Add analytics tracking for onboarding completion rates

## Troubleshooting

### Onboarding doesn't show

- Check AsyncStorage value: `await AsyncStorage.getItem('hasCompletedOnboarding')`
- Use the Reset Onboarding feature in Profile
- Clear app data and restart

### Onboarding shows on every launch

- Check that `completeOnboarding()` is called properly
- Verify AsyncStorage permissions
- Check for AsyncStorage errors in console

---

**Last Updated**: January 2024
