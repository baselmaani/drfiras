// Adds (or updates) the Invisalign, teeth whitening and porcelain veneer guides.
// Re-running is safe: existing posts are updated in place and keep their publish date.
//
// Usage: node scripts/add-blog-posts.js [--dry-run]
"use strict";
const { Client } = require("pg");
require("dotenv").config();
const { BLOG_REDIRECTS } = require("../src/lib/blogRedirects");

const client = new Client({ connectionString: process.env.DATABASE_URL });
const dryRun = process.argv.includes("--dry-run");

const posts = [
  // ─── Invisalign ────────────────────────────────────────────────────────────
  {
    title: "Invisalign vs Braces in Dubai: Which Is Right for You?",
    slug: "invisalign-vs-braces-dubai",
    excerpt:
      "Invisalign and braces can both straighten teeth, but they work differently day to day. Compare how each treatment works, what living with it involves and which cases suit each option.",
    metaTitle: "Invisalign vs Braces in Dubai: Which Is Right for You? | Dr. Firas",
    metaDesc:
      "Compare Invisalign and braces in Dubai: how each works, comfort, appearance, daily care and which cases suit each. Book an orthodontic assessment with Dr. Firas.",
    metaKeywords:
      "Invisalign vs braces Dubai, Invisalign or braces, clear aligners vs braces, Invisalign Dubai, teeth straightening Dubai, orthodontic treatment Dubai, cosmetic dentist Dubai",
    content: `
<h2>Invisalign vs Braces: Two Ways to Straighten Teeth</h2>
<p>If your teeth overlap, have spaces between them or sit at different angles, orthodontic treatment can move them into a better position. Invisalign and traditional braces both do this, but the experience of each treatment is quite different.</p>
<p>For many adults in Dubai the choice comes down to appearance, lifestyle and the type of movement the teeth need. This guide explains how each option works so you can have a more informed conversation at your consultation with <a href="/about">Dr. Firas</a>.</p>

<h2>How Invisalign Works</h2>
<p><a href="/services/invisalign-dubai">Invisalign</a> uses a series of clear, removable aligners made from a digital scan of your teeth. Each set is designed to move the teeth a small amount. You change to the next set on a schedule set by your dentist, and the teeth move gradually towards the planned position.</p>
<p>Small tooth-coloured shapes called attachments are often bonded to some teeth. They give the aligners something to grip so that certain movements can happen more predictably. Attachments are removed at the end of treatment.</p>
<p>Because the aligners are removable, they only work while you wear them. Most treatment plans ask for aligners to be worn for around 20–22 hours a day and taken out only to eat, drink anything other than water, and clean your teeth.</p>

<h2>How Braces Work</h2>
<p>Traditional braces use brackets fixed to the teeth and connected by a wire. The wire is adjusted at regular appointments to guide tooth movement. Brackets may be metal or tooth-coloured ceramic.</p>
<p>Braces cannot be removed by the patient, so treatment continues around the clock without relying on daily wear. This can be an advantage for some people, but it also means more care is needed when eating and cleaning.</p>

<h2>Comparing Invisalign and Braces</h2>
<h3>Appearance</h3>
<p>Clear aligners are difficult to notice in everyday conversation, which is one of the main reasons adults choose them. Braces are more visible, although ceramic brackets are less noticeable than metal ones.</p>
<h3>Comfort</h3>
<p>Both treatments can cause pressure or tenderness for a day or two when a new stage starts. Aligners have smooth edges, while brackets and wires can rub the cheeks and lips until you adjust.</p>
<h3>Eating and Drinking</h3>
<p>With Invisalign you remove the aligners to eat, so there are no food restrictions. You do need to brush before putting them back in. With braces, hard and sticky foods are usually avoided because they can break brackets or bend wires.</p>
<h3>Cleaning</h3>
<p>Aligners come out, so brushing and flossing are similar to normal. Braces make cleaning around brackets harder and often need extra tools such as interdental brushes.</p>
<h3>Discipline</h3>
<p>Invisalign relies on you wearing the aligners consistently. If they are left out for long periods, teeth may not track as planned. Braces remove this responsibility because they are fixed in place.</p>
<h3>Types of Tooth Movement</h3>
<p>Modern aligners can treat a wide range of crowding, spacing and bite concerns. Some complex cases, such as large rotations, significant bite discrepancies or certain vertical movements, may be more predictable with fixed braces. Suitability is decided case by case.</p>

<h2>Which Option Suits You?</h2>
<p>Invisalign may suit you if you:</p>
<ul>
<li>Want a discreet option for work or social life</li>
<li>Are confident you can wear aligners for most of the day</li>
<li>Have mild to moderate crowding, spacing or bite concerns</li>
<li>Would like to eat normally and clean your teeth as usual</li>
</ul>
<p>Braces may be the better choice if your case needs movements that aligners handle less predictably, or if you would prefer an appliance that works without you having to manage it day to day.</p>

<h2>Straightening as Part of a Smile Makeover</h2>
<p>Some patients straighten their teeth first and then refine colour and shape afterwards. This is the idea behind an <a href="/blog/abc-smile-makeover-dubai-guide">ABC smile makeover</a>: align, bleach, then composite bonding. Moving teeth into a better position first can reduce how much cosmetic work is needed later.</p>
<p>If you are wondering whether bonding alone could hide minor crowding, see <a href="/blog/can-composite-bonding-fix-crooked-teeth-in-dubai">can composite bonding fix crooked teeth</a>. In many cases, alignment gives a more balanced long-term result.</p>

<h2>Book an Orthodontic Assessment</h2>
<p>The right choice depends on your teeth, bite, gum health and goals. At your consultation, Dr. Firas will assess your smile and explain whether Invisalign is suitable, what the treatment would involve and what alternatives may be worth considering.</p>
<p>If you are looking for a <a href="/">cosmetic dentist in Dubai</a> who plans straightening around your overall smile, <a href="/contact">book a consultation</a> to discuss your options.</p>
`,
    faqItems: [
      {
        question: "Is Invisalign as effective as braces?",
        answer:
          "For many mild to moderate cases of crowding, spacing and bite concerns, Invisalign can achieve results comparable to braces when the aligners are worn as instructed. Some complex movements may be more predictable with fixed braces, so suitability is assessed individually.",
      },
      {
        question: "Is Invisalign faster than braces?",
        answer:
          "Not necessarily. Treatment time depends mainly on how much the teeth need to move and how consistently aligners are worn, rather than on the appliance itself. Your dentist can estimate a timeframe after assessing your teeth.",
      },
      {
        question: "Can I switch from braces to Invisalign?",
        answer:
          "Sometimes. It depends on the stage of treatment and the movements still needed. An assessment is required to see whether aligners can complete the remaining treatment.",
      },
      {
        question: "Do I need a retainer after Invisalign or braces?",
        answer:
          "Yes. Teeth can drift back after any orthodontic treatment, so retainers are recommended afterwards to help hold the new position. Your dentist will explain how often to wear them.",
      },
    ],
    internalLinks: [
      { anchor: "Invisalign in Dubai", url: "/services/invisalign-dubai" },
      { anchor: "How long does Invisalign take?", url: "/blog/how-long-does-invisalign-take" },
      { anchor: "Invisalign for adults in Dubai", url: "/blog/invisalign-for-adults-dubai" },
      { anchor: "ABC smile makeover guide", url: "/blog/abc-smile-makeover-dubai-guide" },
      { anchor: "Cosmetic dentist in Dubai", url: "/" },
      { anchor: "About Dr. Firas", url: "/about" },
      { anchor: "Book a consultation", url: "/contact" },
    ],
  },
  {
    title: "How Long Does Invisalign Take? Timelines and What Affects Them",
    slug: "how-long-does-invisalign-take",
    excerpt:
      "Invisalign treatment can take anywhere from a few months to well over a year. Learn what affects the timeline, what happens at each stage and how to help your treatment stay on track.",
    metaTitle: "How Long Does Invisalign Take? Timelines Explained | Dr. Firas",
    metaDesc:
      "How long does Invisalign take? Learn typical timelines, what affects treatment length, refinements and retainers. Plan your Invisalign treatment with Dr. Firas in Dubai.",
    metaKeywords:
      "how long does Invisalign take, Invisalign treatment time, Invisalign timeline, Invisalign Dubai, clear aligners Dubai, Invisalign refinements, Invisalign retainers",
    content: `
<h2>How Long Does Invisalign Take?</h2>
<p>There is no single answer, because Invisalign treatment is planned around how far your teeth need to move. Minor adjustments to a few front teeth may take a few months. More involved crowding, spacing or bite correction often takes a year or longer.</p>
<p>Your estimated timeframe is worked out at the planning stage, once your teeth, bite and goals have been assessed. This guide explains what affects that estimate and what to expect from start to finish.</p>

<h2>What Affects Invisalign Treatment Time?</h2>
<h3>How Much Movement Is Needed</h3>
<p>Each aligner moves the teeth a small, controlled amount. The more movement your plan needs, the more aligners it takes and the longer treatment lasts. Closing a small gap is usually quicker than correcting significant crowding or a bite concern.</p>
<h3>Wearing the Aligners Consistently</h3>
<p>Aligners only work while they are in your mouth. Most plans ask for around 20–22 hours of wear a day. Regularly leaving them out can stop the teeth from tracking as planned, which may mean extra aligners and a longer treatment.</p>
<h3>How Your Teeth Respond</h3>
<p>Teeth move at slightly different rates in different people. Bone density, age and the type of movement all play a part. Your progress is checked at review appointments so the plan can be adjusted if needed.</p>
<h3>Refinements</h3>
<p>At the end of the first series of aligners, some teeth may need fine-tuning. A new scan can be taken and a short set of refinement aligners made. This is a normal part of many treatments and is not a sign that something has gone wrong.</p>

<h2>The Invisalign Journey Step by Step</h2>
<h3>1. Consultation and Assessment</h3>
<p><a href="/about">Dr. Firas</a> assesses your teeth, gums and bite and discusses what you would like to change. Any decay or gum problems usually need to be treated before orthodontic treatment begins.</p>
<h3>2. Digital Scan and Treatment Plan</h3>
<p>A digital scan is used to plan how the teeth will move. You can see a preview of the planned movements and discuss the expected number of aligners before you commit.</p>
<h3>3. Fitting Your First Aligners</h3>
<p>Attachments may be placed on some teeth, and you are shown how to fit, remove and clean your aligners.</p>
<h3>4. Changing Aligners and Reviews</h3>
<p>You move to each new set on the schedule set by your dentist, often every one to two weeks. Review appointments check that the teeth are tracking as planned.</p>
<h3>5. Finishing and Retention</h3>
<p>Once the teeth are in position, attachments are removed and retainers are provided. Retainers are an ongoing part of keeping the result, because teeth can drift over time.</p>

<h2>Tips to Keep Treatment on Track</h2>
<ul>
<li><strong>Wear your aligners as instructed:</strong> Put them straight back in after eating and brushing.</li>
<li><strong>Use a case:</strong> Wrapping aligners in a napkin at meals is one of the most common ways they get lost.</li>
<li><strong>Keep your review appointments:</strong> Small tracking issues are easier to correct early.</li>
<li><strong>Switch aligners on schedule:</strong> Do not move ahead early unless your dentist advises it.</li>
<li><strong>Tell your dentist about problems:</strong> If an aligner does not fit properly or an attachment comes off, get in touch.</li>
</ul>

<h2>Is a Shorter Option Possible?</h2>
<p>If your main concern is the edge or shape of a few front teeth rather than their position, a cosmetic option may be worth discussing. <a href="/services/composite-bonding-dubai">Composite bonding</a> can refine shape without moving teeth, but it is not a substitute for orthodontic treatment when teeth are significantly out of position. Some patients combine both in an <a href="/blog/abc-smile-makeover-dubai-guide">ABC smile makeover</a>.</p>

<h2>Get a Personal Timeline</h2>
<p>The most reliable way to know how long your treatment would take is an assessment. If you are looking for a <a href="/">Dubai cosmetic dentist experienced with Invisalign</a>, <a href="/contact">book a consultation</a> and Dr. Firas will explain your options, likely timeframe and what treatment would involve.</p>
`,
    faqItems: [
      {
        question: "Can Invisalign work in six months?",
        answer:
          "For some minor cases, such as small gaps or slight crowding of the front teeth, treatment may be completed in around six months. More complex cases usually take longer. Your timeframe is estimated after a full assessment.",
      },
      {
        question: "How many hours a day should I wear Invisalign?",
        answer:
          "Most treatment plans ask for aligners to be worn for around 20–22 hours a day. They should only come out to eat, drink anything other than water, and clean your teeth.",
      },
      {
        question: "What are Invisalign refinements?",
        answer:
          "Refinements are extra aligners made near the end of treatment to fine-tune teeth that need a little more movement. They are common and are planned from a new scan.",
      },
      {
        question: "How long do I need to wear retainers after Invisalign?",
        answer:
          "Retainers are needed long term to help keep teeth in their new position. Your dentist will explain how often to wear them, which is often full time at first and then at night.",
      },
    ],
    internalLinks: [
      { anchor: "Invisalign in Dubai", url: "/services/invisalign-dubai" },
      { anchor: "Invisalign vs braces in Dubai", url: "/blog/invisalign-vs-braces-dubai" },
      { anchor: "Invisalign for adults in Dubai", url: "/blog/invisalign-for-adults-dubai" },
      { anchor: "Cosmetic dentist in Dubai", url: "/" },
      { anchor: "About Dr. Firas", url: "/about" },
      { anchor: "Book a consultation", url: "/contact" },
    ],
  },
  {
    title: "Invisalign for Adults in Dubai: What to Know Before You Start",
    slug: "invisalign-for-adults-dubai",
    excerpt:
      "It is never too late to straighten your teeth. Learn why more adults in Dubai choose Invisalign, what to consider before starting and how aligners fit around work and social life.",
    metaTitle: "Invisalign for Adults in Dubai: What to Know Before You Start | Dr. Firas",
    metaDesc:
      "Considering Invisalign as an adult in Dubai? Learn about suitability, daily life with aligners, existing dental work and retainers. Book a consultation with Dr. Firas.",
    metaKeywords:
      "Invisalign for adults Dubai, adult Invisalign, adult orthodontics Dubai, clear aligners for adults, Invisalign Dubai, teeth straightening adults Dubai, cosmetic dentist Dubai",
    content: `
<h2>Is It Too Late to Straighten Your Teeth?</h2>
<p>Teeth can be moved at any age as long as the teeth and gums are healthy. Many adults choose to straighten their teeth years after childhood, either because they never had treatment or because their teeth have shifted since wearing braces.</p>
<p>For adults in Dubai, clear aligners are often preferred because they fit more easily into professional and social life. This guide covers what to know before you start <a href="/services/invisalign-dubai">Invisalign</a> as an adult.</p>

<h2>Why Adults Choose Invisalign</h2>
<ul>
<li><strong>Discreet:</strong> Clear aligners are hard to notice during meetings, presentations and events.</li>
<li><strong>Removable:</strong> You can take aligners out for meals and important occasions, then put them straight back in.</li>
<li><strong>Normal eating:</strong> There are no brackets to work around, so food restrictions are minimal.</li>
<li><strong>Easier cleaning:</strong> You brush and floss as usual with the aligners out.</li>
<li><strong>Digital planning:</strong> You can see a preview of the planned tooth movements before starting.</li>
</ul>

<h2>Common Reasons Adults Seek Treatment</h2>
<h3>Teeth That Have Moved Over Time</h3>
<p>Teeth can shift gradually throughout life. Many adults notice their lower front teeth becoming more crowded, especially if they stopped wearing a retainer after childhood braces.</p>
<h3>Crowding or Overlapping Teeth</h3>
<p>Crowded teeth can be harder to clean and may affect how the smile looks. Aligning them can make daily hygiene easier as well as improving appearance.</p>
<h3>Gaps Between Teeth</h3>
<p>Spaces between teeth can often be closed with aligners. Small gaps may also be treated with <a href="/blog/composite-bonding-for-teeth-gaps-in-dubai">composite bonding</a>, so it is worth discussing both options.</p>
<h3>Preparing for Cosmetic Treatment</h3>
<p>Straightening teeth before cosmetic work can reduce how much shaping or covering is needed later. This is the first step of an <a href="/blog/abc-smile-makeover-dubai-guide">ABC smile makeover</a>.</p>

<h2>What Adults Should Consider First</h2>
<h3>Gum and Bone Health</h3>
<p>Moving teeth needs healthy supporting gums and bone. Gum disease should be treated and stable before orthodontic treatment starts.</p>
<h3>Existing Dental Work</h3>
<p>Crowns, bridges, implants and large fillings affect how aligners and attachments work. Implants cannot be moved with orthodontics, so the plan has to work around them. Tell your dentist about any previous dental work.</p>
<h3>Daily Commitment</h3>
<p>Aligners need to be worn for most of the day, typically around 20–22 hours. Busy schedules, business travel and frequent dining out are all manageable, but they need some planning.</p>
<h3>Tooth Wear and Grinding</h3>
<p>If you grind or clench your teeth, mention it at your consultation. It can affect both the treatment plan and how your result is protected afterwards.</p>

<h2>Living With Aligners Day to Day</h2>
<p>Most adults adapt quickly. You may notice slight pressure for a day or two when you change to a new set, and your speech may feel different for the first few days. Carry your case, a travel toothbrush and water so you can clean your teeth before putting aligners back in.</p>
<p>Drinks other than plain water should usually be taken with the aligners out, because sugary or acidic drinks can be trapped against the teeth and hot drinks can affect the plastic.</p>

<h2>After Treatment: Keeping Your Result</h2>
<p>Retainers are an essential part of adult treatment. Without them, teeth can gradually move back. Once your teeth are aligned, you may also choose to brighten or refine your smile with <a href="/services/teeth-whitening-dubai">teeth whitening</a> or bonding.</p>

<h2>Start With a Consultation</h2>
<p>An assessment is the only way to confirm whether Invisalign is suitable for you. <a href="/about">Dr. Firas</a> will check your teeth, gums and bite, explain how treatment would fit around your routine and talk you through any alternatives.</p>
<p>Visit our <a href="/">cosmetic dental practice in Dubai</a> or <a href="/contact">book a consultation</a> to get started.</p>
`,
    faqItems: [
      {
        question: "Is there an age limit for Invisalign?",
        answer:
          "There is no upper age limit. Adults of any age may be suitable as long as their teeth and gums are healthy enough for orthodontic movement. An assessment confirms suitability.",
      },
      {
        question: "Can I have Invisalign if I have crowns or implants?",
        answer:
          "Often, yes. Crowns can usually be included, although attachments may need special bonding. Implants cannot be moved, so the treatment is planned around them. Your dentist will review any existing dental work first.",
      },
      {
        question: "Will Invisalign affect my speech?",
        answer:
          "Some people notice a slight lisp for the first few days while their tongue adjusts to the aligners. This usually settles quickly.",
      },
      {
        question: "My teeth moved after braces as a teenager. Can Invisalign fix this?",
        answer:
          "In many cases, yes. Relapse after earlier orthodontic treatment is a common reason adults choose Invisalign. Retainers are recommended afterwards to help prevent the teeth moving again.",
      },
    ],
    internalLinks: [
      { anchor: "Invisalign in Dubai", url: "/services/invisalign-dubai" },
      { anchor: "Invisalign vs braces in Dubai", url: "/blog/invisalign-vs-braces-dubai" },
      { anchor: "How long does Invisalign take?", url: "/blog/how-long-does-invisalign-take" },
      { anchor: "ABC smile makeover guide", url: "/blog/abc-smile-makeover-dubai-guide" },
      { anchor: "Cosmetic dentist in Dubai", url: "/" },
      { anchor: "About Dr. Firas", url: "/about" },
      { anchor: "Book a consultation", url: "/contact" },
    ],
  },

  // ─── Teeth whitening ───────────────────────────────────────────────────────
  {
    title: "Teeth Sensitivity After Whitening: Causes, Relief and Prevention",
    slug: "teeth-sensitivity-after-whitening",
    excerpt:
      "Sensitivity is the most common side effect of teeth whitening and is usually temporary. Learn why it happens, how long it lasts and how to keep whitening comfortable.",
    metaTitle: "Teeth Sensitivity After Whitening: Causes and Relief | Dr. Firas",
    metaDesc:
      "Why do teeth feel sensitive after whitening, and how long does it last? Learn causes, relief tips and how professional whitening in Dubai keeps treatment comfortable.",
    metaKeywords:
      "teeth sensitivity after whitening, sensitive teeth whitening, whitening sensitivity relief, teeth whitening Dubai, professional teeth whitening Dubai, teeth whitening side effects",
    content: `
<h2>Why Teeth Can Feel Sensitive After Whitening</h2>
<p>Sensitivity is the most common side effect of <a href="/services/teeth-whitening-dubai">teeth whitening</a>. Some people notice a mild ache or short, sharp twinges, particularly with cold drinks or cold air. For most patients it is temporary and settles within a few days.</p>
<p>Understanding why it happens can make it easier to manage, and in many cases it can be reduced with the right preparation.</p>

<h2>What Causes Whitening Sensitivity?</h2>
<p>Whitening gels work by allowing a peroxide-based ingredient to pass through the enamel and break down stain molecules inside the tooth. During this process the teeth can temporarily become more responsive to temperature.</p>
<p>The effect is usually stronger when:</p>
<ul>
<li>The teeth were already sensitive before whitening</li>
<li>There is exposed root surface from gum recession</li>
<li>There are worn areas, small cracks or leaking fillings</li>
<li>The whitening gel touches the gums or is used for longer than advised</li>
<li>Whitening sessions are repeated too close together</li>
</ul>

<h2>How Long Does It Last?</h2>
<p>For most people, sensitivity fades within 24 to 48 hours of a session. With a course of at-home whitening, it may come and go during treatment and then settle once it is finished.</p>
<p>Sensitivity that lasts more than a few days, is severe, or affects only one tooth should be checked. It may point to a separate problem, such as decay or a cracked tooth, that needs attention.</p>

<h2>How to Relieve Sensitivity</h2>
<ul>
<li><strong>Use a sensitivity toothpaste:</strong> Toothpastes made for sensitive teeth can help calm symptoms. Some dentists suggest starting one a couple of weeks before whitening.</li>
<li><strong>Avoid temperature extremes:</strong> Lukewarm food and drinks are more comfortable for a day or two.</li>
<li><strong>Space out sessions:</strong> With at-home whitening, your dentist may suggest shorter wear times or skipping a day.</li>
<li><strong>Use desensitising products if advised:</strong> Your dentist may recommend a gel to use in your trays between whitening sessions.</li>
<li><strong>Do not use more gel:</strong> A larger amount does not whiten faster and is more likely to irritate the gums.</li>
</ul>

<h2>How Professional Whitening Reduces the Risk</h2>
<p>A dental check before whitening helps identify issues that make sensitivity more likely, such as decay, recession or worn enamel. These can be treated or protected first.</p>
<p>In the clinic, the gums are protected during in-chair whitening and the treatment is supervised. For at-home whitening, custom-fitted trays help keep the gel on the teeth and away from the gums. To understand the differences between approaches, see <a href="/blog/in-clinic-vs-at-home-teeth-whitening">in-clinic vs at-home teeth whitening</a>.</p>
<p>For a wider look at safety, read <a href="/blog/is-professional-teeth-whitening-safe-in-dubai">is professional teeth whitening safe in Dubai</a>.</p>

<h2>Can You Whiten Teeth If They Are Already Sensitive?</h2>
<p>Often, yes, but the approach may need adjusting. A gentler at-home routine, shorter sessions or pre-treatment with a desensitising toothpaste can help. Your dentist will first check why the teeth are sensitive, because some causes need treating before whitening is appropriate.</p>

<h2>Talk to Dr. Firas About Comfortable Whitening</h2>
<p>If sensitivity has put you off whitening in the past, a consultation can help you understand your options. <a href="/about">Dr. Firas</a> will assess your teeth, discuss your sensitivity history and recommend an approach that suits you.</p>
<p>Visit our <a href="/">cosmetic dentistry practice in Dubai</a> or <a href="/contact">book a whitening consultation</a>.</p>
`,
    faqItems: [
      {
        question: "Is sensitivity after whitening normal?",
        answer:
          "Yes. Temporary sensitivity is the most common side effect of teeth whitening. It usually settles within a day or two of a session.",
      },
      {
        question: "Does whitening sensitivity mean my enamel is damaged?",
        answer:
          "Not usually. Professional whitening carried out as directed is not expected to damage healthy enamel. Sensitivity reflects a temporary change in how the tooth responds to temperature.",
      },
      {
        question: "What should I avoid after teeth whitening?",
        answer:
          "For a day or two, avoid very hot or cold food and drinks if your teeth feel sensitive. It also helps to limit strongly coloured food and drinks, such as coffee, tea and red wine, straight after treatment.",
      },
      {
        question: "When should I see a dentist about sensitivity?",
        answer:
          "Contact your dentist if sensitivity lasts more than a few days, is severe, or is focused on one tooth. These can be signs of a separate issue that needs checking.",
      },
    ],
    internalLinks: [
      { anchor: "Teeth whitening in Dubai", url: "/services/teeth-whitening-dubai" },
      { anchor: "Is professional teeth whitening safe?", url: "/blog/is-professional-teeth-whitening-safe-in-dubai" },
      { anchor: "In-clinic vs at-home teeth whitening", url: "/blog/in-clinic-vs-at-home-teeth-whitening" },
      { anchor: "How long does teeth whitening last?", url: "/blog/how-long-does-teeth-whitening-last" },
      { anchor: "Cosmetic dentist in Dubai", url: "/" },
      { anchor: "About Dr. Firas", url: "/about" },
      { anchor: "Book a whitening consultation", url: "/contact" },
    ],
  },
  {
    title: "Can You Whiten Teeth With Veneers, Bonding or Crowns?",
    slug: "teeth-whitening-with-veneers-bonding-or-crowns",
    excerpt:
      "Whitening lightens natural teeth, not veneers, bonding, crowns or fillings. Learn how existing dental work affects whitening and how to plan treatment to avoid a colour mismatch.",
    metaTitle: "Can You Whiten Teeth With Veneers, Bonding or Crowns? | Dr. Firas",
    metaDesc:
      "Whitening does not change the colour of veneers, composite bonding, crowns or fillings. Learn how to plan whitening around dental work in Dubai with Dr. Firas.",
    metaKeywords:
      "whitening with veneers, can you whiten composite bonding, whitening crowns, teeth whitening with fillings, teeth whitening Dubai, whitening before bonding, cosmetic dentist Dubai",
    content: `
<h2>Does Whitening Work on Dental Work?</h2>
<p>Teeth whitening lightens natural tooth structure. It does not change the colour of porcelain veneers, composite bonding, crowns, bridges or tooth-coloured fillings. These materials keep the shade they were made in.</p>
<p>That matters if you have visible dental work and are thinking about whitening. If the natural teeth become lighter but the restorations do not, the difference can become more noticeable. A little planning helps avoid this.</p>

<h2>How Different Restorations Respond</h2>
<h3>Porcelain Veneers and Crowns</h3>
<p>Porcelain is colour-stable and resists staining, but it cannot be whitened. If you have <a href="/services/porcelain-veneers-dubai">porcelain veneers</a> or crowns on some front teeth and want the neighbouring natural teeth whiter, the restorations may need replacing afterwards to match the new shade.</p>
<h3>Composite Bonding</h3>
<p>Composite resin does not lighten with whitening gel. Surface staining on bonding can sometimes be improved with professional polishing, but its underlying shade stays the same. If whitened teeth no longer match, the bonding may need refreshing or replacing.</p>
<h3>Tooth-Coloured Fillings</h3>
<p>Fillings on the front teeth behave like bonding. After whitening, an older filling may look darker than the surrounding tooth and may need replacing to blend in.</p>

<h2>Planning Whitening Before New Cosmetic Work</h2>
<p>If you are planning bonding, veneers or crowns and would like a brighter smile, whitening usually comes first. The new restorations can then be matched to your whitened shade.</p>
<p>The colour of whitened teeth can take a little time to settle. Many dentists wait around two weeks after whitening before selecting the final shade for new composite work.</p>
<p>This sequence is central to the <a href="/blog/abc-smile-makeover-dubai-guide">ABC smile makeover</a>, where whitening comes before composite bonding so the bonding matches the brighter natural teeth.</p>

<h2>If You Already Have Restorations</h2>
<p>Before whitening, your dentist will look at which teeth are restored, where those restorations are visible and how well they currently match. Options may include:</p>
<ul>
<li><strong>Whitening only the natural teeth</strong> when restorations are at the back of the mouth and not visible</li>
<li><strong>Whitening and then replacing</strong> visible bonding or fillings to match the new shade</li>
<li><strong>Polishing</strong> composite to remove surface staining where replacement is not needed</li>
<li><strong>Not whitening</strong> if the current match is good and the restorations are relatively new</li>
</ul>
<p>Discussing the full picture first helps you understand what changes, what stays the same and whether any further treatment would be needed.</p>

<h2>Whitening Teeth Next to Veneers: An Example</h2>
<p>Imagine a patient with two porcelain veneers on the central incisors who wants the rest of their smile brighter. Whitening would lighten the surrounding natural teeth but not the veneers. If the veneers already match the target shade, whitening may bring the smile into better balance. If not, the veneers may need replacing after the new shade has settled.</p>

<h2>Plan Your Whitening With Dr. Firas</h2>
<p>If you have existing dental work, a consultation before whitening helps avoid surprises. <a href="/about">Dr. Firas</a> will assess your teeth and restorations, explain how whitening is likely to affect your smile and plan any next steps.</p>
<p>Visit our <a href="/">Dubai cosmetic dentist practice</a> or <a href="/contact">book a consultation</a> to discuss <a href="/services/teeth-whitening-dubai">teeth whitening in Dubai</a>.</p>
`,
    faqItems: [
      {
        question: "Can veneers be whitened?",
        answer:
          "No. Porcelain veneers do not change colour with whitening gel. If neighbouring natural teeth are whitened, veneers may need replacing to match the new shade.",
      },
      {
        question: "Can composite bonding be whitened?",
        answer:
          "Composite does not lighten with whitening. Surface stains can sometimes be removed with polishing, but changing its shade usually means refreshing or replacing the bonding.",
      },
      {
        question: "Should I whiten my teeth before getting bonding or veneers?",
        answer:
          "Usually, yes, if you want a brighter result. Whitening first allows the new restorations to be matched to your lighter shade. Your dentist may wait around two weeks for the colour to settle before choosing the final shade.",
      },
      {
        question: "Will whitening damage my crowns or fillings?",
        answer:
          "Professional whitening is not expected to damage crowns or fillings, but it will not change their colour. Your dentist will check that existing restorations are sound before whitening.",
      },
    ],
    internalLinks: [
      { anchor: "Teeth whitening in Dubai", url: "/services/teeth-whitening-dubai" },
      { anchor: "ABC smile makeover guide", url: "/blog/abc-smile-makeover-dubai-guide" },
      { anchor: "Teeth sensitivity after whitening", url: "/blog/teeth-sensitivity-after-whitening" },
      { anchor: "Porcelain veneers in Dubai", url: "/services/porcelain-veneers-dubai" },
      { anchor: "Cosmetic dentist in Dubai", url: "/" },
      { anchor: "About Dr. Firas", url: "/about" },
      { anchor: "Book a consultation", url: "/contact" },
    ],
  },
  {
    title: "In-Clinic vs At-Home Teeth Whitening: Which Should You Choose?",
    slug: "in-clinic-vs-at-home-teeth-whitening",
    excerpt:
      "In-clinic whitening gives a faster change, while dentist-supervised at-home whitening works gradually. Compare speed, comfort and convenience to find the right option for your smile.",
    metaTitle: "In-Clinic vs At-Home Teeth Whitening: Which to Choose? | Dr. Firas",
    metaDesc:
      "Compare in-clinic and at-home teeth whitening: speed, comfort, sensitivity and maintenance. Find the right professional whitening option in Dubai with Dr. Firas.",
    metaKeywords:
      "in-clinic vs at-home teeth whitening, professional teeth whitening Dubai, at-home whitening trays, in-office teeth whitening, teeth whitening Dubai, whitening kits vs dentist",
    content: `
<h2>Two Ways to Whiten Professionally</h2>
<p>Professional <a href="/services/teeth-whitening-dubai">teeth whitening</a> is usually offered in two forms: in-clinic whitening, carried out in the dental chair, and at-home whitening, using custom trays and gel supplied by your dentist. Some patients use a combination of both.</p>
<p>Both approaches use peroxide-based gels to lighten natural tooth colour. The main differences are speed, how the treatment fits around your life and how it can be adjusted for comfort.</p>

<h2>In-Clinic Whitening</h2>
<p>In-clinic whitening takes place in a single appointment. The gums are protected with a barrier, the whitening gel is applied to the teeth and the treatment is monitored throughout.</p>
<h3>Advantages</h3>
<ul>
<li>A noticeable change in one visit</li>
<li>Supervised from start to finish</li>
<li>Useful before an event or when you want quick results</li>
</ul>
<h3>Things to Consider</h3>
<ul>
<li>Sensitivity may be more noticeable in the first day or two</li>
<li>Requires a dental appointment of an hour or more</li>
<li>Top-ups at home may be suggested to maintain the result</li>
</ul>

<h2>At-Home Whitening With Custom Trays</h2>
<p>For at-home whitening, impressions or a scan of your teeth are used to make thin, custom-fitted trays. You place a small amount of gel in the trays and wear them for the time your dentist advises, usually over a course of a couple of weeks.</p>
<h3>Advantages</h3>
<ul>
<li>Gradual change, so you can stop when you are happy with the shade</li>
<li>Easier to adjust if your teeth feel sensitive</li>
<li>Trays can be reused for future top-ups</li>
</ul>
<h3>Things to Consider</h3>
<ul>
<li>Results take longer to appear</li>
<li>Requires consistency over several days or weeks</li>
<li>Instructions need to be followed carefully</li>
</ul>

<h2>What About Shop-Bought Kits?</h2>
<p>Over-the-counter strips, pens and generic trays are widely available. They tend to contain lower concentrations of active ingredient, and generic trays may not fit well, allowing gel to touch the gums. They are also used without a dental check, so problems such as decay or leaking fillings can go unnoticed.</p>
<p>Professional whitening starts with an assessment so the treatment is suited to your teeth. Read more in <a href="/blog/is-professional-teeth-whitening-safe-in-dubai">is professional teeth whitening safe in Dubai</a>.</p>

<h2>Which Option Is Right for You?</h2>
<p>In-clinic whitening may suit you if you want a faster visible change, prefer the treatment to be fully supervised or have an event coming up.</p>
<p>At-home whitening may suit you if you prefer gradual control over your shade, have a history of <a href="/blog/teeth-sensitivity-after-whitening">sensitivity after whitening</a> or would like trays for future top-ups.</p>
<p>A combined approach, starting in the clinic and continuing at home, can work well for patients who want a quicker start and an easy way to maintain the result.</p>

<h2>Making Your Result Last</h2>
<p>Whatever method you choose, the result fades gradually with time. Coffee, tea, red wine and smoking speed this up. Good brushing, regular hygiene visits and occasional top-ups help. For more detail, see <a href="/blog/how-long-does-teeth-whitening-last">how long teeth whitening lasts</a>.</p>
<p>Remember that whitening does not change the colour of existing dental work. If you have visible bonding, veneers or crowns, read <a href="/blog/teeth-whitening-with-veneers-bonding-or-crowns">whitening with veneers, bonding or crowns</a> first.</p>

<h2>Find Your Whitening Option</h2>
<p><a href="/about">Dr. Firas</a> will check your teeth, discuss your goals and sensitivity history and recommend the approach that suits you. Visit our <a href="/">cosmetic dentist practice in Al Wasl, Dubai</a> or <a href="/contact">book a whitening consultation</a>.</p>
`,
    faqItems: [
      {
        question: "Is in-clinic whitening better than at-home whitening?",
        answer:
          "Neither is better for everyone. In-clinic whitening gives a faster change, while at-home whitening works gradually and is easier to adjust. Both can achieve good results when used as directed.",
      },
      {
        question: "How long does at-home whitening take to work?",
        answer:
          "Most people start to notice a difference within the first week, with a full course usually taking around two weeks. Timing depends on your teeth and the regime your dentist recommends.",
      },
      {
        question: "Can I combine in-clinic and at-home whitening?",
        answer:
          "Yes. Some patients start with an in-clinic session and use custom trays at home to continue or maintain the result.",
      },
      {
        question: "Are whitening strips from the pharmacy safe?",
        answer:
          "They are generally weaker than professional products, but they are used without a dental check and may not fit well. A dental assessment before whitening helps identify issues that should be treated first.",
      },
    ],
    internalLinks: [
      { anchor: "Teeth whitening in Dubai", url: "/services/teeth-whitening-dubai" },
      { anchor: "How long does teeth whitening last?", url: "/blog/how-long-does-teeth-whitening-last" },
      { anchor: "Teeth sensitivity after whitening", url: "/blog/teeth-sensitivity-after-whitening" },
      { anchor: "Whitening with veneers, bonding or crowns", url: "/blog/teeth-whitening-with-veneers-bonding-or-crowns" },
      { anchor: "Cosmetic dentist in Dubai", url: "/" },
      { anchor: "About Dr. Firas", url: "/about" },
      { anchor: "Book a whitening consultation", url: "/contact" },
    ],
  },

  // ─── Porcelain veneers ─────────────────────────────────────────────────────
  {
    title: "The Porcelain Veneers Process: What to Expect at Each Step",
    slug: "porcelain-veneers-process-what-to-expect",
    excerpt:
      "From the first consultation to the final fit, porcelain veneers are planned in stages. Learn what happens at each appointment, how your new smile is designed and what to expect afterwards.",
    metaTitle: "The Porcelain Veneers Process: What to Expect | Dr. Firas",
    metaDesc:
      "Step-by-step guide to the porcelain veneers process in Dubai: consultation, smile design, preparation, temporaries and fitting. Plan your veneers with Dr. Firas.",
    metaKeywords:
      "porcelain veneers process, veneers procedure steps, what to expect veneers, getting veneers Dubai, porcelain veneers Dubai, veneer appointments, smile design Dubai",
    content: `
<h2>How the Porcelain Veneers Process Works</h2>
<p><a href="/services/porcelain-veneers-dubai">Porcelain veneers</a> are thin, custom-made ceramic shells bonded to the front of the teeth to change their colour, shape or proportions. Because each veneer is made for you, treatment is carried out in stages over several appointments.</p>
<p>Knowing what happens at each step can make the process feel more predictable. The exact sequence depends on your teeth and the plan agreed with <a href="/about">Dr. Firas</a>, but most cases follow a similar path.</p>

<h2>Step 1: Consultation and Assessment</h2>
<p>The first appointment is about understanding what you would like to change and whether veneers are appropriate. Your teeth, gums and bite are examined, and photographs, X-rays or scans may be taken.</p>
<p>Any decay, gum disease or other dental problems usually need to be treated first. You will also discuss alternatives. Depending on your goals, <a href="/services/teeth-whitening-dubai">whitening</a>, composite bonding or orthodontic treatment may achieve some or all of what you want with less change to the teeth.</p>

<h2>Step 2: Smile Design and Preview</h2>
<p>Your new smile is planned around your face, lips and natural tooth proportions. This often involves photographs and a digital design.</p>
<p>A mock-up may be placed over your teeth using temporary material so you can see and feel the proposed shape before any preparation. This is a good moment to give feedback on length, shape and brightness.</p>

<h2>Step 3: Tooth Preparation</h2>
<p>To make room for the veneers, a thin layer of enamel is usually reshaped from the front of the teeth. The amount depends on the starting position and colour of the teeth and the planned result. In some cases little or no preparation is needed. Read more in our guide to <a href="/blog/no-prep-veneers-dubai">no-prep veneers</a>.</p>
<p>Local anaesthetic is typically used so the appointment is comfortable. Because enamel removal cannot be reversed, veneers should be seen as a long-term commitment.</p>

<h2>Step 4: Impressions or Digital Scan</h2>
<p>Once the teeth are prepared, a detailed scan or impression is taken and sent to the dental laboratory with the agreed design and shade. The ceramist then makes each veneer by hand or with digital milling, depending on the material.</p>

<h2>Step 5: Temporary Veneers</h2>
<p>While the final veneers are being made, temporary veneers are often placed to protect the prepared teeth and give you a preview of the new shape. Temporaries are less refined than the final veneers and need gentle care.</p>
<p>Living with temporaries for a short time is also a chance to notice anything you would like adjusted, such as length or how the teeth feel when speaking.</p>

<h2>Step 6: Try-In and Bonding</h2>
<p>Before the veneers are permanently fitted, they are tried in to check the fit, shape and colour. Once you are both happy, the teeth are cleaned and the veneers are bonded with a dental adhesive. Excess material is removed and the bite is checked and adjusted.</p>

<h2>Step 7: Review and Aftercare</h2>
<p>A review appointment is often arranged to check the gums, bite and how you are adjusting. If you grind or clench your teeth, a night guard may be recommended to protect the veneers.</p>
<p>Your teeth may feel slightly different for a few days while you get used to the new shape. For tips on keeping veneers in good condition, read <a href="/blog/how-to-care-for-porcelain-veneers">how to care for porcelain veneers</a>.</p>

<h2>How Long Does the Process Take?</h2>
<p>From preparation to fitting usually takes around two to three weeks, depending on the laboratory and the number of veneers. Planning and any preliminary treatment can add time before this stage.</p>

<h2>Is the Result Natural?</h2>
<p>Well-planned veneers are designed to suit your face and blend with your smile. For more on this, see <a href="/blog/do-veneers-look-natural">do veneers look natural?</a></p>

<h2>Start Planning Your Veneers</h2>
<p>If you are considering veneers, a consultation is the first step. Dr. Firas will explain whether veneers are suitable, what alternatives exist and how your smile would be designed.</p>
<p>Visit our <a href="/">cosmetic dentist practice in Dubai</a> or <a href="/contact">book a veneers consultation</a>.</p>
`,
    faqItems: [
      {
        question: "How many appointments do porcelain veneers take?",
        answer:
          "Most cases involve a consultation, a design or preview stage, a preparation appointment and a fitting appointment, followed by a review. The exact number depends on your plan and any preliminary treatment.",
      },
      {
        question: "Does getting veneers hurt?",
        answer:
          "Preparation is usually carried out with local anaesthetic, so most patients feel comfortable. Some temporary sensitivity or gum tenderness can occur afterwards.",
      },
      {
        question: "Can I see what my veneers will look like before they are made?",
        answer:
          "Often, yes. A digital design and a mock-up placed over your teeth can give you a preview of the planned shape so you can give feedback before preparation.",
      },
      {
        question: "Are porcelain veneers reversible?",
        answer:
          "Usually not, because most veneers need some enamel to be reshaped. This is why careful planning and a discussion of alternatives are important before treatment.",
      },
    ],
    internalLinks: [
      { anchor: "Porcelain veneers in Dubai", url: "/services/porcelain-veneers-dubai" },
      { anchor: "How to care for porcelain veneers", url: "/blog/how-to-care-for-porcelain-veneers" },
      { anchor: "No-prep veneers in Dubai", url: "/blog/no-prep-veneers-dubai" },
      { anchor: "Do veneers look natural?", url: "/blog/do-veneers-look-natural" },
      { anchor: "Cosmetic dentist in Dubai", url: "/" },
      { anchor: "About Dr. Firas", url: "/about" },
      { anchor: "Book a veneers consultation", url: "/contact" },
    ],
  },
  {
    title: "How to Care for Porcelain Veneers: Daily Habits and Long-Term Tips",
    slug: "how-to-care-for-porcelain-veneers",
    excerpt:
      "Porcelain veneers are durable, but the teeth and gums around them still need care. Learn the daily habits, foods and check-ups that help keep veneers looking their best.",
    metaTitle: "How to Care for Porcelain Veneers: Daily and Long-Term Tips | Dr. Firas",
    metaDesc:
      "Learn how to care for porcelain veneers: brushing, flossing, foods to watch, night guards and check-ups. Keep your veneers looking their best with Dr. Firas in Dubai.",
    metaKeywords:
      "how to care for porcelain veneers, veneers aftercare, veneers maintenance, cleaning veneers, porcelain veneers Dubai, veneers night guard, veneers tips",
    content: `
<h2>Why Veneer Care Matters</h2>
<p><a href="/services/porcelain-veneers-dubai">Porcelain veneers</a> are strong and resist staining, but they are bonded to natural teeth. The teeth underneath and the gums around them can still develop decay or gum disease, and the porcelain can chip if it is put under the wrong kind of pressure.</p>
<p>Good daily habits and regular check-ups protect both the veneers and the teeth that support them. They can also help veneers stay in good condition for many years. For more on lifespan, see <a href="/blog/how-long-do-porcelain-veneers-last">how long porcelain veneers last</a>.</p>

<h2>Daily Cleaning</h2>
<h3>Brushing</h3>
<p>Brush twice a day for two minutes with a soft or medium toothbrush, paying attention to the gumline where the veneer meets the tooth. An electric toothbrush can make this easier.</p>
<h3>Choosing a Toothpaste</h3>
<p>A regular fluoride toothpaste is usually suitable. Very abrasive whitening or charcoal toothpastes may dull the glaze over time and are best avoided unless your dentist recommends them.</p>
<h3>Cleaning Between Teeth</h3>
<p>Floss or interdental brushes remove plaque from between the teeth and around the veneer edges, where decay and gum inflammation often start. Clean between your teeth once a day.</p>

<h2>Food and Drink</h2>
<p>Porcelain itself resists staining much better than natural teeth, but the bonding edges and any natural teeth nearby can still pick up colour. Rinsing with water after coffee, tea or red wine helps.</p>
<p>The bigger risk is chipping. Take care with:</p>
<ul>
<li>Biting directly into very hard foods such as ice, hard sweets or nut shells</li>
<li>Biting into hard fruit with your front teeth. Cutting it into pieces is safer</li>
<li>Chewing pens, nails or other objects</li>
<li>Using your teeth to open packets or bottles</li>
</ul>

<h2>Protecting Veneers From Grinding and Impact</h2>
<p>Many people grind or clench their teeth at night without realising. This places heavy forces on veneers and can cause chips or fractures. If you grind, a custom night guard can protect your veneers and natural teeth.</p>
<p>If you play contact sports, wear a properly fitted mouthguard.</p>

<h2>Regular Dental Visits</h2>
<p>Routine check-ups allow your dentist to examine the veneer edges, look for early signs of decay or gum problems and check your bite. Professional cleaning removes build-up that brushing can miss. Let your hygienist know you have veneers so suitable polishing products are used.</p>

<h2>Whitening and Veneers</h2>
<p>Whitening products do not change the colour of porcelain. If you whiten your natural teeth, they may no longer match your veneers. Read <a href="/blog/teeth-whitening-with-veneers-bonding-or-crowns">whitening with veneers, bonding or crowns</a> before using any whitening product.</p>

<h2>When to Contact Your Dentist</h2>
<p>Get in touch if you notice:</p>
<ul>
<li>A chip, crack or rough edge</li>
<li>A veneer that feels loose or moves</li>
<li>Sensitivity that does not settle</li>
<li>Bleeding, swollen or receding gums around a veneer</li>
<li>A change in how your teeth bite together</li>
</ul>
<p>Small problems are often easier to address early. A loose veneer should be kept safe and brought to your appointment.</p>

<h2>Long-Term Care With Dr. Firas</h2>
<p>From planning to aftercare, <a href="/about">Dr. Firas</a> focuses on veneers that look natural and stay healthy over time. If you are new to veneers, see <a href="/blog/porcelain-veneers-process-what-to-expect">the porcelain veneers process</a> for what treatment involves.</p>
<p>Visit our <a href="/">cosmetic dentistry practice in Dubai</a> or <a href="/contact">book a consultation</a> for a check of your veneers or to discuss treatment.</p>
`,
    faqItems: [
      {
        question: "Can porcelain veneers stain?",
        answer:
          "Porcelain is highly stain-resistant, but the bonding edges and nearby natural teeth can pick up colour over time. Good cleaning and regular hygiene visits help keep the smile looking even.",
      },
      {
        question: "What toothpaste should I use with veneers?",
        answer:
          "A regular fluoride toothpaste is usually suitable. Avoid very abrasive whitening or charcoal toothpastes unless your dentist recommends them, as they may dull the surface over time.",
      },
      {
        question: "Do I need a night guard with veneers?",
        answer:
          "If you grind or clench your teeth, a night guard is often recommended to help protect veneers from chipping. Your dentist can check for signs of grinding.",
      },
      {
        question: "What should I do if a veneer chips or comes off?",
        answer:
          "Contact your dentist as soon as possible. Keep a loose veneer safe and bring it with you. Small chips can sometimes be repaired, while larger damage may need a replacement veneer.",
      },
    ],
    internalLinks: [
      { anchor: "Porcelain veneers in Dubai", url: "/services/porcelain-veneers-dubai" },
      { anchor: "How long do porcelain veneers last?", url: "/blog/how-long-do-porcelain-veneers-last" },
      { anchor: "The porcelain veneers process", url: "/blog/porcelain-veneers-process-what-to-expect" },
      { anchor: "Whitening with veneers, bonding or crowns", url: "/blog/teeth-whitening-with-veneers-bonding-or-crowns" },
      { anchor: "Cosmetic dentist in Dubai", url: "/" },
      { anchor: "About Dr. Firas", url: "/about" },
      { anchor: "Book a consultation", url: "/contact" },
    ],
  },
];

// Every post must link to the home page and Dr. Firas, never into a retired
// redirect, only to live or new blog posts, and must not quote prices.
function validate(post, liveSlugs) {
  const errors = [];
  const text = [post.content, ...post.faqItems.map((f) => f.answer)].join("\n");
  const hrefs = [...post.content.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  const urls = [...hrefs, ...post.internalLinks.map((l) => l.url)];

  for (const required of ["/", "/about"]) {
    if (!hrefs.includes(required)) errors.push(`content has no link to ${required}`);
    if (!post.internalLinks.some((l) => l.url === required)) errors.push(`internalLinks has no ${required}`);
  }
  for (const url of urls) {
    const slug = url.match(/^\/blog\/([a-z0-9-]+)$/)?.[1];
    if (!slug) continue;
    if (slug in BLOG_REDIRECTS) errors.push(`links to retired post ${url}`);
    else if (!liveSlugs.has(slug)) errors.push(`links to unknown post ${url}`);
    if (slug === post.slug) errors.push(`links to itself`);
  }
  if (/\bAED\b|dirham|\bDhs?\b/i.test(text)) errors.push("mentions a price");
  if (/<h2>[^<]*(FAQ|Frequently)/i.test(post.content)) errors.push("inline FAQ section duplicates faqItems");
  return errors;
}

async function main() {
  await client.connect();

  const { rows } = await client.query(`SELECT slug FROM "Post" WHERE published`);
  const liveSlugs = new Set([...rows.map((r) => r.slug), ...posts.map((p) => p.slug)]);

  let failed = false;
  for (const post of posts) {
    const errors = validate(post, liveSlugs);
    const words = post.content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    console.log(
      `${errors.length ? "✗" : "✓"} ${post.slug}: ${words} words, ${post.faqItems.length} FAQs, ${post.internalLinks.length} related links`,
    );
    for (const e of errors) console.log(`    ${e}`);
    if (errors.length) failed = true;
  }
  if (failed) throw new Error("Validation failed — nothing written.");
  if (dryRun) return console.log("\nDRY RUN — nothing written.");

  await client.query("BEGIN");
  // Today's date, a few minutes apart so the blog list keeps this order.
  const now = Date.now();
  for (const [i, post] of posts.entries()) {
    await client.query(
      `INSERT INTO "Post" (title, slug, excerpt, content, published, "publishedAt", "metaTitle", "metaDesc", "metaKeywords", "faqItems", "internalLinks", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, true, $5, $6, $7, $8, $9, $10, NOW(), NOW())
       ON CONFLICT (slug) DO UPDATE SET
         title=EXCLUDED.title, excerpt=EXCLUDED.excerpt, content=EXCLUDED.content, published=true,
         "metaTitle"=EXCLUDED."metaTitle", "metaDesc"=EXCLUDED."metaDesc", "metaKeywords"=EXCLUDED."metaKeywords",
         "faqItems"=EXCLUDED."faqItems", "internalLinks"=EXCLUDED."internalLinks", "updatedAt"=NOW()`,
      [
        post.title, post.slug, post.excerpt, post.content.trim(), new Date(now - (posts.length - i) * 5 * 60_000),
        post.metaTitle, post.metaDesc, post.metaKeywords,
        JSON.stringify(post.faqItems), JSON.stringify(post.internalLinks),
      ],
    );
  }
  await client.query("COMMIT");
  console.log(`\nSaved ${posts.length} posts.`);
}

main()
  .catch(async (e) => {
    await client.query("ROLLBACK").catch(() => {});
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => client.end());
