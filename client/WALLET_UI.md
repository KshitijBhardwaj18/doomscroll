# Wallet UI Components

## Overview

The app now has a consistent wallet connection UI across all screens with a dropdown menu for wallet management.

## Components

### 1. **WalletButton** (`src/components/wallet/WalletButton.tsx`)

An interactive button that shows wallet connection status and provides menu access.

**States:**

- **Not Connected**: Lime green "Connect" button with wallet icon
- **Connected**: Gray pill showing wallet address with green dot indicator and chevron

**Features:**

- Uses `useAuthorization` and `useMobileWallet` hooks
- Matches app's design scheme (Poppins fonts, lime green accent)
- Auto-updates when wallet connection state changes
- **Click-to-open menu** with:
  - Full wallet address display (6 char ellipsification)
  - Copy address to clipboard
  - Disconnect wallet (red text)

**Visual Design:**

```
Not Connected:  [💚 Connect]  (lime green, rounded pill)
Connected:      [🟢 AbC...XyZ ▼] (gray background, green dot, white text, chevron)
```

**Menu Design:**

```
┌─────────────────────────┐
│ Connected Wallet        │
│ AbCdef...XyZ123         │
├─────────────────────────┤
│ 📋 Copy Address         │
│ 🚪 Disconnect (red)     │
└─────────────────────────┘
```

### 2. **PageHeader** (`src/components/shared/PageHeader.tsx`)

Reusable header component for Challenges and Profile screens.

**Props:**

- `title: string` - Page title

**Layout:**

```
Page Title              [WalletButton]
```

### 3. **Welcome** (`src/components/screens/home/welcome.tsx`)

Home screen header with wallet status.

**Layout:**

```
Hi Tyler 🟢              [WalletButton]
```

## Screen Integration

### Home Screen

```
Hi Tyler 🟢              [WalletButton ▼]
```

### Challenges Screen

```
Challenges              [WalletButton ▼]
```

### Profile Screen

```
Profile                 [WalletButton ▼]
```

## User Interactions

### Connecting Wallet

1. User sees "Connect" button (lime green)
2. Taps button
3. Mobile Wallet Adapter launches
4. User selects wallet (Phantom, Solflare, etc.)
5. Button updates to show wallet address with chevron

### Using Wallet Menu

1. User taps connected wallet button
2. Modal menu appears (top-right aligned)
3. User can:
   - **Copy Address**: Copies full wallet address to clipboard
   - **Disconnect**: Signs out and returns to connect state

### Menu Behavior

- **Backdrop tap**: Closes menu
- **Action performed**: Closes menu automatically
- **Animated**: Fade-in animation
- **Positioned**: Top-right corner below wallet button

## Design System

**Colors:**

- Connect Button: `bg-lime-500` (#a3e635)
- Connected Pill: `bg-gray-800` (#1f2937)
- Status Dot: `bg-lime-500` (green indicator)
- Menu Background: `#1a1a1a`
- Disconnect Text: `text-red-500` (#ef4444)
- Menu Border: `border-gray-700`
- Overlay: `rgba(0, 0, 0, 0.5)`

**Typography:**

- Connect Button: Poppins_600SemiBold, text-sm
- Wallet Address (button): Poppins_500Medium, text-sm
- Wallet Address (menu): Poppins_500Medium, text-sm
- Menu Label: Poppins_400Regular, text-xs
- Menu Items: Poppins_500Medium, text-sm
- Page Titles: Poppins_700Bold, text-3xl

**Spacing:**

- Button: `px-4 py-2` (compact)
- Menu Items: `px-4 py-3`
- Rounded: `rounded-full` (button), `rounded-2xl` (menu)
- Icon Size: 18px (wallet), 16px (chevron), 20px (menu icons)
- Status Dot: 2x2

**Menu:**

- Min Width: 220px
- Shadow: elevation 8
- Border Radius: 16px
- Position: Top-right aligned

## Technical Details

**Hooks Used:**

- `useAuthorization()` - Check wallet connection state
- `useMobileWallet()` - Connect/disconnect wallet
- `useState()` - Menu visibility state
- `ellipsify()` - Shorten wallet addresses

**Components Used:**

- `Modal` - Menu overlay
- `Clipboard` - Copy address functionality
- `TouchableOpacity` - Interactive elements
- `Ionicons` - Icons (wallet, chevron-down, copy-outline, log-out-outline)

**State Management:**

- Wallet state managed by existing authorization system
- Menu visibility managed locally with `useState`
- Reactive updates via hooks

## Benefits

1. **Always Accessible**: Wallet menu available from any screen
2. **Quick Actions**: Copy address and disconnect in 2 taps
3. **Clear Status**: Easy to see if wallet is connected
4. **Consistent Design**: Same style across all screens
5. **Mobile-Friendly**: Compact design, touch-optimized
6. **No Clutter**: Settings removed, focus on wallet
7. **User Context**: "Hi Tyler" remains for personalization
