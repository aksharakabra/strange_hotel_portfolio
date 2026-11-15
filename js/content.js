/* Everything the site says lives here. Add your links and details,
   and later clusters will read from this file. */
window.HOTEL = {
  owner: {
    name: 'Akshara Kabra',
    studying: 'MCA (Integrated), DAVV Indore',
    links: {
      github: 'https://github.com/aksharakabra',
      linkedin: 'https://www.linkedin.com/in/akshara-kabra-4939a0382',
      email: 'aksharakabra02@gmail.com'
    }
  },

  clerk: { name: 'Foxie' },   // the mascot behind the desk

  /* words on the entrance screen (first visit only) */
  entrance: {
    signLines: ['ring for', 'service'],
    hint: 'tap the bell',
    hintSmall: 'or press any key, or swipe up',
    bellLabel: 'Ring the bell to enter the hotel',
    skip: 'Skip intro',
    staff: 'Staff entrance',
    welcome: 'Welcome to Hotel Akshara. You are in the lobby.'
  },

  /* the lobby: what Foxie says, and what is on the desk and wall (edit freely) */
  lobby: {
    ringMe: 'ring me',
    banner: ['DREAM', 'STUDY', 'CODE', 'TRAVEL', 'BE HAPPY'],           // the hanging banner
    books: ['DSA & CP', 'Web Dev', 'DBMS', 'Japanese', 'Self Care'],     // book stack, top to bottom (max 5)

    arrival: 'Oh! A guest! Hold on, let me finish this coffee...',       // only right after the entrance
    greeting: {                                                           // by the visitor's local time
      morning: 'Good morning! The coffee is hot and the day is young.',
      afternoon: 'Good afternoon! Perfect time for a tour.',
      evening: 'Good evening! Golden hour at the front desk.',
      night: 'Still up? Same. Lo-fi on, lights low. Welcome in.'
    },
    intro: "I'm Foxie. Ring the bell if you need anything.",

    firstRing: 'Ding! Welcome, welcome. Here is your key. It opens every floor. Probably.',
    ask: 'So, what brings you here?',
    askAgain: 'Where to?',
    moreRings: [
      'One bell is plenty. I heard you the first time.',
      "...You're enjoying this, aren't you?",
      'Ding ding. Okay, okay! I am awake.'
    ],
    chips: [                         // label, floor id (see floors below), and Foxie's reply
      { label: 'Projects', floor: 'workshop', say: "The Workshop, floor 3. Don't touch the red switch." },
      { label: 'Certificates', floor: 'trophy', say: 'The Trophy Room, floor 2. Wipe your feet, the keys are shiny.' },
      { label: 'Posters', floor: 'gallery', say: 'The Poster Gallery, floor 4. Bring a flashlight.' },
      { label: 'Skills', floor: 'minibar', say: 'The Minibar, floor 1. Everything is served chilled.' },
      { label: 'Research', floor: 'archive', say: 'The Archive, floor 5. Mostly empty. For now.' },
      { label: 'Just looking', floor: null, say: 'Take the elevator on the right. The buttons are labelled. Mostly.' }
    ],
    idle: [                          // when you click Foxie
      'I am not overthinking. I am planning ahead.',
      'Dream. Study. Code. Travel. Be happy.',
      'Japan is on the list. Ask me again in a few years.',
      'The best code is written after coffee and before panic.',
      'The roof opens at graduation. No, I will not let you peek.',
      'Fun fact: this hotel has no 13th floor. It has no 6th floor either. Yet.'
    ],
    baby: 'Shh! The little one is sleeping.',
    back: ['Back already? Welcome back!', 'The coffee is still warm.', 'Find what you were looking for?']
  },

  /* ===== STAFF ENTRANCE (staff.html) and CV page (cv.html) =====
     Everything marked `placeholder: true` is fake text so you can see the layout.
     Replace it with your own, then delete the `placeholder: true` line.
     Links (GitHub, LinkedIn, email) come from owner.links at the top of this file. */
  staff: {
    headline: 'MCA (Integrated) student at DAVV, Indore. Web development, data structures and databases.',
    location: 'Indore, India',
    badgeNote: 'Status: still checked in',
    photo: 'images/akshara.jpg',        
    cv: {
      pdf: 'images/cv.pdf',                 
      image: 'images/Akshara_Kabra_CV (2)_page-0001.jpg'                 
    },
    about: {
      placeholder: true,
      text: [
        'I am a computer science student pursuing MCA (Integrated) at Devi Ahilya Vishwavidyalaya (DAVV), Indore. I am interested in software development, data structure, and AI.I have a strong foundation in programming languages such as C++, Python, and SQL, and I am constantly seeking opportunities to enhance my skills and knowledge in the field of computer science.Two random facts about me are I love drawings and I learn languages during my free time. I am working on my japanese language skills and also I learnt basic korean too'
      ]
    },
    education: [
      { degree: 'MCA (Integrated)', school: 'Devi Ahilya Vishwavidyalaya (DAVV), Indore', years: '2025 to 2030' }
    ],
    /* Projects feed the Workshop AND the Staff page. Optional: status ('shipped' | 'half' | 'sketch'),
       progress (0 to 100), blurb (short teaser for the Workshop). */
    projects: [
      { title: 'Sutairu frontend project', blurb: 'A front-end build in plain HTML and CSS.', description: 'This is my first ever frontend project. Sutairu is a way to say "style" is Japanese. This is a pinterest themed site but especially for fashion. I learnt a lot through this project like tags, pathways and how to get ideas, themes of website and much more.', tech: ['HTML', 'CSS'], code: 'https://github.com/aksharakabra/sutairu_frontend-project', live: '' },
      { title: 'DBMS assignment (IC-2K25-06)', blurb: 'Database work, written in SQL.', description: 'This is my database management lab-work written in SQL, to be specific only mysql. I learnt a lot like queries, subqueries, functions, joins and more about database design and optimization.', tech: ['SQL'], code: 'https://github.com/aksharakabra/IC-2K25-06_DBMS_AKSHARA_KABRA', live: '' },
      { title: 'Data structures assignment (IC-2K25-06)', blurb: 'Data structures, written in C++.', description: 'This is my data structures coursework written in C++. I learnt a lot about algorithms, complexity analysis, and implementation details.', tech: ['C++', 'Data structures'], code: 'https://github.com/aksharakabra/IC-2K25-06_DS_AKSHARA_KABRA', live: '' }
    ],
    /* Certificates feed the Trophy Room (one key each) AND the Staff page. `url` can be a LinkedIn
       link or a file in assets/ (e.g. 'assets/cert1.jpg'). `type`, `opens`, `skills`, `learned` and `image` (a picture of the certificate)
       are shown in the Trophy Room when you open a key. */
    certificates: [
      { name: 'BE10X AI Tools Workshop', skills: ['AI tools', 'Prompting'], learned: 'learn to use of google LLMs, Claude projects, Higgsfield for video making, Julius ai and much more', image: 'images/b10x.jpg', issuer: 'BE10X', year: '2026', type: 'Completion', opens: 'Opens: the freedom of frelancing', url: '' },
      { name: 'SQL 70: from basics to windows', skills: ['SQL', 'Joins', 'Window functions'], learned: 'Learned advanced SQL techniques including joins and window functions. ', image: 'images/sql70.jpg', issuer: 'DevTown', year: '2026', type: 'Completion', opens: 'Opens: the filing cabinet of tables', url: '' },
      { name: 'Smart India Hackathon', skills: ['Teamwork', 'Problem solving'], learned: 'Participated in a national-level hackathon, enhancing teamwork and problem-solving skills and even got selected in second level. Learned about making prototype overnight too.', image: 'images/SIH.jpg', issuer: 'Smart India Hackathon', year: '2026', type: 'Participation', opens: 'Opens: the all-night team room', url: '' },
      { name: '5-day bootcamp: DBMS and SQL Mastery', skills: ['DBMS', 'SQL'], learned: 'Gained hands-on experience with database management and SQL query optimization.', image: 'images/sql-mastery.jpg', issuer: 'DevTown', year: '2026', type: 'Participation', opens: 'Opens: the vault of queries', url: '' },
      { name: 'Data Science Career Roadmap session', skills: ['Data science', 'Career planning'], learned: 'Gained insights into the career path of a data scientist and the skills required for success.', image: 'images/data-science.jpg', issuer: 'Skillected', year: '2026', type: 'Completion', opens: 'Opens: the map room', url: '' },
      { name: 'Microsoft student certificate', skills: ['Microsoft tools'], learned: 'Developed proficiency in using Microsoft tools for development and productivity.', image: 'images/js-unlocked.jpg', issuer: 'DevTown x Microsoft', year: '2026', type: 'Certificate', opens: 'Opens: the blue-window suite', url: '' },
      { name: 'Google Developer Group certificate', skills: ['Google technologies'], learned: 'Gained experience with Google technologies and best practices.', image: 'images/js google.jpg', issuer: 'DevTown x Google Developer Group', year: '2026', type: 'Certificate', opens: 'Opens: the four-colour balcony', url: '' },
      { name: 'The Future of Full Stack Development', skills: ['Full stack', 'Web'], learned: 'Explored emerging trends and technologies in full stack development.', image: 'images/fullstack.jpg', issuer: 'HCL', year: '2026', type: 'Participation', opens: 'Opens: the full-stack elevator', url: '' }
    ],
    posters: [
      { title: 'Introduction to data structure', event: '2026', image: 'images/unit1.jpg' },
      { title: 'Sorting and searching algorithms', event: '2026', image: 'images/unit2.jpg' },
      { title: 'Linked lists', event: '2026', image: 'images/unit3.jpg' },
      { title: 'Stacks', event: '2026', image: 'images/unit4.jpg' },
      { title: 'Queue', event: '2026', image: 'images/unit5.jpg' },
      { title: 'Trees', event: '2026', image: 'images/unit6.jpg' },
      { title: 'Graphs', event: '2026', image: 'images/unit7.jpg' }
    ],
    research: [],               // none yet: the section stays hidden. Later: { title, description, url }
    /* Skills feed the Minibar (one bottle each, one shelf per group) AND the Staff page.
       `mood` is the shelf's funny subtitle (Minibar only). Keep or edit the lists freely. */
    skills: [
      { group: 'Programming languages', mood: 'Daily drivers', items: ['C++', 'Python', 'SQL'] },
      { group: 'Web', mood: 'Fresh from the oven', items: ['Front-end development', 'HTML', 'CSS', 'JavaScript'] },
      { group: 'Core subjects', mood: 'The sturdy stuff', items: ['Data structures', 'DBMS', 'Algorithms'] },
      { group: 'Tools', mood: 'Always within reach', items: ['Git and GitHub', 'VS Code'] },
      { group: 'Spoken languages', mood: 'Still chilling', items: ['Japanese (learning)'] }
    ],
    updated: ''                 // e.g. 'November 2026'
  },

  /* the Workshop floor (cluster 5): words only. The machines come from staff.projects above. */
  workshop: {
    tagline: 'Things I build, switch by switch.',
    status: { shipped: 'Shipped', half: 'Half-finished', sketch: 'Just a sketch' },
    powerOn: 'Power everything',
    powerOff: 'Lights out',
    allOn: 'Every machine is running.',
    allOff: 'The workshop is quiet.',
    more: 'The rest of the mess lives on',
    noGithub: 'GitHub link coming soon',
    keyLabel: 'Workshop key'
  },

  /* the Trophy Room floor (cluster 6): words only. The keys come from staff.certificates. */
  trophy: {
    tagline: 'Every certificate is a key to somewhere.',
    hint: 'Pick a key. Each one opens a door to one certificate.',
    goal: 'Collect all {n} keys to get the Master key. It opens the Roof.',
    learned: 'What I took from it',
    skillsLabel: 'Skills',
    count: 'keys on the ring',
    first: 'Choose a key to see what it opens.',
    master: 'Master key unlocked. You have collected every key.',
    masterLabel: 'Master key',
    empty: 'No keys yet. Add certificates in js/content.js (staff.certificates).',
    view: 'View certificate',
    noLink: 'Certificate link coming soon'
  },

  /* the Poster Gallery floor (cluster 7): words only. The posters come from staff.posters. */
  gallery: {
    tagline: 'Seven posters, one dark room, one flashlight.',
    hint: 'Move your pointer (or drag a finger) to light the wall. Move to either edge to keep scrolling.',
    lightsOn: 'Lights on',
    lightsOff: 'Lights off',
    keyLabel: 'Gallery key',
    close: 'Close',
    prev: 'Previous poster',
    next: 'Next poster',
    open: 'Open poster',
    noImage: 'Poster image goes here',
    empty: 'No posters yet. Add them in js/content.js (staff.posters).'
  },

  /* the Minibar floor (cluster 8): words only. The bottles come from staff.skills. */
  minibar: {
    tagline: 'Skills, chilled and ready to serve.',
    open: 'Open the fridge',
    close: 'Close the fridge',
    hint: 'Pop a bottle to taste a skill.',
    poured: 'poured',
    all: 'Fridge emptied. Foxie is mildly concerned.',
    keyLabel: 'Minibar key',
    empty: 'The fridge is empty. Add skills in js/content.js (staff.skills).'
  },

  /* the Archive floor (cluster 9): notes and (future) research papers.
     Notes: add as many as you like. Research papers come from staff.research (empty for now:
     the `ghosts` below show as empty spines until you add real ones).
     WHAT TO WRITE: a note is 2 or 3 plain sentences about something you learned or built: a topic
     explained in your own words, a mistake and what fixed it, what a hackathon or course taught you.
     Add a link (a LinkedIn post, a GitHub README or a Google Doc) in `url` if the longer version lives elsewhere. */
  archive: {
    tagline: 'Nothing here yet. Everything here soon.',
    notesShelf: 'Notes',
    notesMood: 'Written in the margins',
    papersShelf: 'Research papers',
    papersMood: 'Books still being written',
    how: 'Short notes on things I am learning, one book each. Pull one out to read. The dashed spines are future research papers.',
    hint: 'Pull a book off the shelf to read about it.',
    ghosts: ['Paper no. 1', 'Paper no. 2', 'Paper no. 3'],
    ghostTitle: 'Not written yet',
    ghostText: 'This spot is saved for a future research paper. Check back later.',
    status: { written: 'Finished', draft: 'Draft' },
    read: 'Read it',
    noLink: 'Link coming soon',
    keyLabel: 'Archive key',
    notes: [
      { title: 'What I learned at Smart India Hackathon', date: 'Month 2026', status: 'draft', tags: ['hackathon', 'teamwork'], summary: 'Our team made a software SuDisha to help people in any disaster situation. I learnt about replit, espo go, lovable, SIH buddy and more, i learnt about prototypes, presentation, tackling stage fear and giving presentations and more.', url: '' },
      { title: 'SQL joins experience', date: 'Month 2026', status: 'written', tags: ['SQL', 'DBMS'], summary: 'I read the theory and thought it was hell of difficult but when i did the queries in my sql it was the easiest', url: '' },
      { title: 'Why I like front-end work', date: 'Month 2025', status: 'written', tags: ['front-end'], summary: 'I am a creative person who enjoys building things that people can see and interact with and front end made it possible all thanks to my teacher ragini mam and anshul sir, they helped me take interest with html to all the way in front end.', url: '' },
      { title: 'One person i am most thankful for', status: 'draft', tags: ['C++', 'DSA'], summary: 'My DSA teacher DR. Shaligram prajapat, he helped me a lot in thinking beyond the four walls of college.', url: '' }
    ]
  },

  /* the Roof (cluster 11): locked until graduation. The Master key (Trophy Room) opens a peek. */
  roof: {
    tagline: 'Locked. The view is worth the wait.',
    lockedSign: 'Opens at graduation',
    opensOn: '',                       // e.g. 'June 2029' (shown under the lock when set)
    rattle: ['Locked.', 'Still locked.', 'The roof is not ready for visitors.', 'Rattling harder will not help. (It is cute though.)'],
    needKey: 'This lock wants the Master key. Collect every certificate key in the Trophy Room.',
    keyReady: 'The Master key is on your ring. Try the lock.',
    unlock: 'Click. The Master key turns.',
    peekTitle: 'A peek at the roof',
    letterTitle: 'Dear future me,',
    letter: [
      'Dear future me,',
      'I hope you are happy and successful and hope you are not regreting any missing opportunities. I hope you are still learning and exploring new things. I hope you are still travelling and enjoying the nature. I hope you are still coding and building new things. I hope you are still reading books and learning new languages. I hope you are still enjoying the little things in life and not taking anything for granted.'
    ],
    sign: '(signed) Akshara, from the third floor of the hotel',
    star: 'You caught a shooting star. Make a wish.',
    keyLabel: 'Roof key'
  },

  /* the Basement (cluster 11): the part of me that is not on the resume. Boxes open to reveal facts. */
  basement: {
    tagline: "The part of me that isn't on the resume.",
    hint: 'Pull the string for light. Open a box.',
    pull: 'Pull the light string',
    boxes: [
      { label: 'Favourites', text: 'food: dal-chawal-kadhi, place: the forests of south india, book: the subtle art of not giving a fuck, genre: horror or bl' },
      { label: 'Currently learning', text: 'Japanese, korean, DSA, whimsical vibecoding' },
      { label: 'Comfort things', text: 'learning new language, kadhi-chawal, sunsets, walking on beach at night, travelling through the nature, reading book in the noncrowded train, hindi literature and poetry' },
      { label: 'Weird fact', text: 'I have an itch to learn any random useless skills like i know morse code, i can throw cards like knifes, i learned basic intro in six languages, i can do a split and much more. Also my music taste is weird...' },
      { label: 'Dream', text: 'work in a big company in a different country and buy a house, car for family' },
      { label: 'Foxie says', text: 'foxie says you are awesome! Have a good day!' }
    ],
    keyLabel: 'Basement key'
  },

  /* secrets (cluster 11): see js/secrets.js. Type a word anywhere on the main page, or click the sign. */
  secrets: {
    foxie: 'Foxie zooms by with her coffee.',
    japan: 'Sakura petals, just for you.',
    coffee: 'Foxie says: refill?',
    manager: 'You found the manager. (There is no manager. It is just Akshara.)',
    keyLabel: 'Secret key',
    hintWords: ['foxie', 'japan', 'coffee']
  },

  startFloor: 'lobby',

  /* Floors from the top of the building to the bottom.
     id      : used in the web address (index.html#workshop)
     label   : what's printed on the elevator button
     accent  : this floor's accent color */
  floors: [
    {
      id: 'roof', tip: 'A locked surprise', label: 'R', name: 'The Roof', kicker: 'Top of the hotel',
      tagline: 'Locked. The view is worth the wait.',
      sign: 'Opens at graduation', accent: '#F4E9D3'
    },

    {
      id: 'archive', tip: 'Notes and research papers', label: '5', name: 'The Archive', kicker: 'Floor 5',
      tagline: 'Nothing here yet. Everything here soon.',
      sign: 'Books still being written', accent: '#D9C7A5'
    },

    {
      id: 'gallery', tip: 'My 7 academic posters', label: '4', name: 'Poster Gallery', kicker: 'Floor 4',
      tagline: 'Seven posters, one dark room, one flashlight.',
      sign: 'Hanging posters. Mind the ladder.', accent: '#F2B84B'
    },

    {
      id: 'workshop', tip: 'Projects I have built', label: '3', name: 'The Workshop', kicker: 'Floor 3',
      tagline: 'Things I build, switch by switch.',
      sign: 'Machines warming up', accent: '#E8798A'
    },

    {
      id: 'trophy', tip: 'Certificates, one key each', label: '2', name: 'Trophy Room', kicker: 'Floor 2',
      tagline: 'Every certificate is a key to somewhere.',
      sign: 'Polishing the keys', accent: '#F5CF7A'
    },

    {
      id: 'minibar', tip: 'My skills', label: '1', name: 'The Minibar', kicker: 'Floor 1',
      tagline: 'Skills, chilled and ready to serve.',
      sign: 'Restocking', accent: '#7FD1B9'
    },

    {
      id: 'lobby', tip: 'Start here: the front desk', label: 'L', name: 'The Lobby', kicker: 'Ground floor',
      tagline: 'Ring the bell. Someone will come. Probably.',
      sign: 'Foxie is at the desk', accent: '#F2B84B'
    },

    {
      id: 'basement', tip: 'The fun side of me', label: 'B', name: 'The Basement', kicker: 'Below ground',
      tagline: "The part of me that isn't on the resume.",
      sign: 'Staff only (for now)', accent: '#9AA3E0'
    }
  ]
};
