# VoltGear Style Guide

## CSS & Styling Approach
Since the project is already initialized with Tailwind CSS v4, we will leverage utility classes for rapid layout and structural styling, while incorporating custom CSS variables and advanced styling in `globals.css` for complex effects (like glassmorphism, custom animations, and gradient text).

## Key Tailwind Utilities to Use
- **Layout**: `flex`, `grid`, `max-w-7xl`, `mx-auto`, `px-4`, `sm:px-6`, `lg:px-8`.
- **Spacing**: Generous padding/margins (`py-20`, `gap-8`).
- **Typography**: `text-5xl`, `font-extrabold`, `tracking-tight`, `bg-clip-text`, `text-transparent`.
- **Effects**: `backdrop-blur-lg`, `shadow-2xl`, `hover:-translate-y-1`, `transition-all`, `duration-300`.

## Custom CSS Additions
We will add custom animations in `globals.css` for:
- `fade-in-up`: For hero elements entering the screen.
- `float`: For product images in the hero section to give a dynamic, floating feel.
- `glow`: Subtle pulsing glow behind featured products.

## Component Specifications

### 1. Hero Section
- **Background**: Subtle radial gradient or mesh gradient.
- **Content**: Split layout (text on left, floating product image on right) or a strong centered layout with a massive typography treatment.
- **CTA**: Primary gradient button with a glowing shadow.

### 2. Product Cards
- **Container**: White background, soft rounded corners (`rounded-2xl`).
- **Image**: High-quality, gray background or transparent.
- **Hover State**: Image scales up slightly (`hover:scale-105`), card lifts (`hover:-translate-y-2`), and shadow deepens.

### 3. Navigation
- Transparent at the top, becomes blurred (`backdrop-blur-md`) and slightly opaque when scrolling down.
