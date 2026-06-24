---
name: Aureate Developer Portfolio
colors:
  surface: '#0e131d'
  surface-dim: '#0e131d'
  surface-bright: '#343944'
  surface-container-lowest: '#090e18'
  surface-container-low: '#171c26'
  surface-container: '#1b202a'
  surface-container-high: '#252a35'
  surface-container-highest: '#303540'
  on-surface: '#dee2f1'
  on-surface-variant: '#d3c5ae'
  inverse-surface: '#dee2f1'
  inverse-on-surface: '#2b303b'
  outline: '#9b8f7a'
  outline-variant: '#4f4634'
  surface-tint: '#f6be39'
  primary: '#f6be39'
  on-primary: '#402d00'
  primary-container: '#d4a017'
  on-primary-container: '#503a00'
  inverse-primary: '#795900'
  secondary: '#bec6e3'
  on-secondary: '#283046'
  secondary-container: '#3e465e'
  on-secondary-container: '#adb4d1'
  tertiary: '#ffb77d'
  on-tertiary: '#4d2600'
  tertiary-container: '#fd8b00'
  on-tertiary-container: '#603100'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdfa0'
  primary-fixed-dim: '#f6be39'
  on-primary-fixed: '#261a00'
  on-primary-fixed-variant: '#5c4300'
  secondary-fixed: '#dae2ff'
  secondary-fixed-dim: '#bec6e3'
  on-secondary-fixed: '#131b30'
  on-secondary-fixed-variant: '#3e465e'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#0e131d'
  on-background: '#dee2f1'
  surface-variant: '#303540'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  code-sm:
    fontFamily: monospace
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is engineered to project a persona of high-end technical expertise mixed with creative sophistication. It targets high-value clients and technical recruiters who appreciate precision and premium aesthetics.

The visual style is a fusion of **Glassmorphism** and **Corporate Modern**. It utilizes translucent layers to manage complexity in the visitor dashboard while maintaining a "deep space" feel through its charcoal and navy foundation. The emotional response is one of prestige, reliability, and cutting-edge capability, signaled by the contrast between cold, dark backgrounds and warm, metallic accents.

## Colors

The palette is built upon a high-contrast dark theme. The base background is a deep charcoal-navy (`#0F141E`), providing a limitless depth that makes the gold accents feel luminous rather than flat.

- **Primary Gold:** Used for key brand elements, primary actions, and highlight states.
- **Secondary Navy:** Used for surface containers and card backgrounds to differentiate from the base canvas.
- **Accent Orange:** Used sparingly for critical alerts or secondary data points in charts to maintain warmth.
- **Chart Palette:** A specialized set of tokens for the Visitor Tracking Dashboard, balancing the primary gold with analogous and complementary tones for clear data visualization against dark backgrounds.

## Typography

Typography balances the geometric strength of **Montserrat** for headings with the extreme legibility of **Inter** for body text and data-heavy dashboard views.

Headlines should utilize tight letter-spacing to appear more impactful. For the Visitor Dashboard, labels use a slightly increased letter-spacing and uppercase styling to provide a technical, "instrument-panel" aesthetic. Ensure that long-form project descriptions maintain the 1.6 line-height for optimal readability against the dark background.

## Layout & Spacing

The system uses a **Fluid Grid** model with a 12-column structure for desktop and a 4-column structure for mobile. 

The layout relies on generous vertical rhythm to separate project case studies. Components within the dashboard use a denser 8px-based spacing system to maximize information density. Safe areas are strictly enforced to prevent gold accents from feeling cluttered. Content should reflow from a side-by-side "Image | Text" layout on desktop to a stacked "Image / Text" layout on mobile devices.

## Elevation & Depth

Depth is achieved through a combination of **Tonal Layers** and **Glassmorphism**. 

1. **Base Layer:** The darkest navy (`#0F141E`).
2. **Card Layer:** A slightly lighter navy (`#1A2238`) with a 1px border of 10% white to define edges.
3. **Glass Layer:** Used for navigation bars and floating dashboard widgets. These use a `backdrop-filter: blur(12px)` and a semi-transparent fill of the primary background color.
4. **Interactive State:** Elements elevated on hover should not use heavy shadows; instead, they use an outer glow (bloom) effect using the primary gold color at low opacity (15-20%) to simulate a light-emitting surface.

## Shapes

The design system utilizes **Rounded** corners to soften the technical feel and make the UI more approachable. Standard cards and large buttons use a 1rem (`rounded-lg`) radius. Smaller elements like tags and dashboard chips utilize a 0.5rem radius. This consistency ensures that even data-heavy dashboard components feel integrated into the overall portfolio aesthetic.

## Components

### Buttons
- **Primary:** Gold-to-Orange linear gradient (45 degrees). Text is dark navy for maximum contrast.
- **Secondary:** Transparent with a 2px gold border. Text is gold.
- **Hover States:** Increase gradient intensity and add a subtle gold box-shadow (bloom effect).

### Cards
- **Portfolio Cards:** Feature a subtle 1px border. On hover, the border transitions from 10% white to 100% gold. 
- **Dashboard Widgets:** Use the glassmorphism style with a blurred background to maintain context of the underlying canvas.

### Inputs & Fields
- Dark backgrounds with a 1px border. The border glows gold when the field is focused. Labels are always positioned above the field in `label-md` style.

### Social Icons
- Custom-drawn monochrome icons. On hover, they should transition to the primary gold color and scale up by 10% with a spring animation.

### Dashboard Charts
- Use the defined `chart_palette`. Line charts should use a slight gradient fill under the line to connect the data to the X-axis, maintaining the glassmorphic aesthetic.