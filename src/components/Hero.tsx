export default function Hero() {
  return (
    <section className="pt-20 bg-[#f7f9fc]">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="order-2 md:order-1">
          <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-3">
            Cosmetic Dentist
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1b4f72] leading-tight mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Dr. Firas
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
            Dr. Firas is an experienced cosmetic dentist specialising in composite
            bonding, Invisalign, and minimal-prep veneers. With a gentle,
            minimally invasive approach, he helps patients achieve beautiful,
            natural-looking smiles they can be proud of.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#book"
              className="bg-[#1b4f72] text-white px-8 py-3.5 rounded-full font-medium text-sm hover:bg-[#154460] transition-colors text-center"
            >
              Book Free Consultation
            </a>
            <a
              href="#about"
              className="border border-[#1b4f72] text-[#1b4f72] px-8 py-3.5 rounded-full font-medium text-sm hover:bg-[#1b4f72] hover:text-white transition-colors text-center"
            >
              Learn More
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#c9a84c]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>5-Star Rated</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#1b4f72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>GDC Registered</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#1b4f72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Same Day Appointments</span>
            </div>
          </div>
        </div>

        {/* Photo */}
        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <div className="relative">
            <div className="w-72 h-80 md:w-96 md:h-[480px] rounded-2xl bg-gradient-to-br from-[#2e86c1] to-[#1b4f72] flex items-center justify-center overflow-hidden shadow-2xl">
              {/* Placeholder until a real photo is added */}
              <div className="text-center text-white px-6">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-lg" style={{ fontFamily: "var(--font-playfair)" }}>Dr. Firas</p>
                <p className="text-white/70 text-sm mt-1">BDS, MSc Cosmetic Dentistry</p>
              </div>
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-lg px-5 py-3 border border-gray-100">
              <p className="text-[#1b4f72] font-bold text-xl" style={{ fontFamily: "var(--font-playfair)" }}>500+</p>
              <p className="text-gray-500 text-xs">Smile Transformations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
