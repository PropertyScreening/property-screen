# PROPERTY SCREEN — Website starter

**Brand:** PROPERTY SCREEN  
**Tagline:** Your Property Is Never Out of Sight.

A responsive, static HTML/CSS/JavaScript website using the approved forest-green, warm-ivory and signal-lime identity. It is configured for direct deployment to GitHub Pages; no framework, build command, or package installation is required.

## Included

- Premium responsive homepage and mobile navigation
- Approved property + eye/camera + security shield logo
- Custom architectural hero illustration
- Launch areas: Adibatla, Kongara Kalan, Nadergul, Turkayamjal and Manneguda
- Property search-preference form (front-end enquiry helper; no live listings yet)
- Property-owner onboarding section
- Introductory membership display: ₹1 registration; Basic ₹100/month; Plus ₹200/month; Premium ₹300/month
- Contact form preview with clear notice that submissions are not yet stored or sent
- GitHub Actions workflow for automatic GitHub Pages publishing

## Preview locally

Open `public-site/index.html` in a browser. For a local web server, run this from the project folder:

```bash
python -m http.server 8000 --directory public-site
```

Then open `http://localhost:8000`.

## Publish to GitHub Pages

1. Create a GitHub repository named **property-screen**.
2. Upload the **contents of this project folder** to the repository's `main` branch. Keep the `.github` folder and `public-site` folder at the repository root.
3. In GitHub, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.
4. Open **Actions** and confirm that **Deploy PROPERTY SCREEN to GitHub Pages** completes successfully.
5. GitHub will show the published address, normally `https://YOUR-USERNAME.github.io/property-screen/`.

Every push to `main` will trigger a new deployment.

## Domain and branded email later

After purchasing a domain, connect it in **Settings → Pages → Custom domain** and follow the DNS records GitHub displays. Then set up the domain mailbox (for example, `hello@yourdomain`) with an email provider. Add the real contact channels to the website before promoting it publicly.

## Before public launch

- Connect the enquiry form to a real mailbox and preferably a form backend or CRM. It currently does not transmit or save visitor submissions.
- Replace the form preview notice with a working confirmation after the endpoint is configured.
- Add the official phone number, WhatsApp contact, business email and social media links.
- Finalise Terms & Conditions, Privacy Policy, Property Listing Agreement, Refund Policy and support process.
- Confirm applicable GST, local business and Telangana RERA requirements for the exact services offered.
- Confirm plan inclusions, phase-based pricing, billing and applicable taxes before accepting payments.
- Do not describe a property as verified unless the stated checks have actually been completed and documented.

## Brand palette

- Forest Green: `#123C35`
- Deep Charcoal: `#18201E`
- Warm Ivory: `#F5F2EA`
- Architectural White: `#FFFFFF`
- Signal Lime: `#C7F36B`
- Muted Sage: `#A8B9AE`

Typography: Manrope (headings) + DM Sans (body copy).
