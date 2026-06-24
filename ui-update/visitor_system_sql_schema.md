# Visitor Tracking System Specifications

## 1. Tailwind CSS Component & Animation Structure
- **Hero CTA**: `bg-primary hover:bg-primary-variant transition-all duration-300 animate-bounce-subtle`
- **Skill Cards**: `bg-surface-container hover:scale-105 hover:shadow-gold-glow transition-transform duration-300 border border-white/5`
- **Navigation Links**: `text-on-surface-variant hover:text-primary relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all`
- **Semi-Circle Background**: `absolute -right-20 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl`

## 2. Admin Dashboard Concept
### UI Recommendations
- **Charts**: Use **Recharts** for React or **Chart.js** for PHP. They offer great responsive support and easy theme integration.
- **Visualizations**:
    - **Line Chart**: 'Weekly Traffic Trend' using a gold stroke color.
    - **Bar Chart**: 'Top 3 Referrer Sources'.
    - **Pie Chart**: 'Device Breakdown' (Mobile vs Desktop).
    - **Stat Cards**: Total Visitors, Avg. Session Time, Bounce Rate.

## 3. Database Schema (SQL DDL)
```sql
CREATE TABLE visitor_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address_hash VARCHAR(64) NOT NULL COMMENT 'Anonymized SHA256 hash of IP',
    browser_os VARCHAR(255) NOT NULL COMMENT 'Parsed from User-Agent',
    referrer_url TEXT COMMENT 'Source of traffic',
    landing_page VARCHAR(255) NOT NULL,
    visit_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    country_code CHAR(2) DEFAULT 'XX'
);

-- Index for faster reporting
CREATE INDEX idx_visit_date ON visitor_logs (visit_timestamp);
```