# Roomy Design System Documentation

## Overview
Roomy uses a modern, cohesive design system inspired by Notion, Linear, and Stripe. The design emphasizes clarity, accessibility, and a professional aesthetic.

## Design Principles

### 1. **Consistency**
- All components follow the same design patterns
- Unified color palette and spacing system
- Consistent typography across all pages

### 2. **Accessibility**
- WCAG 2.1 AA compliant color contrasts
- Keyboard navigation support
- Screen reader friendly with ARIA labels
- Focus-visible indicators

### 3. **Responsiveness**
- Mobile-first design approach
- Breakpoints: 768px (tablet), 1024px (desktop)
- Flexible layouts using CSS Grid and Flexbox

### 4. **Performance**
- Lazy loading for non-critical routes
- Optimized bundle splitting
- Minimal re-renders with React best practices

## Color System

### Primary Colors
- **Primary Blue**: `#2563eb` - Main actions, links, primary buttons
- **Gradient Accent**: `#667eea → #764ba2` - Special highlights, calculator, hero sections

### Semantic Colors
- **Success**: `#10b981` - Completed tasks, success messages
- **Warning**: `#f59e0b` - Warnings, due soon items
- **Danger**: `#ef4444` - Delete actions, errors, overdue items
- **Info**: `#3b82f6` - Information messages, badges

### Neutral Colors
- **Text Primary**: `#111827` - Main content text
- **Text Secondary**: `#6b7280` - Supporting text
- **Text Tertiary**: `#9ca3af` - Disabled or subtle text
- **Background**: `#ffffff` - Main background
- **Background Secondary**: `#f9fafb` - Card backgrounds
- **Border**: `#e5e7eb` - Dividers and borders

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 
             'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
             sans-serif;
```

### Font Sizes
- **xs**: 12px - Labels, badges
- **sm**: 14px - Supporting text
- **base**: 16px - Body text
- **lg**: 18px - Large body text
- **xl**: 20px - Small headings
- **2xl**: 24px - Medium headings
- **3xl**: 30px - Large headings
- **4xl**: 36px - Hero headings

### Font Weights
- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Subheadings
- **Bold**: 700 - Headings

## Spacing System

Based on 4px/8px scale for consistency:
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px
- **3xl**: 48px
- **4xl**: 64px

## Component Library

### Button
**7 Variants:**
1. **Primary** - Main actions (blue background)
2. **Secondary** - Secondary actions (gray background)
3. **Outline** - Tertiary actions (border only)
4. **Ghost** - Minimal actions (no border)
5. **Success** - Positive actions (green)
6. **Danger** - Destructive actions (red)
7. **Warning** - Caution actions (yellow)

**Sizes:** sm, md (default), lg

**Props:**
```jsx
<Button 
  variant="primary" 
  size="md" 
  fullWidth={false}
  disabled={false}
  icon={<Icon />}
  onClick={handler}
>
  Button Text
</Button>
```

### Card
Flexible container component with optional header and actions.

**Props:**
```jsx
<Card 
  title="Card Title"
  subtitle="Optional subtitle"
  actions={<Button>Action</Button>}
  hover={true}
  padding="md"
  className="custom-class"
>
  Card content
</Card>
```

### Input Components
Three input types: Input, Textarea, Select

**Props:**
```jsx
<Input
  label="Label"
  type="text"
  placeholder="Placeholder"
  value={value}
  onChange={handler}
  required={false}
  error="Error message"
  helperText="Helper text"
  icon="search"
  fullWidth={false}
/>
```

### Navigation
Sticky navigation bar with responsive menu.

**Props:**
```jsx
<Navigation 
  currentUser={user}
  onLogout={logoutHandler}
  hideNav={false}
/>
```

### PageLayout
Consistent page structure wrapper.

**Props:**
```jsx
<PageLayout
  title="Page Title"
  subtitle="Page subtitle"
  actions={<Button>Action</Button>}
  maxWidth="xl"
>
  Page content
</PageLayout>
```

## Page Structures

### Common Pattern
All authenticated pages follow this structure:
```jsx
<>
  <Navigation currentUser={user} onLogout={handleLogout} />
  <PageLayout title="Title" subtitle="Subtitle" actions={<Actions />}>
    <Card>Content</Card>
  </PageLayout>
</>
```

## Animations & Transitions

### Standard Transitions
```css
transition: all 0.2s ease;
```

### Hover Effects
- Cards: Slight elevation increase
- Buttons: Background darkens, slight elevation
- Links: Color change

### Loading States
- Spinner animation (360° rotation, 1s duration)
- Fade-in animations for content

## Breakpoints

```css
/* Mobile: < 768px */
@media (max-width: 768px) {
  /* Mobile styles */
}

/* Tablet: 768px - 1024px */
@media (min-width: 768px) and (max-width: 1024px) {
  /* Tablet styles */
}

/* Desktop: > 1024px */
@media (min-width: 1024px) {
  /* Desktop styles */
}
```

## Accessibility Guidelines

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order follows logical flow
- Focus indicators visible on all interactive elements
- Enter/Space triggers button actions

### ARIA Labels
- Navigation landmarks: `role="navigation"`
- Buttons: `aria-label` for icon-only buttons
- Forms: Associated labels with `htmlFor`
- Loading states: `aria-busy="true"`

### Color Contrast
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

### Screen Readers
- Semantic HTML elements (`nav`, `main`, `header`, `footer`)
- Alt text for images
- ARIA live regions for dynamic content

## Best Practices

### Component Usage
1. Always wrap pages with Navigation + PageLayout
2. Use Card for content sections
3. Use design system buttons instead of custom buttons
4. Maintain consistent spacing with CSS variables
5. Follow mobile-first responsive design

### Performance
1. Lazy load non-critical routes
2. Minimize component re-renders
3. Use React.memo for expensive components
4. Optimize images and assets
5. Code splitting for large dependencies

### Code Style
1. Use functional components with hooks
2. Prop validation recommended
3. Consistent naming conventions
4. Keep components focused and small
5. Extract reusable logic to custom hooks

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

1. **Dark Mode** - Toggle between light and dark themes
2. **Custom Themes** - User-selectable color schemes
3. **Animation Library** - Expanded motion design system
4. **Icon System** - Custom icon set integration
5. **Advanced Components** - Modal, Dropdown, Tooltip, etc.
