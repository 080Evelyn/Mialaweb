export default function Hero() {
  return (
    <section
      id="home"
      className="relative bg-cover bg-center min-h-[90dvh] rounded-b-[50px] flex items-center justify-center px-6 md:px-16"
      style={{
        backgroundImage: `url('https://st4.depositphotos.com/1558912/27173/i/450/depositphotos_271733254-stock-photo-skin-care-product-natural-cosmetic.jpg')`,
      }}
    >
      {/* Overlay, md screen up */}
      <div className="absolute inset-0 bg-white/70 md:bg-[#FFBFBF]/40 rounded-b-[50px]"></div>

      <div className="relative z-10 max-w-4xl text-center md:text-left">
        <h1 className="text-5xl md:text-6xl font-serif text-gray-900 leading-tight">
          “Nourish Your Skin. Celebrate Your Glow.”
        </h1>
        <p className="mt-4 text-gray-600 text-lg md:text-xl">
          Discover premium lotions, oils & skincare from{" "}
          <span className="font-semibold">Miala Beauty</span>.
        </p>
        <div className="mt-8">
          <a
            href="#products"
            className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition"
          >
            Explore Products
          </a>
        </div>
      </div>
    </section>
  );
}
