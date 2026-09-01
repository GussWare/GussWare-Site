import { BlogPost } from '../types';
import { ASSETS } from './assets';

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'architecture-human-centric-systems',
    slug: 'the-architecture-of-human-centric-systems',
    title: 'The Architecture of Human-Centric Systems',
    excerpt:
      'In an era dominated by algorithmic complexity, building systems that prioritize human intuition over sheer computational brute force is not just a design choice—it’s an operational imperative.',
    category: 'Technology',
    readTime: '8 min read',
    date: 'October 24, 2024',
    author: {
      name: 'Sarah Jenkins',
      role: 'Lead Architect',
      avatarUrl: ASSETS.sarahJenkins,
    },
    featuredImage: ASSETS.systemArchitecture,
    caption: 'Figure 1: Visual representation of modular node distribution in modern systems.',
    tags: ['Architecture', 'Human-Centric', 'Enterprise'],
    contentHtml: `
<p>The traditional approach to software architecture has often been characterized by a relentless pursuit of efficiency, scalability, and abstraction. We build monoliths, break them down into microservices, and orchestrate them with ever-increasing layers of complexity. While these technical achievements are significant, they frequently obscure the fundamental purpose of the software: serving human needs.</p>

<p>Human-centric architecture requires a paradigm shift. It demands that we evaluate technical decisions not just on their computational elegance, but on how they impact the developers who maintain them and the end-users who rely on them.</p>

<h2>The Fallacy of Pure Abstraction</h2>
<p>Abstraction is the lifeblood of software engineering. It allows us to manage complexity by hiding implementation details behind clean interfaces. However, excessive abstraction can create cognitive distance. When a developer must traverse ten layers of indirection to understand a simple data transformation, the system has prioritized theoretical purity over practical maintainability.</p>

<blockquote>
  "The best architectures do not hide complexity; they organize it in a way that aligns with human cognitive patterns."
</blockquote>

<p>We advocate for a constructivist approach—building systems from tangible, clearly defined blocks where the relationship between components is explicitly visible, rather than magically resolved at runtime.</p>

<h2>Principles of Human-Centric Design</h2>
<p>To implement this philosophy, we adhere to three core principles:</p>

<ol class="list-decimal pl-6 mb-8 font-body-lg text-body-lg text-on-surface-variant leading-relaxed space-y-4">
  <li><strong>Cognitive Proximity:</strong> Code that changes together should live close together. Grouping by feature rather than technical concern reduces context switching.</li>
  <li><strong>Predictable State:</strong> Systems should fail loudly and predictably. Silent failures and cascading errors are the enemies of trust.</li>
  <li><strong>Clear Boundaries:</strong> Boundaries between modules should be sharp and physical, not merely logical conventions enforced by discipline.</li>
</ol>

<h3>Implementing Predictable State</h3>
<p>Consider how state is managed in a typical application. A human-centric approach favors immutability and explicit state transitions. This reduces the mental burden required to trace data flow.</p>

<pre><code>// Example: Explicit state management pattern
const StateManager = {
  currentState: 'IDLE',
  
  transition(action, payload) {
    console.log(\`[Transition] \${this.currentState} -> \${action.type}\`);
    
    switch (this.currentState) {
      case 'IDLE':
        if (action.type === 'FETCH_START') {
          this.currentState = 'LOADING';
          return this.fetchData(payload);
        }
        break;
      case 'LOADING':
        if (action.type === 'FETCH_SUCCESS') {
          this.currentState = 'SUCCESS';
          return this.processData(action.data);
        }
        if (action.type === 'FETCH_ERROR') {
          this.currentState = 'ERROR';
          return this.handleError(action.error);
        }
        break;
    }
    throw new Error(\`Invalid transition: \${action.type} from \${this.currentState}\`);
  }
};</code></pre>

<p>In this pattern, the state machine is explicit. The developer doesn't need to hold the entire application state in their working memory; they only need to understand the current node and its valid edges.</p>

<h2>The Modular Building Block Metaphor</h2>
<p>Drawing from our brand's geometric heritage, we view components as interlocking blocks. A well-designed system resembles a physical structure where load-bearing walls are evident, and decorative elements can be swapped without risking collapse.</p>

<p>By prioritizing human comprehension in our architectural decisions, we build systems that are not only robust in production but resilient to team changes, shifting requirements, and the inevitable passage of time.</p>
    `,
  },
  {
    id: 'future-collaborative-development',
    slug: 'the-future-of-collaborative-development',
    title: 'The Future of Collaborative Development',
    excerpt: 'How distributed teams are shaping the next generation of digital products.',
    category: 'Technology',
    readTime: '5 min read',
    date: 'Oct 20, 2024',
    author: {
      name: 'Sarah Jenkins',
      role: 'Lead Architect',
      avatarUrl: ASSETS.sarahJenkins,
    },
    featuredImage: ASSETS.blogHeroWorkspace,
    caption: 'Modern collaborative workspace with distributed specialist guilds.',
    tags: ['Technology', 'Collaboration', 'Distributed Teams'],
    isHero: true,
  },
  {
    id: 'component-driven-development-at-scale',
    slug: 'component-driven-development-at-scale',
    title: 'Component-Driven Development at Scale',
    excerpt:
      'How we structure our front-end architectures to maintain consistency across massive enterprise applications without sacrificing agility.',
    category: 'Development',
    readTime: '5 min read',
    date: 'Oct 12, 2024',
    author: {
      name: 'David Thorne',
      role: 'Senior Frontend Engineer',
      avatarUrl: ASSETS.sarahJenkins,
    },
    featuredImage: ASSETS.modularComponents,
    tags: ['Development', 'React', 'Design Systems'],
  },
  {
    id: 'constructivist-aesthetic-modern-ui',
    slug: 'the-constructivist-aesthetic-in-modern-ui',
    title: 'The Constructivist Aesthetic in Modern UI',
    excerpt:
      'Applying architectural principles and geometric clarity to digital product design to create interfaces that feel structurally sound.',
    category: 'Design',
    readTime: '6 min read',
    date: 'Sep 28, 2024',
    author: {
      name: 'Elena Rostova',
      role: 'Principal Product Designer',
      avatarUrl: ASSETS.sarahJenkins,
    },
    featuredImage: ASSETS.uiWireframe,
    tags: ['Design', 'Constructivism', 'UI/UX'],
  },
  {
    id: 'building-high-trust-remote-guilds',
    slug: 'building-high-trust-remote-guilds',
    title: 'Building High-Trust Remote Guilds',
    excerpt:
      'Our methodology for fostering deep collaboration and psychological safety among distributed teams of independent contractors.',
    category: 'Culture',
    readTime: '10 min read',
    date: 'Sep 15, 2024',
    author: {
      name: 'Marcus Vance',
      role: 'Community Operations Lead',
      avatarUrl: ASSETS.sarahJenkins,
    },
    featuredImage: ASSETS.teamCollaboration,
    tags: ['Culture', 'Remote Work', 'Community'],
  },
  {
    id: 'scaling-mobile-apps-cross-platform',
    slug: 'scaling-mobile-apps-with-cross-platform-solutions',
    title: 'Scaling Mobile Apps with Cross-Platform Solutions',
    excerpt:
      'Architectural strategies for maintaining single-codebase mobile platforms across iOS and Android without compromising frame rates.',
    category: 'Development',
    readTime: '7 min read',
    date: 'Sep 02, 2024',
    author: {
      name: 'Liam Chen',
      role: 'Mobile Systems Specialist',
      avatarUrl: ASSETS.sarahJenkins,
    },
    featuredImage: ASSETS.mobileDevelopment,
    tags: ['Development', 'Mobile', 'React Native'],
  },
  {
    id: 'business-freelance-communities',
    slug: 'the-business-of-freelance-communities',
    title: 'The Business of Freelance Communities',
    excerpt:
      'Why the traditional agency model is being replaced by agile, self-governing specialist collectives with transparent pricing.',
    category: 'Business',
    readTime: '6 min read',
    date: 'Aug 24, 2024',
    author: {
      name: 'Marcus Vance',
      role: 'Community Operations Lead',
      avatarUrl: ASSETS.sarahJenkins,
    },
    featuredImage: ASSETS.businessFreelance,
    tags: ['Business', 'Freelance', 'Economics'],
  },
  {
    id: 'security-best-practices-modern-apis',
    slug: 'security-best-practices-for-modern-apis',
    title: 'Security Best Practices for Modern APIs',
    excerpt:
      'Defending distributed endpoints with token rotation, granular rate limiting, and zero-trust schema validation.',
    category: 'Guides',
    readTime: '9 min read',
    date: 'Aug 10, 2024',
    author: {
      name: 'Sarah Jenkins',
      role: 'Lead Architect',
      avatarUrl: ASSETS.sarahJenkins,
    },
    featuredImage: ASSETS.securityApis,
    tags: ['Guides', 'Security', 'APIs', 'DevOps'],
  },
];
