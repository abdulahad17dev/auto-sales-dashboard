# Авто-локализации Дашборд (Auto-Localizations Sales Dashboard)

## Project Overview
This is a Vue.js dashboard application for monitoring auto-localization sales KPIs, order details, and partner communications. The application follows a technical specification for creating an intuitive and efficient interface for sales managers, analysts, and department heads.

## Project Location
The project is located at:
```
C:\Users\Ulugbek\AppData\Local\AnthropicClaude\app-0.9.2\auto-sales-dashboard
```

## Technology Stack
- **Framework**: Vue.js 3 with Composition API
- **Styling**: Tailwind CSS
- **Charts**: Apache ECharts (via vue-echarts)
- **Icons**: lucide-vue-next
- **Localization**: vue-i18n with support for Russian, English, and Chinese
- **Animation**: @vueuse/motion
- **State Management**: Pinia
- **Virtual Scrolling**: vue-virtual-scroller

## Project Structure
```
auto-sales-dashboard/
├── public/            # Static files
│   └── favicon.ico    # Website favicon
├── src/               # Source code
│   ├── assets/        # Resources (images, fonts)
│   ├── components/    # Vue components
│   │   ├── layout/    # Layout components
│   │   │   ├── Breadcrumbs.vue    # Navigation breadcrumbs
│   │   │   ├── HamburgerMenu.vue  # Mobile menu toggle button
│   │   │   ├── LocaleSelector.vue # Language selector
│   │   │   └── Sidebar.vue        # Main navigation sidebar
│   │   └── ui/        # UI components
│   │       ├── ComparisonChart.vue # Comparison chart component
│   │       ├── DatePicker.vue      # Date picker component
│   │       ├── ExportButton.vue    # Export data button
│   │       ├── Modal.vue           # Modal dialog component
│   │       ├── ModelDetails.vue    # Model details component
│   │       ├── RegionHeatmap.vue   # Region heatmap visualization
│   │       ├── Select.vue          # Dropdown select component
│   │       └── Table.vue           # Data table component
│   ├── locales/       # Localization files
│   │   ├── en.json    # English strings
│   │   ├── ru.json    # Russian strings
│   │   └── zh.json    # Chinese strings
│   ├── router/        # Routing configuration
│   │   └── index.js   # Vue Router setup
│   ├── styles/        # Global styles
│   │   └── main.css   # Main CSS file with Tailwind
│   ├── views/         # Page components
│   │   ├── SalesByBrandsView.vue          # Sales by brands page
│   │   ├── SalesByBrandsAndModelsView.vue # Sales by brands and models page
│   │   ├── SalesByYearsView.vue           # Sales by years page
│   │   ├── MarketAnalysisView.vue         # Market analysis page
│   │   ├── ModelDetailsView.vue           # Model details page
│   │   ├── OrderDetailsView.vue           # Order details page
│   │   ├── ContactsView.vue               # Contacts page
│   │   └── FeedbackStatusView.vue         # Feedback status page
│   ├── App.vue        # Root component
│   └── main.js        # Entry point
├── index.html         # Main HTML file
├── package.json       # Dependencies and scripts
├── vite.config.js     # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
├── postcss.config.js  # PostCSS configuration
├── run.bat            # Windows script to install and run
└── run.sh             # Linux/macOS script to install and run
```

## Detailed File Explanations

### Configuration Files

#### `package.json`
Contains project metadata, dependencies, and scripts. Important dependencies include:
- vue (v3.3.4) - Core framework
- vue-router (v4.2.4) - For page navigation
- vue-i18n (v9.2.2) - For multi-language support
- echarts (v5.4.3) and vue-echarts (v6.6.0) - For chart visualizations
- tailwindcss (v3.3.3) - For utility-first CSS
- lucide-vue-next (v0.274.0) - For SVG icons
- @vueuse/motion (v2.0.0) - For animations
- @vueuse/core (v10.3.0) - Vue composition utilities
- vue-virtual-scroller (v2.0.0-beta.8) - For efficient rendering of large lists
- pinia (v2.1.6) - State management

#### `vite.config.js`
Configures Vite build tool with Vue plugin and path aliases. The '@' alias points to the src directory for easier imports.

#### `tailwind.config.js`
Tailwind CSS configuration that extends the default theme with:
- Custom color palette (primary, secondary, accent, background, surface)
- Custom font families (Inter for sans-serif, Courier New for monospace)
- Custom border radius, font sizes, and box shadows

#### `postcss.config.js`
PostCSS configuration that includes Tailwind CSS and Autoprefixer plugins.

#### `index.html`
The main HTML template that includes:
- Meta tags for character encoding and viewport settings
- Title: "Продажи авто-локализаций"
- Font preloading for Inter and Noto Sans
- The app mount point (#app div)
- Script import for the Vue application

### Core Files

#### `src/main.js`
Application entry point that:
- Creates the Vue app instance
- Imports and configures plugins (Vue Router, Pinia, Vue i18n)
- Loads localization messages for all supported languages
- Mounts the app to the DOM

#### `src/App.vue`
Root component that:
- Defines the overall page layout with sidebar and main content area
- Includes the header with navigation controls (back button, breadcrumbs)
- Implements responsive design adjustments
- Renders the current route view using RouterView

#### `src/router/index.js`
Vue Router configuration that:
- Defines all application routes and their corresponding components
- Sets up route meta data for titles and navigation controls
- Implements route transitions and navigation guards
- Handles page title updates on route changes

### Style Files

#### `src/styles/main.css`
Main CSS file with:
- Tailwind CSS imports (@tailwind directives)
- Base styles for HTML elements and typography
- Common component styles as Tailwind components
- Utility classes for animations, loading states, and toasts
- Responsive adjustments

### Localization Files

#### `src/locales/en.json`, `src/locales/ru.json`, `src/locales/zh.json`
Localization files containing key-value pairs for each supported language. Each file includes translations for:
- Navigation items
- Common UI elements (buttons, labels)
- Page-specific content
- Error messages and notifications
- Form fields and validation messages

### Layout Components

#### `src/components/layout/Sidebar.vue`
Main navigation sidebar that:
- Shows full text labels on desktop and icons only on tablet
- Transforms into a slide-out menu on mobile
- Highlights the current active route
- Includes a toggle for collapsing/expanding
- Contains links to all main dashboard pages

#### `src/components/layout/Breadcrumbs.vue`
Breadcrumb navigation component that:
- Dynamically generates breadcrumbs based on the current route
- Supports deep linking with route parameters
- Provides clickable navigation to parent routes
- Adapts to different screen sizes

#### `src/components/layout/LocaleSelector.vue`
Language selector dropdown that:
- Shows the current selected language
- Provides a dropdown menu for selecting other languages
- Persists language choice in localStorage
- Updates the application locale in real-time

#### `src/components/layout/HamburgerMenu.vue`
Mobile menu toggle component that:
- Provides an animated hamburger icon that transforms when clicked
- Controls the visibility of the sidebar menu on mobile devices
- Emits toggle events to parent components

### UI Components

#### `src/components/ui/Table.vue`
Reusable data table component with:
- Sortable columns with ascending/descending indicators
- Custom cell rendering via slots
- Pagination controls
- Loading states and empty state handling
- Row click events for drill-down navigation
- Responsive design adjustments

#### `src/components/ui/Modal.vue`
Modal dialog component that:
- Creates a focus-trapping overlay
- Supports custom headers, content, and footers
- Includes default cancel/confirm buttons
- Implements smooth entrance/exit animations
- Prevents body scrolling when open
- Handles keyboard accessibility (Escape to close)

#### `src/components/ui/DatePicker.vue`
Date input component that:
- Wraps the native date input with custom styling
- Supports labels and placeholders
- Handles disabled states
- Provides proper validation
- Emits value changes to the parent

#### `src/components/ui/Select.vue`
Dropdown select component that:
- Customizes the native select element
- Supports option groups
- Handles placeholder values
- Shows validation errors
- Provides disabled states
- Emits selected values to the parent

#### `src/components/ui/ComparisonChart.vue`
Comparison chart component that:
- Provides visual comparison between different data sets
- Supports various chart types (bar, line)
- Includes tooltips for detailed information
- Handles responsive resizing

#### `src/components/ui/ExportButton.vue`
Data export component that:
- Allows exporting data in various formats (CSV, Excel)
- Shows a loading state during export
- Handles errors during the export process
- Provides success notifications

#### `src/components/ui/ModelDetails.vue`
Model details component that:
- Displays detailed information about a specific car model
- Shows specifications, pricing, and availability
- Includes image gallery when available
- Provides action buttons for further operations

#### `src/components/ui/RegionHeatmap.vue`
Region heatmap visualization that:
- Displays sales intensity across different geographical regions
- Uses color gradients to indicate values
- Includes interactive tooltips
- Supports zooming and filtering

### View Components

#### `src/views/SalesByBrandsView.vue`
Sales by brands dashboard view that:
- Displays a bar chart of sales volume by brand
- Shows a sortable data table with brand sales data
- Provides filters for region and production year
- Includes a date picker for time period selection
- Implements drill-down navigation to brand models
- Shows visual indicators for sales trends (up/down)

#### `src/views/SalesByBrandsAndModelsView.vue`
Sales by brands and models view that:
- Shows a heatmap visualization of sales intensity by month and brand
- Implements expandable/collapsible sections for each brand's models
- Filters data based on selected brand from previous view
- Displays progress bars for sales volume comparison
- Provides direct navigation to order details for specific models

#### `src/views/SalesByYearsView.vue`
Sales by production years view that:
- Shows dual line charts for deals and average check values
- Implements a range slider for year selection
- Provides export to CSV functionality
- Displays summary cards with key metrics and trends
- Shows average lines and tooltips on charts

#### `src/views/MarketAnalysisView.vue`
Market analysis view that:
- Provides market trends and competitor analysis
- Shows market share pie charts and trend lines
- Includes filtering by region, time period, and vehicle segment
- Displays key metrics in comparison to industry benchmarks
- Supports data export for further analysis

#### `src/views/ModelDetailsView.vue`
Model details view that:
- Shows comprehensive information about a specific vehicle model
- Displays historical sales data with trend charts
- Includes pricing analysis across different regions
- Shows inventory levels and production forecasts
- Provides related models and competitive positioning

#### `src/views/OrderDetailsView.vue`
Order details view that:
- Implements a powerful data grid with filtering, sorting, and pagination
- Shows expandable language tags for each order
- Provides inline action buttons for each row
- Includes a search box for quick filtering
- Implements a modal for volume clarification requests
- Shows status badges with color coding
- Includes messenger integration buttons (WeChat, Telegram)

#### `src/views/ContactsView.vue`
Contacts and volume clarification view that:
- Displays a grid of contact cards with client information
- Shows status badges for each contact
- Provides direct messaging via messenger buttons
- Implements a volume request form in a modal
- Includes search and filter functionality
- Provides navigation to feedback status for specific clients

#### `src/views/FeedbackStatusView.vue`
Feedback status view that:
- Implements a kanban board with three columns (Pending, Received, Partial)
- Supports drag-and-drop for status updates
- Provides a note editor for adding comments
- Includes date tracking for feedback items
- Shows client and subject information
- Filters by client based on navigation from contacts view

### Run Scripts

#### `run.bat`
Windows batch script that:
- Displays a welcome message
- Installs dependencies using npm
- Checks for installation errors
- Starts the development server
- Shows the local URL for accessing the application

#### `run.sh`
Linux/macOS shell script that:
- Displays a welcome message
- Installs dependencies using npm
- Checks for installation errors
- Starts the development server
- Shows the local URL for accessing the application

## Pages and Features

### 1. Sales by Brands (`SalesByBrandsView.vue`)
- Bar chart visualization of sales by brand
- Data table with sortable columns
- Filters for region and production year
- Date picker for time period selection
- Click on brand to drill down to models

### 2. Sales by Brands and Models (`SalesByBrandsAndModelsView.vue`)
- Heatmap of sales intensity by month
- Expandable/collapsible list of models by brand
- Filters to show all models or specific brands
- "Details" button to navigate to order details

### 3. Sales by Production Years (`SalesByYearsView.vue`)
- Line charts for deals and average check
- Year range slider for filtering time periods
- Export to CSV functionality
- Summary cards with key metrics and trends

### 4. Market Analysis (`MarketAnalysisView.vue`)
- Market share visualization
- Competitor analysis charts
- Regional performance comparisons
- Trend analysis by vehicle segment
- Seasonality impact visualization

### 5. Model Details (`ModelDetailsView.vue`)
- Comprehensive model specifications
- Historical sales performance
- Regional pricing comparison
- Inventory levels and forecasts
- Competitive positioning analysis

### 6. Order Details (`OrderDetailsView.vue`)
- Data grid with sorting, filtering, pagination
- Expandable languages column
- Filter by brand, year, and status
- Actions for volume clarification
- Integration with messengers (WeChat, Telegram)
- Modal form for volume updates

### 7. Contacts and Volume Clarification (`ContactsView.vue`)
- Contact cards with client information
- Status badges (Active, Pending, Inactive)
- Direct messaging via WeChat/Telegram buttons
- Request volume functionality with form
- Navigation to feedback status

### 8. Feedback Status (`FeedbackStatusView.vue`)
- Kanban board with three columns (Pending, Received, Partial)
- Drag-and-drop functionality for status updates
- Note creation and editing
- Date tracking for feedback
- Filterable by client

## Responsive Design
- **Desktop**: ≥ 1280px — Sidebar + two content columns
- **Tablet**: 768–1279px — Sidebar collapses to icons
- **Mobile**: ≤ 767px — Slide-out menu, single column content

## Localization
The interface is available in three languages:
- Russian (default)
- English
- Chinese

The language selector is located in the top-right corner of the application.

## Localization Issues and Fixes

I've identified several elements in the application that need localization:

### 1. Region Options in SalesByBrandsView.vue
The region dropdown options are hardcoded in Russian:
```javascript
const regionOptions = [
  { value: 'all', label: 'Все регионы' },
  { value: 'russia', label: 'Россия' },
  { value: 'belarus', label: 'Беларусь' },
  // ...
]
```

**Fix**: Move these strings to the locale files:
```javascript
// In localization files
"regions": {
  "all": "Все регионы", // Russian
  "all": "All Regions", // English
  "all": "所有地区", // Chinese
  "russia": "Россия",
  // ...
}

// In the component
const regionOptions = computed(() => [
  { value: 'all', label: $t('regions.all') },
  { value: 'russia', label: $t('regions.russia') },
  // ...
])
```

### 2. Year Options in SalesByBrandsView.vue
The year dropdown options are hardcoded:
```javascript
const yearOptions = [
  { value: 'all', label: 'Все годы' },
  { value: '2025', label: '2025' },
  // ...
]
```

**Fix**: Move the "All years" text to locale files:
```javascript
// In localization files
"years": {
  "all": "Все годы", // Russian
  "all": "All Years", // English
  "all": "所有年份" // Chinese
}

// In the component
const yearOptions = computed(() => [
  { value: 'all', label: $t('years.all') },
  { value: '2025', label: '2025' },
  // ...
])
```

### 3. Table Columns in SalesByBrandsView.vue
The table column headers are hardcoded in Russian:
```javascript
const tableColumns = [
  { key: 'brand', label: 'Бренд', sortable: true },
  { key: 'deals', label: 'Сделки', sortable: true },
  // ...
]
```

**Fix**: Use the existing translations in the locale files:
```javascript
const tableColumns = computed(() => [
  { key: 'brand', label: $t('salesByBrands.brand'), sortable: true },
  { key: 'deals', label: $t('salesByBrands.deals'), sortable: true },
  // ...
])
```

### 4. Export Success Message in SalesByBrandsView.vue
The export success alert is hardcoded in Russian:
```javascript
alert('Экспорт успешно завершен')
```

**Fix**: Add a new translation key and use it:
```javascript
// In localization files
"export": {
  "successMessage": "Экспорт успешно завершен", // Russian
  "successMessage": "Export completed successfully", // English
  "successMessage": "导出成功完成" // Chinese
}

// In the component
alert($t('export.successMessage'))
```

### 5. Missing Translations for Market Analysis in Chinese
The zh.json file is missing the "marketAnalysis" key in the navigation section, which is present in en.json and ru.json.

**Fix**: Add the missing translation:
```javascript
// In zh.json
"navigation": {
  // existing items
  "marketAnalysis": "市场分析",
  // other items
}
```

### 6. Missing Key "reset" in English and Chinese Locale Files
The ru.json file has a "reset" key under common, but it's missing from en.json and zh.json.

**Fix**: Add the missing keys:
```javascript
// In en.json
"common": {
  // existing items
  "reset": "Reset",
  // other items
}

// In zh.json
"common": {
  // existing items
  "reset": "重置",
  // other items
}
```

## Design System
1. **Color Palette**:
   - Primary: #1F2937 (dark blue)
   - Secondary: #3B82F6 (blue)
   - Accent: #F59E0B (orange)
   - Background: #F3F4F6 (light gray)
   - Surface: #FFFFFF (white)

2. **Typography**:
   - Headings: Inter, 600, 24–32px
   - Text: Inter, 400, 14–16px
   - Monospace: Courier New, 400, 12px

## Data Flow and Component Communication

### Data Flow
1. **Mock Data Generation**: Each view generates realistic mock data for demonstration
2. **Filtering**: Applied through computed properties that respond to user selections
3. **Drill-down Navigation**: Query parameters are used to pass context between views
4. **Form Submissions**: Updates local data arrays to simulate backend interactions

### Component Communication
1. **Props Down**: Parent components pass data to children via props
2. **Events Up**: Child components emit events to notify parents of actions
3. **Router**: Used for cross-view navigation and state persistence
4. **Pinia Store**: Centralized state management for shared data
5. **Local Storage**: Persists user preferences like language selection

## Installation and Running

### Prerequisites
- Node.js (version 16.x or higher)
- npm or yarn

### Installation
```bash
# Navigate to the project directory
cd C:\Users\Ulugbek\AppData\Local\AnthropicClaude\app-0.9.2\auto-sales-dashboard

# Install dependencies
npm install
```

### Running the Application
```bash
# Start the development server
npm run dev
```

The application will be available at http://localhost:5173

### Alternative: Using the provided scripts
- On Windows: `run.bat`
- On Linux/macOS: `chmod +x run.sh && ./run.sh`

## Development Tools

### Storybook
The project includes Storybook for component development and documentation:
```bash
# Run Storybook
npm run storybook
```

### Testing
The project is set up with Jest and Cypress for testing:
```bash
# Run tests (when implemented)
npm run test

# Run Cypress
npx cypress open
```

## Continuing Development

### For Future Claude Sessions
To continue development in a future Claude session:

1. **Understand the Structure**: Review this README to understand the component structure
2. **Examine Components**: Look at the individual Vue components to understand their functionality
3. **Check the Technical Specification**: The original requirements are implemented according to the technical specification provided

### Next Steps for Development
1. **Fix Localization Issues**: Implement the fixes outlined in the "Localization Issues and Fixes" section
2. **Add Real API Integration**: Replace mock data with real API calls
3. **Enhance Testing**: Add unit and end-to-end tests with Jest and Cypress
4. **Complete Storybook Documentation**: Document all components in Storybook
5. **Add User Authentication**: Implement login/logout functionality
6. **Optimize Performance**: Implement lazy loading for routes and components

### Common Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run Storybook
npm run storybook

# Run linter
npm run lint
```

## Notes
- This project uses Vue 3's Composition API style
- Mock data is generated within the components for demonstration purposes
- All UI components are created manually (no external component libraries)
- The project is structured for scalability and maintainability
