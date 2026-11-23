# Ceramic Bliss - Modern Artisanal Ceramics Website

A responsive, static website built with **HTML5, CSS3, and JavaScript** for **Ceramic Bliss** (`@ceramicbliss_`).

Designed for online product showcasing with **zero server/e-commerce database maintenance costs** by channeling customer orders and inquiries directly through **WhatsApp** and **Instagram**.

---

## 🌟 Key Features

1. **Artisanal Modern Aesthetic**:
   - Palette inspired by natural terracotta, kiln-fired stoneware, clay, and sand linen.
   - Editorial serif headings (`Playfair Display`) paired with clean geometric UI typography (`Plus Jakarta Sans`).

2. **WhatsApp Direct Commerce (Zero Maintenance Cost)**:
   - **One-Tap Order on WhatsApp**: Every product card has an instant button that opens WhatsApp (`+91 95289 40102`) with the product name and price pre-filled.
   - **WhatsApp Catalog Direct Links**: Floating WhatsApp button, announcement bar, hero section, and header buttons linking to `https://wa.me/c/919528940102`.
   - **Consolidated Inquiry List / Wishlist Drawer**: Customers can tap `+ Inquire` on multiple ceramic pieces, view an estimated total, and click **"Send Complete Order on WhatsApp"** to send a single formatted order message!

3. **Complete 22-Product Catalog from Excel**:
   - All 22 items from `Ceramicbliss_Product_Catalog.xlsx` are integrated with their images, original prices, selling prices, and discount percentages.
   - Product categories: *Cup Sets, Cups with Saucer, Mugs, Customized Mugs, Cup & Kettle Sets, Tumblers, Planters, Diwali & Festive*.

4. **Dynamic Search & Filtering**:
   - Instant search bar by product title, description, or category.
   - Category filter pills with active counts.
   - Sort by Featured / Bestsellers, Price: Low to High, Price: High to Low, or Discount %.

5. **Quick View `<dialog>` Modal**:
   - Native HTML5 `<dialog>` modal showing zoomed image, specifications (material, capacity, finish, care instructions), and instant order buttons.

6. **Interactive Canvas Pottery Wheel**:
   - Ambient, interactive canvas animation showcasing hand-thrown pottery spinning on a potter's wheel with glaze highlights.

7. **Instagram Community Section**:
   - Curated feed linking directly to `https://www.instagram.com/ceramicbliss_`.

8. **Corporate & Custom Bulk Orders**:
   - Dedicated section for custom logo mugs, party favors, cafe supplies, and bulk discounts.

---

## 📁 Project Structure

```
Crreamic Bliss/
├── index.html                 # Main website homepage
├── css/
│   └── style.css              # Complete responsive & animated styling
├── js/
│   ├── products.js            # Extracted product catalog data & configuration
│   └── app.js                 # Filter, search, modal, drawer & canvas logic
├── asset/
│   ├── LOGO.jpeg              # Brand logo
│   ├── Cover.jpeg             # Hero banner cover
│   └── products/              # 22 extracted product photos (product_1.png to 22.png)
├── Ceramicbliss_Product_Catalog.xlsx # Original source Excel catalog
└── README.md                  # Documentation
```

---

## 🚀 How to View & Run Locally

### Option 1: Direct Double Click
Simply double-click `index.html` in your file explorer. It opens directly in Chrome, Edge, Safari, or Firefox without any installation!

### Option 2: Local Server (Optional)
If you want to run a local server:
```bash
node server.js
```
Then open: `http://localhost:3456`

---

## ✏️ How to Add, Edit, or Update Products

Open `js/products.js` in any text editor. Each product is a simple entry:
```javascript
{
  id: 1,
  name: "Multicoloured 6-Piece Cup Set",
  category: "Cup Sets",
  tagline: "Vibrant Hand-Finished Tableware",
  description: "Handcrafted 6-piece ceramic cup set...",
  sellingPrice: 400,
  originalPrice: 499,
  discount: 99,
  discountPercent: 20,
  image: "asset/products/product_1.png",
  featured: true,
  badge: "Bestseller",
  specs: {
    pieces: "6 Cups",
    material: "100% Food-Grade Ceramic",
    finish: "Glossy Glazed",
    features: "Microwave & Dishwasher Safe"
  }
}
```
You can edit the price, change names, add new photos to `asset/products/`, or change your WhatsApp number in `window.CERAMIC_CONFIG` at the bottom of `js/products.js`.

---

## 🌐 Free Hosting Suggestions
Since this is 100% static (HTML, CSS, JS):
- **GitHub Pages**: Free permanent hosting with SSL.
- **Netlify / Vercel**: Drag-and-drop the folder for instant deployment.
- **Cloudflare Pages**: Free global CDN hosting.
