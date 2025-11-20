"use client";

export default function SignupSidebar() {
  return (
    <div
      className="w-full relative overflow-hidden flex flex-col justify-center items-start p-12 lg:p-16"
      style={{
        backgroundImage:
          "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_5-u4qkmmy4nHtbVueIXPFJxcd8lPGm5K.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-md">
        {/* Logo/Brand */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            <div className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center">
              <span className="font-bold text-teal-700">✦</span>
            </div>
            <span className="text-sm font-medium text-white">Moirge AI</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight text-balance">
          Join Our Growing Marketplace
        </h1>

        {/* Subheading */}
        <p className="text-lg text-white/90 mb-8 leading-relaxed">
          Connect with hundreds of buyers and sellers. Build your business or
          find the perfect product with us.
        </p>

        {/* Features List */}
        <div className="space-y-4">
          {[
            { icon: "⚡", title: "Fast Setup", desc: "Get started in minutes" },
            { icon: "🔒", title: "Secure", desc: "Enterprise-grade security" },
            { icon: "📈", title: "Grow", desc: "Scale your business" },
            {
              icon: "👕",
              title: "Cloth Up",
              desc: "Find clothes that were created exactly for you",
            },
          ].map((feature, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="text-2xl mt-1">{feature.icon}</div>
              <div>
                <p className="font-semibold text-white">{feature.title}</p>
                <p className="text-sm text-white/75">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-sm text-white/80">
            <span className="font-semibold text-white">50,000+</span> sellers
            already growing with us and suggesting products to you
          </p>
        </div>
      </div>
    </div>
  );
}
