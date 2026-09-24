/* ---------------------------------------------------------------------------
   Company Highlights — article content model (self-serve).

   To publish a NEW article: add an object to the top of this array, drop its
   thumbnail into assets/images/, run `npm run build`, and deploy (git push).
   The listing page and the article's own detail page are generated automatically.

   Fields:
     slug     – URL id (letters/numbers/hyphens). The detail page becomes
                highlight-<slug>.html. Must be unique.
     category – short tag shown on the card (e.g. Events, Awards, Partnerships,
                Community, Milestones, News).
     date     – display date string (e.g. "8 Apr 2026").
     title    – headline.
     excerpt  – 1–2 line summary shown on the card.
     image    – thumbnail path under the project (e.g. assets/images/xxxx.jpg).
     body     – article HTML (paragraphs). Keep it simple: <p>…</p> blocks.

   The FIRST item is treated as the featured (largest) article.
--------------------------------------------------------------------------- */
module.exports = [
  {
    slug: 'incobev-asia-at-fha-2026',
    category: 'Events',
    date: '8 Apr 2026',
    title: 'IncoBev Asia at FHA 2026',
    excerpt: 'Join us at FHA 2026 as we showcase our latest beverage solutions, global brands and innovations for a more sustainable future.',
    image: 'assets/images/group-product.jpg',
    body: '<p>IncoBev Asia will be exhibiting at FHA 2026, one of Asia’s largest food and beverage trade events. Visit our booth to experience our latest commercial beverage systems, premium coffee and tea brands, and end-to-end solutions for hospitality, foodservice and workplace operators.</p><p>Our team will be on hand to demonstrate new equipment, discuss OEM and private-label opportunities, and share how our centralised regional platform supports partners across Southeast Asia.</p>',
  },
  {
    slug: 'sustainability-leadership-recognition',
    category: 'Awards',
    date: '12 Feb 2025',
    title: 'IncoBev Asia Recognised for Sustainability Leadership',
    excerpt: 'Awarded an EcoVadis Bronze medal (top 35%) and NVPC’s Champion of Good for our environmental and community commitments.',
    image: 'assets/images/sustainability-hero.jpg',
    body: '<p>IncoBev Asia has been recognised for its sustainability leadership, earning an EcoVadis Bronze medal — placing us in the top 35% of companies assessed globally in our first assessment — alongside the NVPC Champion of Good award for our giving and volunteerism efforts.</p><p>These milestones reflect our ongoing commitment to responsible sourcing, responsible operations and creating shared value across the communities we serve.</p>',
  },
  {
    slug: 'thaifex-horec-asia-2027',
    category: 'Events',
    date: '5 Mar 2025',
    title: 'See You at THAIFEX – HOREC Asia 2027',
    excerpt: 'We look forward to connecting with our partners and customers in Bangkok.',
    image: 'assets/images/hospitality.jpg',
    body: '<p>IncoBev Asia will be joining THAIFEX – HOREC Asia 2027 in Bangkok. As we continue to grow our HORECA division in Thailand under IncoBev Thailand, this is a great opportunity to connect with partners and customers across the region.</p><p>Reach out to our team to arrange a meeting at the show.</p>',
  },
  {
    slug: 'la-marzocco-distributor-appointment',
    category: 'Partnerships',
    date: '20 Sep 2024',
    title: 'IncoBev Asia Appointed La Marzocco Distributor',
    excerpt: 'Strengthening our portfolio with a global leader in espresso equipment.',
    image: 'assets/images/equipment-c8.jpg',
    body: '<p>IncoBev Asia is proud to be appointed a distributor for La Marzocco, further strengthening our premium equipment portfolio. This partnership brings world-class espresso machines to our customers across Southeast Asia, backed by our technical service and customer success teams.</p>',
  },
  {
    slug: 'brewing-a-more-sustainable-future',
    category: 'Community',
    date: '18 Jan 2025',
    title: 'Brewing a More Sustainable Future',
    excerpt: 'Our ongoing initiatives to support people, communities and the environment.',
    image: 'assets/images/pillar-people.jpg',
    body: '<p>From diverting spent coffee grounds from landfill to investing in training hours for our people and partners, IncoBev Asia continues to embed sustainability across everything we do.</p><p>Guided by our five sustainability pillars and a clear path to net-zero, we are working with partners and communities to brew a more sustainable future.</p>',
  },
];
