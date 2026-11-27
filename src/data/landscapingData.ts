export const BRAND_INFO = {
  name: 'Professional Landscapes',
  website: 'https://prolandscapesuk.com/',
  email: 'office@prolandscapesuk.com',
  officePhone: '01747 871740',
  officePhoneHref: 'tel:+441747871740',
  mattMobile: '07525 019205',
  mattMobileHref: 'tel:+447525019205',
  instagram: 'https://www.instagram.com/helloprofessionallandscapes/',
  facebook: 'https://www.facebook.com/profile.php?id=100083029072119',
  hours: '08:00 – 18:00',
} as const;

export interface ImageSpec {
  slug: string;
  width: number;
  height: number;
  alt: string;
}

export interface ServicePathway {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  summary: string;
  details: string[];
  ctaLabel: string;
  enquiryProjectType: string;
  primaryImage: ImageSpec;
  secondaryImages: ImageSpec[];
  comparison?: {
    sandstone: {
      title: string;
      description: string;
      image: ImageSpec;
    };
    porcelain: {
      title: string;
      description: string;
      image: ImageSpec;
    };
  };
}

export type PortfolioCategory =
  | 'All'
  | 'Patios & Stone'
  | 'Block Paving'
  | 'Brickwork'
  | 'Decking & Pergolas'
  | 'Garden Finishes';

export interface PortfolioProject {
  id: string;
  title: string;
  category: Exclude<PortfolioCategory, 'All'>;
  overview: string;
  visibleFeatures: string[];
  confirmedMaterials: string[];
  mainImage: ImageSpec;
  detailImages?: ImageSpec[];
  layoutSpan?: 'featured' | 'wide' | 'standard';
}

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  'All',
  'Patios & Stone',
  'Block Paving',
  'Brickwork',
  'Decking & Pergolas',
  'Garden Finishes',
];

export const HERO_IMAGE: ImageSpec = {
  slug: 'hero-tiered-garden',
  width: 1080,
  height: 608,
  alt: 'Tiered garden patio with rendered retaining wall, natural stone steps, rose borders, lawn, and timber summerhouse built by Professional Landscapes',
};

export const EXPERIENCE_IMAGES = {
  primary: {
    slug: 'porcelain-steps-wall',
    width: 1080,
    height: 527,
    alt: 'Raised light-grey porcelain terrace with inset matching steps, red-multi brick retaining wall, and freshly laid lawn',
  },
  detailOne: {
    slug: 'brick-wall-stepped',
    width: 1080,
    height: 486,
    alt: 'Stepped red-brick garden boundary wall with brick piers, stone caps, and timber gate',
  },
  detailTwo: {
    slug: 'porcelain-circle-gate',
    width: 1080,
    height: 810,
    alt: 'Circular cream porcelain garden patio edged with charcoal cobble setts and wrought-iron gate',
  },
} as const;

export const SERVICES_DATA: ServicePathway[] = [
  {
    id: 'service-patios',
    index: '01',
    title: 'Patios & Natural Stone',
    shortTitle: 'Patios & Paving',
    summary:
      'Patio construction tailored to your garden layout and property style, from warm multi-toned natural sandstone to crisp, modern porcelain paving.',
    details: [
      'Natural sandstone patios with varied tonal character and optional sealing to protect and enrich the stone',
      'Porcelain paving installed to exact bedding, jointing, and drainage requirements',
      'Bespoke patio layouts including circular focal terraces, recessed drainage channels, and integrated steps',
    ],
    ctaLabel: 'Discuss Your Patio',
    enquiryProjectType: 'Patio or paving',
    primaryImage: {
      slug: 'porcelain-dark-drain',
      width: 1080,
      height: 486,
      alt: 'Dark slate-toned porcelain patio with recessed linear drainage channel and multi-step brick risers',
    },
    secondaryImages: [
      {
        slug: 'sandstone-canopy',
        width: 1080,
        height: 810,
        alt: 'Warm multi-toned Indian sandstone patio laid beneath a timber porch canopy',
      },
      {
        slug: 'porcelain-cream-conservatory',
        width: 1080,
        height: 810,
        alt: 'Large-format cream porcelain patio extending along brick property and conservatory onto lawn',
      },
    ],
    comparison: {
      sandstone: {
        title: 'Natural Sandstone',
        description:
          'Chosen for a traditional, organic garden character. Each slab carries natural variations in colour and riven texture, and can be sealed to deepen the stone tones and provide long-term surface protection.',
        image: {
          slug: 'sandstone-canopy',
          width: 1080,
          height: 810,
          alt: 'Natural Indian sandstone paving showing warm buff and ochre tonal variation',
        },
      },
      porcelain: {
        title: 'Refined Porcelain Paving',
        description:
          'Selected for a crisp, contemporary finish with consistent slab sizing and clean joint lines. Available across light limestone, slate-grey, and patterned formats, laid to strict installation standards.',
        image: {
          slug: 'porcelain-cream-conservatory',
          width: 1080,
          height: 810,
          alt: 'Clean-lined cream porcelain patio alongside brick home and lawn',
        },
      },
    },
  },
  {
    id: 'service-block-paving',
    index: '02',
    title: 'Block Paving & Driveways',
    shortTitle: 'Block Paving',
    summary:
      'Interlocking block paving engineered for hard-wearing driveways, welcoming front entrances, and structured garden pathways.',
    details: [
      'Driveways built with contrasting border blocks, curved edges, and integrated linear drainage',
      'Herringbone pathways and multi-tone garden paving combinations',
      'Optional block sealing to protect the surface and bring out the colour of the paving',
    ],
    ctaLabel: 'Explore Paving Options',
    enquiryProjectType: 'Block paving or driveway',
    primaryImage: {
      slug: 'block-driveway-tree',
      width: 1080,
      height: 810,
      alt: 'Charcoal-grey block-paved driveway with contrasting dark border, linear drain, and neat box hedging',
    },
    secondaryImages: [
      {
        slug: 'block-driveway-curved',
        width: 810,
        height: 1080,
        alt: 'Curved multi-tone grey block-paved driveway with contrasting charcoal border',
      },
      {
        slug: 'block-path-roses',
        width: 810,
        height: 1080,
        alt: 'Herringbone block-paved garden path bordered by rose beds and manicured lawn',
      },
    ],
  },
  {
    id: 'service-brickwork',
    index: '03',
    title: 'Brickwork & Garden Walls',
    shortTitle: 'Brickwork',
    summary:
      'Clean, crisp brick structures built on properly proportioned foundations for lasting strength, boundary definition, and tiered garden levels.',
    details: [
      'Garden boundary walls, gate piers with stone pier caps, and decorative brickwork bonds',
      'Substantial retaining walls to create usable tiered garden levels',
      'Integrated brick-and-stone steps, curved walls, and entrance detailing',
    ],
    ctaLabel: 'Discuss Your Brickwork Project',
    enquiryProjectType: 'Brickwork or garden wall',
    primaryImage: {
      slug: 'brick-piers-iron-gate',
      width: 486,
      height: 1080,
      alt: 'Twin red-multi brick gate piers with stone pier caps, wrought-iron gate, granite cobble threshold, and garden wall',
    },
    secondaryImages: [
      {
        slug: 'brick-retaining-steps',
        width: 1080,
        height: 486,
        alt: 'Dark engineering brick retaining wall and corner garden steps topped with light porcelain treads',
      },
      {
        slug: 'brick-wall-stepped',
        width: 1080,
        height: 486,
        alt: 'Stepped red-brick garden wall and entrance piers with timber gate',
      },
    ],
  },
  {
    id: 'service-timber',
    index: '04',
    title: 'Decking, Pergolas & Fencing',
    shortTitle: 'Decking & Timber',
    summary:
      'Custom-built timber and composite structures that zone entertaining spaces, level sloped gardens, and frame boundaries with craft.',
    details: [
      'Timber and composite decking tailored with integrated steps, recessed planting pockets, and level transitions',
      'Bespoke timber pergolas designed for seating areas and climbing plants',
      'Traditional close-board, post-and-panel, picket, and contemporary slatted fencing',
    ],
    ctaLabel: 'Plan Your Outdoor Structure',
    enquiryProjectType: 'Decking',
    primaryImage: {
      slug: 'decking-summerhouse',
      width: 1080,
      height: 810,
      alt: 'Multi-level grooved timber decking with wide access steps leading up to a garden summerhouse',
    },
    secondaryImages: [
      {
        slug: 'pergola-curved-patio',
        width: 816,
        height: 391,
        alt: 'Bespoke curved-edge timber pergola over a grey porcelain patio with brick edging and lattice trellis',
      },
      {
        slug: 'decking-slatted-fence',
        width: 486,
        height: 1080,
        alt: 'Timber deck with recessed lavender bed and contemporary grey horizontal slatted privacy fencing',
      },
    ],
  },
  {
    id: 'service-finishes',
    index: '05',
    title: 'Garden Finishes & Lawn Installation',
    shortTitle: 'Lawns & Finishes',
    summary:
      'The finishing layers that tie a garden together—from raised sleeper beds and decorative gravel to thorough soil preparation and fresh turf.',
    details: [
      'Timber sleeper raised plant beds and tiered sleeper retaining steps',
      'Decorative gravel and chippings for low-maintenance pathways, patio perimeters, and stepping-stone routes',
      'Careful ground preparation and turf installation for an instant green lawn',
    ],
    ctaLabel: 'Improve Your Garden',
    enquiryProjectType: 'Lawn installation',
    primaryImage: {
      slug: 'sleeper-turf-steps',
      width: 1080,
      height: 810,
      alt: 'Freshly turfed two-tier lawn with timber sleeper retaining wall, lattice screen, and gravel-filled timber steps',
    },
    secondaryImages: [
      {
        slug: 'gravel-stepping-path',
        width: 486,
        height: 1080,
        alt: 'Porcelain stepping slabs set within grey-and-white decorative gravel chippings bordered by timber edging and lawn',
      },
      {
        slug: 'sleeper-patio-turf',
        width: 1080,
        height: 486,
        alt: 'Dark stone patio edged with oak sleepers, plum slate gravel pocket, and newly laid turf',
      },
    ],
  },
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-porcelain-terrace',
    title: 'Raised Porcelain Terrace & Brick Retaining Wall',
    category: 'Patios & Stone',
    overview:
      'Elevated large-format grey porcelain patio built above a freshly laid lawn with integrated matching steps and a red-multi brick retaining wall.',
    visibleFeatures: [
      'Inset two-tread porcelain steps',
      'Red-multi brick retaining wall along lawn perimeter',
      'Return brickwork planting edge',
    ],
    confirmedMaterials: ['Porcelain paving', 'Facing brickwork', 'Turf lawn'],
    mainImage: {
      slug: 'porcelain-steps-wall',
      width: 1080,
      height: 527,
      alt: 'Raised grey porcelain terrace with inset steps and red brick retaining wall beside lawn',
    },
    detailImages: [
      {
        slug: 'stone-granite-detail',
        width: 1080,
        height: 651,
        alt: 'Close-up of dark flamed porcelain paving joints and precision cut edges',
      },
    ],
    layoutSpan: 'featured',
  },
  {
    id: 'proj-tiered-courtyard',
    title: 'Two-Tier Garden Courtyard & Stone Steps',
    category: 'Brickwork',
    overview:
      'Split-level garden transformation pairing a sheltered lower seating terrace with a rendered retaining wall and stone staircase up to the upper lawn and summerhouse.',
    visibleFeatures: [
      'Rendered retaining wall dividing terrace and upper lawn',
      'Natural stone garden steps with timber fencing handrail side',
      'Upper lawn leading to timber summerhouse',
    ],
    confirmedMaterials: ['Natural stone', 'Rendered masonry', 'Timber fencing'],
    mainImage: {
      slug: 'hero-tiered-garden',
      width: 1080,
      height: 608,
      alt: 'Tiered garden courtyard with rendered retaining wall, stone steps, rose border, and summerhouse',
    },
    layoutSpan: 'wide',
  },
  {
    id: 'proj-brick-gate-piers',
    title: 'Brick Gate Piers, Cobble Threshold & Boundary Wall',
    category: 'Brickwork',
    overview:
      'Twin brick entrance piers capped with stone, framing a wrought-iron garden gate with a granite cobble threshold and full-width brick boundary wall behind.',
    visibleFeatures: [
      'Twin brick piers with overhanging stone pier caps',
      'Granite sett threshold bridging gravel drive and lawn',
      'Wrought-iron gate installation and brick rear boundary wall',
    ],
    confirmedMaterials: ['Red-multi brick', 'Stone pier caps', 'Decorative gravel'],
    mainImage: {
      slug: 'brick-piers-iron-gate',
      width: 486,
      height: 1080,
      alt: 'Brick gate piers with stone caps, wrought-iron gate, granite setts, and gravel drive',
    },
    detailImages: [
      {
        slug: 'brick-wall-stepped',
        width: 1080,
        height: 486,
        alt: 'Stepped brick boundary wall with timber field gate',
      },
    ],
    layoutSpan: 'standard',
  },
  {
    id: 'proj-timber-pergola',
    title: 'Curved-Edge Timber Pergola & Porcelain Seating Area',
    category: 'Decking & Pergolas',
    overview:
      'Bespoke corner timber pergola crafted over a grey porcelain patio with a curved brick-edged perimeter, slatted trellis panel, and stepping-stone side path.',
    visibleFeatures: [
      'Shaped pergola rafters supported on timber corner posts',
      'Curved brick edging framing the porcelain terrace',
      'Close-board fencing with top trellis detailing',
    ],
    confirmedMaterials: ['Treated timber', 'Porcelain paving', 'Close-board fencing'],
    mainImage: {
      slug: 'pergola-curved-patio',
      width: 816,
      height: 391,
      alt: 'Bespoke corner timber pergola above a grey porcelain patio with curved brick border',
    },
    detailImages: [
      {
        slug: 'pergola-amber-studio',
        width: 1080,
        height: 486,
        alt: 'Warm-stained timber pergola framing a natural grey stone patio and garden shed',
      },
    ],
    layoutSpan: 'wide',
  },
  {
    id: 'proj-block-driveway',
    title: 'Charcoal Block-Paved Driveway & Box Hedge Border',
    category: 'Block Paving',
    overview:
      'Full front-driveway installation in charcoal interlocking blocks, finished with a dark kerb border, linear drainage channel, and clean curve around an existing tree.',
    visibleFeatures: [
      'Curved block-paving edging around tree pit with gravel',
      'Full-width linear drainage channel across driveway',
      'Contrasting outer block border',
    ],
    confirmedMaterials: ['Interlocking block paving', 'Linear channel drain', 'Decorative gravel'],
    mainImage: {
      slug: 'block-driveway-tree',
      width: 1080,
      height: 810,
      alt: 'Charcoal block-paved driveway with curved tree border and linear drainage channel',
    },
    detailImages: [
      {
        slug: 'block-driveway-curved',
        width: 810,
        height: 1080,
        alt: 'Sweeping curved block-paved driveway with charcoal perimeter border',
      },
      {
        slug: 'block-driveway-flint',
        width: 810,
        height: 1080,
        alt: 'Charcoal block driveway bordered by warm clay edge blocks and channel drain',
      },
    ],
    layoutSpan: 'standard',
  },
  {
    id: 'proj-dark-porcelain-drain',
    title: 'Slate-Tone Porcelain Patio & Stepped Brick Risers',
    category: 'Patios & Stone',
    overview:
      'Clean-lined dark porcelain patio featuring a continuous black linear drainage grate along a multi-level brick-and-porcelain garden step transition.',
    visibleFeatures: [
      'Precision-mitred dark porcelain slabs',
      'Continuous linear slot drainage system',
      'Multi-tier brick risers with porcelain step treads',
    ],
    confirmedMaterials: ['Porcelain paving', 'Brickwork risers', 'Linear drainage'],
    mainImage: {
      slug: 'porcelain-dark-drain',
      width: 1080,
      height: 486,
      alt: 'Dark porcelain patio with continuous linear drainage channel and brick-riser steps',
    },
    detailImages: [
      {
        slug: 'porcelain-grey-border',
        width: 1080,
        height: 486,
        alt: 'Grey porcelain patio finished with a charcoal block border alongside lawn',
      },
    ],
    layoutSpan: 'wide',
  },
  {
    id: 'proj-timber-decking',
    title: 'Stepped Timber Decking & Summerhouse Terrace',
    category: 'Decking & Pergolas',
    overview:
      'Grooved timber deck platform with dual wide access steps leading directly to twin garden summerhouse doors.',
    visibleFeatures: [
      'Two wide timber access steps with clean fascia boards',
      'Flush timber deck run to summerhouse threshold',
      'Boundary fence and brickwork junction detailing',
    ],
    confirmedMaterials: ['Grooved timber decking'],
    mainImage: {
      slug: 'decking-summerhouse',
      width: 1080,
      height: 810,
      alt: 'Grooved timber decking platform with two wide steps leading to a timber summerhouse',
    },
    detailImages: [
      {
        slug: 'decking-slatted-fence',
        width: 486,
        height: 1080,
        alt: 'Timber decking with recessed planting bed and contemporary grey slatted privacy screen',
      },
    ],
    layoutSpan: 'standard',
  },
  {
    id: 'proj-sandstone-canopy',
    title: 'Indian Sandstone Patio Under Timber Porch',
    category: 'Patios & Stone',
    overview:
      'Random-coursed natural Indian sandstone patio laid around structural timber porch posts to create a sheltered outdoor dining terrace.',
    visibleFeatures: [
      'Mixed-size natural sandstone laying pattern',
      'Precision slab cuts around brick pier bases',
      'Flush transition to lawn edge',
    ],
    confirmedMaterials: ['Natural sandstone'],
    mainImage: {
      slug: 'sandstone-canopy',
      width: 1080,
      height: 810,
      alt: 'Warm multi-toned natural Indian sandstone patio laid beneath timber porch beams',
    },
    detailImages: [
      {
        slug: 'sandstone-charcoal-step',
        width: 1080,
        height: 810,
        alt: 'Dark riven sandstone patio with recessed inspection tray cover and brick door step',
      },
      {
        slug: 'sandstone-patio-gravel',
        width: 1080,
        height: 486,
        alt: 'Natural riven stone patio bordered by golden shingle gravel and stepping slabs',
      },
    ],
    layoutSpan: 'standard',
  },
  {
    id: 'proj-herringbone-path',
    title: 'Herringbone Brick-Paved Rose Walk',
    category: 'Block Paving',
    overview:
      'Long symmetrical garden entrance path laid in a 45-degree herringbone bond with stretcher-course soldier borders, flanked by planted rose beds and lawns.',
    visibleFeatures: [
      '45-degree herringbone interlocking pattern',
      'Double stretcher-course edging',
      'Aligned axis to period property entrance porch',
    ],
    confirmedMaterials: ['Multi-tone block paving'],
    mainImage: {
      slug: 'block-path-roses',
      width: 810,
      height: 1080,
      alt: 'Herringbone block-paved pathway flanked by rose borders leading to house entrance',
    },
    detailImages: [
      {
        slug: 'block-patio-studio',
        width: 1080,
        height: 810,
        alt: 'Herringbone block-paved garden patio wrapping around lawn and garden studio',
      },
    ],
    layoutSpan: 'standard',
  },
  {
    id: 'proj-sleeper-lawn',
    title: 'Two-Tier Lawn, Sleeper Retaining Wall & Gravel Steps',
    category: 'Garden Finishes',
    overview:
      'Sloped garden re-levelled with a sturdy timber sleeper retaining wall, topped with lattice screening, stepped gravel treads, and freshly laid turf.',
    visibleFeatures: [
      'Timber sleeper retaining wall with diamond lattice top',
      'Six-step timber and decorative gravel staircase',
      'Freshly prepared and turfed upper and lower lawns',
    ],
    confirmedMaterials: ['Timber sleepers', 'Decorative gravel', 'Turf lawn', 'Close-board fencing'],
    mainImage: {
      slug: 'sleeper-turf-steps',
      width: 1080,
      height: 810,
      alt: 'Two-tier fresh turf lawn retained by timber sleepers with gravel-filled timber steps',
    },
    detailImages: [
      {
        slug: 'gravel-stepping-path',
        width: 486,
        height: 1080,
        alt: 'Porcelain stepping slabs laid within grey-and-white gravel chippings alongside lawn',
      },
      {
        slug: 'sleeper-patio-turf',
        width: 1080,
        height: 486,
        alt: 'Charcoal stone patio retained by oak sleepers with decorative slate pocket and fresh turf',
      },
    ],
    layoutSpan: 'standard',
  },
  {
    id: 'proj-circular-porcelain',
    title: 'Circular Porcelain Patio & Cobble Edging',
    category: 'Patios & Stone',
    overview:
      'Curved circular seating pad crafted from light-toned porcelain slabs with a precision-cut charcoal cobble perimeter and slate chipping surround.',
    visibleFeatures: [
      'Circular porcelain layout cut to exact radius',
      'Charcoal cobble perimeter ring',
      'Blue-grey slate chippings surround up to wrought-iron gate',
    ],
    confirmedMaterials: ['Porcelain paving', 'Charcoal cobble border', 'Decorative slate chippings'],
    mainImage: {
      slug: 'porcelain-circle-gate',
      width: 1080,
      height: 810,
      alt: 'Circular porcelain patio ringed by charcoal setts and slate chippings before a garden gate',
    },
    layoutSpan: 'standard',
  },
  {
    id: 'proj-cream-porcelain',
    title: 'Conservatory Cream Porcelain Terrace & Lawn Edge',
    category: 'Patios & Stone',
    overview:
      'Expansive cream large-format porcelain terrace running seamlessly past house doors and conservatory, finished with recessed inspection covers and crisp lawn border.',
    visibleFeatures: [
      'Recessed manhole cover inlaid with matching porcelain cuts',
      'Clean straight edge meeting green lawn',
      'Continuous threshold along property and conservatory',
    ],
    confirmedMaterials: ['Porcelain paving'],
    mainImage: {
      slug: 'porcelain-cream-conservatory',
      width: 1080,
      height: 810,
      alt: 'Cream large-format porcelain patio running past brick home and white conservatory onto lawn',
    },
    detailImages: [
      {
        slug: 'porcelain-cream-detail',
        width: 1080,
        height: 810,
        alt: 'Detail of recessed porcelain manhole tray and flush jointing',
      },
    ],
    layoutSpan: 'standard',
  },
];

export const CREDENTIALS_LIST = [
  {
    title: '25+ Years of Landscaping Experience',
    detail:
      'Over two and a half decades of practical outdoor construction across patios, driveways, brickwork, timber structures, and garden finishes.',
  },
  {
    title: 'RHS Chelsea Flower Show',
    detail: 'Our landscaping work has been displayed at the RHS Chelsea Flower Show.',
  },
  {
    title: 'Hampton Court Flower Show',
    detail: 'Our landscaping work has been displayed at the Hampton Court Flower Show.',
  },
  {
    title: "Queen's Golden Jubilee Garden",
    detail:
      "Our team has worked on prestigious projects including the Queen's Golden Jubilee Garden at Windsor Great Park.",
  },
  {
    title: 'Tobermore Approved Installer',
    detail:
      'Stated on prolandscapesuk.com as a Tobermore Approved Installer (status stated by the business on its existing website).',
  },
  {
    title: 'Recommended by Sydenhams',
    detail:
      'Stated on prolandscapesuk.com as Recommended by Sydenhams (recommendation stated by the business on its existing website).',
  },
] as const;

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Initial Discussion',
    description:
      'Get in touch by phone, email, or our quotation form to tell us about your garden ideas, practical priorities, and the outdoor spaces you want to improve.',
  },
  {
    step: '02',
    title: 'Site Visit & Quotation',
    description:
      'We arrange a convenient site visit to look at your garden in person, talk through options on site, and prepare a free quotation.',
  },
  {
    step: '03',
    title: 'Project Planning',
    description:
      'Together we agree materials—whether natural sandstone, porcelain, block paving, brickwork, or timberwork—and finalise the layout and details involved.',
  },
  {
    step: '04',
    title: 'Landscaping Work',
    description:
      'Our close-knit team of family and friends carries out the groundwork, construction, and finishing touches with care until your new outdoor space is complete.',
  },
] as const;

export const ENQUIRY_PROJECT_TYPES = [
  'Patio or paving',
  'Block paving or driveway',
  'Brickwork or garden wall',
  'Decking',
  'Pergola',
  'Fencing',
  'Decorative gravel or garden beds',
  'Lawn installation',
  'Multiple landscaping services',
  'Other',
] as const;
