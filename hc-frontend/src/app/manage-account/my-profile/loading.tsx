function Bar({
  w = "100%",
  h = 16,
  className = "",
}: {
  w?: string;
  h?: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded bg-gray-200 ${className}`}
      style={{ width: w, height: h }}
    />
  );
}

function Circle({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-full bg-gray-200 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export default function Loading() {
  return (
    <>
      <section
        className="animate-pulse"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-labelledby="profile-loading-title"
      >
        <h1 id="profile-loading-title" className="sr-only">
          Loading My Profile
        </h1>

        {/* ---------- Mobile ---------- */}
        <section className="md:hidden" aria-labelledby="mobile-profile-loading">
          <h2 id="mobile-profile-loading" className="sr-only">
            My Profile (mobile)
          </h2>

          {/* Sticky-like MobileHeader (55px) */}
          <header className="fixed top-0 left-0 right-0 z-50 h-[55px] border-b border-gray-200 bg-white flex items-center px-4">
            <Bar w="120px" h={22} />
            <div className="ml-auto">
              <Circle size={36} />
            </div>
          </header>

          <div className="pt-[70px] pb-20 px-8">
            {/* Avatar */}
            <div className="flex flex-col items-center py-6">
              <Circle size={144} />
            </div>

            {/* Display rows (view mode) */}
            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
                <div className="flex-1">
                  <Bar w="80px" h={14} />
                  <div className="mt-1">
                    <Bar w="70%" h={18} />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
                <div className="flex-1">
                  <Bar w="110px" h={14} />
                  <div className="mt-1">
                    <Bar w="60%" h={18} />
                  </div>
                </div>
                <div className="shrink-0 pt-4">
                  <Bar w="88px" h={18} />
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
                <div className="flex-1">
                  <Bar w="160px" h={14} />
                  <div className="mt-1">
                    <Bar w="80px" h={18} />
                  </div>
                </div>
                <div className="shrink-0 pt-3">
                  <div
                    className="rounded-full bg-gray-200"
                    style={{ width: 40, height: 22 }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
                <div className="flex-1">
                  <Bar w="60px" h={14} />
                  <div className="mt-1">
                    <Bar w="75%" h={18} />
                  </div>
                </div>
                <div className="shrink-0 pt-4">
                  <Bar w="88px" h={18} />
                </div>
              </div>

              {/* Email verify incentive (placeholder) */}
              <div className="mt-4">
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Circle size={28} />
                    <Bar w="60%" h={16} />
                  </div>
                  <div className="mt-3">
                    <div
                      className="rounded bg-gray-200"
                      style={{ width: 160, height: 36, borderRadius: 8 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Desktop ---------- */}
        <section
          className="max-md:hidden"
          aria-labelledby="desktop-profile-loading"
        >
          <h2 id="desktop-profile-loading" className="sr-only">
            My Profile (desktop)
          </h2>

          {/* Title row with Edit button */}
          <div className="border-b-2 pb-2 flex items-center justify-between mb-8">
            <Bar w="140px" h={24} />
            <div
              className="rounded bg-gray-200"
              style={{ width: 84, height: 36, borderRadius: 8 }}
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:gap-6 xl:gap-10 2xl:gap-20 space-y-8 lg:space-y-0">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <Circle size={160} />
            </div>

            {/* Form body */}
            <div className="flex-1 space-y-6">
              {/* Name */}
              <div className="space-y-2 w-2/3">
                <Bar w="60px" h={14} />
                <Bar h={44} />
              </div>

              {/* Phone + WhatsApp */}
              <div className="mt-1 flex flex-col lg:flex-row items-end lg:items-center justify-between lg:gap-4">
                <div className="flex flex-col w-full lg:w-fit 2xl:w-3/4">
                  <Bar w="110px" h={14} />
                  <div className="mt-1">
                    <Bar w="320px" h={44} />
                  </div>
                  <div className="mt-2">
                    <Bar w="100px" h={18} />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 lg:mt-0">
                  <Circle size={40} />
                  <Bar w="150px" h={18} />
                  <div
                    className="rounded-full bg-gray-200"
                    style={{ width: 44, height: 24 }}
                  />
                </div>
              </div>

              {/* Email + verify */}
              <div className="space-y-3 w-2/3">
                <Bar w="48px" h={14} />
                <Bar h={44} />
                <div className="space-y-4">
                  <Bar w="130px" h={18} />
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 max-w-md">
                    <div className="flex items-center gap-3">
                      <Circle size={28} />
                      <Bar w="60%" h={16} />
                    </div>
                    <div className="mt-3">
                      <div
                        className="rounded bg-gray-200"
                        style={{ width: 180, height: 40, borderRadius: 8 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 border-t-2 pt-4 flex justify-between shadow-sm">
                <div
                  className="rounded bg-gray-200"
                  style={{ width: 100, height: 40, borderRadius: 8 }}
                />
                <div
                  className="rounded bg-gray-200"
                  style={{ width: 120, height: 40, borderRadius: 8 }}
                />
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
