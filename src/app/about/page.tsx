

export default function AboutPage() {
  return (
    <div className="pb-24">
      {/* Page Header */}
      <section className="bg-white dark:bg-slate-900 py-8 border-b">
        <div className="px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              About FixMyEvent
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We're on a mission to make venue booking simple, secure, and stress-free.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Our Story
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                FixMyEvent was born from a simple observation: finding and booking the perfect venue 
                for events shouldn't be complicated. Whether it's a wedding, corporate event, or 
                special celebration, the process should be smooth and enjoyable.
              </p>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                What We Do
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We connect event planners with premium venues through our streamlined platform. 
                Our carefully curated selection ensures quality, while our booking process 
                eliminates the hassle of traditional venue hunting.
              </p>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Our Values
              </h2>
              <ul className="text-slate-600 dark:text-slate-400 space-y-3">
                <li><strong>Quality:</strong> Every venue is verified and meets our high standards</li>
                <li><strong>Simplicity:</strong> We believe the best solutions are the simplest ones</li>
                <li><strong>Trust:</strong> Building lasting relationships through transparency and reliability</li>
                <li><strong>Innovation:</strong> Continuously improving our platform and services</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
